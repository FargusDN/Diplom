import os
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from clickhouse_driver import Client
import psycopg2
import logging
from typing import Dict, Any
from airflow.operators.dummy import DummyOperator



logger = logging.getLogger(__name__)

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2025, 1, 1),
    'retries': 3,
    'retry_delay': timedelta(minutes=2),
    'max_active_runs': 1,
    'concurrency': 1,
}

def get_clickhouse_client() -> Client:
    """Надежное подключение к ClickHouse с резервными вариантами"""
    connection_params = {
        'host': os.getenv('CLICKHOUSE_HOST', 'host.docker.internal'),
        'port': int(os.getenv('CLICKHOUSE_HTTP_PORT', '18123')),  # Используем HTTP порт
        'user': os.getenv('CLICKHOUSE_USER', 'admin'),
        'password': os.getenv('CLICKHOUSE_PASSWORD', 'admin_user_1234'),
        'database': os.getenv('CLICKHOUSE_DB', 'ios_click_db'),
        'settings': {
            'connect_timeout': 10,
            'send_receive_timeout': 300,
            'max_block_size': 100000,
            'insert_block_size': 50000,
        },
        'compression': False
    }

    for attempt in range(3):
        try:
            client = Client(**connection_params)
            # Проверяем подключение простым запросом
            client.execute('SELECT 1')
            logger.info("Successfully connected to ClickHouse")
            return client
        except Exception as e:
            logger.warning(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt == 2:  # Последняя попытка
                logger.error("All connection attempts to ClickHouse failed")
                raise
            # Пробуем нативный порт если HTTP не работает
            if connection_params['port'] == int(os.getenv('CLICKHOUSE_HTTP_PORT', '18123')):
                connection_params['port'] = int(os.getenv('CLICKHOUSE_NATIVE_PORT', '19000'))
            else:
                connection_params['port'] = int(os.getenv('CLICKHOUSE_HTTP_PORT', '18123'))

def get_postgres_connection():
    """Создание подключения к PostgreSQL с обработкой ошибок"""
    try:
        return psycopg2.connect(
            host=os.getenv('POSTGRES_EXTERNAL_HOST', 'host.docker.internal'),
            dbname=os.getenv('POSTGRES_EXTERNAL_DB', 'ios_ystu_db'),
            user=os.getenv('POSTGRES_EXTERNAL_USER', 'admin'),
            password=os.getenv('POSTGRES_EXTERNAL_PASSWORD', 'admin_user_1234'),
            port=os.getenv('POSTGRES_EXTERNAL_PORT', '5432'),
            connect_timeout=5
        )
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL: {str(e)}")
        raise

def get_dates(**context) -> tuple:
    """Определение дат для выборки несколькими способами"""
    # Способ 1: Из параметров запуска DAG
    params = context.get('params', {})
    if 'date1' in params and 'date2' in params:
        date1 = (datetime.strptime(params['date1'], '%Y-%m-%d') - timedelta(days=1)).strftime('%Y-%m-%d')
        date2 = params['date2']
        return date1, date2

    # Способ 2: Из переменных Airflow
    try:
        date1 = (datetime.strptime(Variable.get("ETL_DATE_FROM"), '%Y-%m-%d') - timedelta(days=1)).strftime('%Y-%m-%d')
        date2 = Variable.get("ETL_DATE_TO")
        return date1, date2
    except:
        pass

    # Способ 3: По умолчанию - текущий день (без отступа в 7 дней)
    execution_date = context['execution_date']
    date1 = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')  # Убираем 1 день
    date2 = execution_date.strftime('%Y-%m-%d')  # Только текущий день
    return date1, date2


def pg_to_pg_extract_data_from_source(**context) -> Dict[str, Any]:
    """Извлечение данных с возможностью указания своих дат"""
    conn = None
    try:
        date1, date2 = get_dates(**context)
        logger.info(f"Using date range: {date1} to {date2}")

        conn = get_postgres_connection()
        with conn.cursor() as cursor:
            query = f"""
            select
                tms.temp_mark_id,
                tms.signal_ind,
                ui.login_user,
                concat(ui.last_name, ' ', substring(ui.first_name,1, 1), substring(ui.middle_name,1, 1)) as "student_fio",
                sg.group_name,
                tms.kourse, 
                tms.semestr, 
                d.discipline_name, 
                case 
                    when m.mark_number = 0
                    then null
                    else m.mark_number
                end as mark_number,
                m.mark_name,
                tms.mark_dt, 
                tms.create_dttm,
                tms.change_dttm
                from {os.getenv('POSTGRES_SOURCE_SCHEMA', 'public')}.user_info ui 
                join {os.getenv('POSTGRES_SOURCE_SCHEMA', 'public')}.temp_marks_student tms on tms.user_id = ui.user_id and ui.user_status = 'Студент' 
                and coalesce(tms.change_dttm, tms.create_dttm) >= '{date1}'::timestamp AND coalesce(tms.change_dttm, tms.create_dttm) < '{date2}'::timestamp
                left join {os.getenv('POSTGRES_SOURCE_SCHEMA', 'public')}.disciplines d on d.discipline_id = tms.discipline_id
                left join {os.getenv('POSTGRES_SOURCE_SCHEMA', 'public')}.marks m on m.mark_number = tms.mark_number
                left join {os.getenv('POSTGRES_SOURCE_SCHEMA', 'public')}.study_group sg on  ui.group_id = sg.group_id 
            """
            cursor.execute(query)
            columns = [desc[0] for desc in cursor.description]
            data = cursor.fetchall()

        logger.info(f"Extracted {len(data)} rows from source PostgreSQL")
        return {'data': data, 'columns': columns}

    except Exception as e:
        logger.error(f"Extraction error: {str(e)}", exc_info=True)
        raise
    finally:
        if conn is not None:
            conn.close()


def pg_to_pg_load_data_to_target(**context) -> None:
    """Загрузка данных в целевую таблицу PostgreSQL с обработкой конфликтов"""
    conn = None
    try:
        ti = context['ti']
        result = ti.xcom_pull(task_ids='pg_to_pg_extract_data_from_source')

        if not result or not result.get('data'):
            logger.warning("No data to load - skipping")
            return

        data = result['data']
        columns = result['columns']

        # Определяем колонки для обновления (все кроме temp_mark_id)
        update_columns = [col for col in columns if col != 'temp_mark_id']

        # Формируем часть запроса для обновления
        update_set = ', '.join([f"{col} = EXCLUDED.{col}" for col in update_columns])

        conn = get_postgres_connection()
        with conn.cursor() as cursor:
            # Используем ON CONFLICT для выполнения UPSERT
            upsert_query = f"""
            INSERT INTO {os.getenv('POSTGRES_TARGET_SCHEMA', 'sandbox')}.temp_marks_student_for_click
            ({', '.join(columns)})
            VALUES ({', '.join(['%s'] * len(columns))})
            ON CONFLICT (temp_mark_id) DO UPDATE SET
            {update_set}
            """

            batch_size = 1000
            total_rows = len(data)
            logger.info(f"Starting loading {total_rows} rows to target PostgreSQL with UPSERT")

            for i in range(0, total_rows, batch_size):
                batch = data[i:i + batch_size]
                try:
                    cursor.executemany(upsert_query, batch)
                    conn.commit()
                    loaded = min(i + batch_size, total_rows)
                    logger.info(f"Processed {loaded}/{total_rows} rows ({loaded / total_rows:.1%})")
                except Exception as batch_error:
                    conn.rollback()
                    logger.error(f"Error processing batch {i}-{i + batch_size}: {str(batch_error)}")
                    for row in batch:
                        try:
                            cursor.execute(upsert_query, row)
                            conn.commit()
                        except Exception as row_error:
                            conn.rollback()
                            logger.error(f"Error processing row: {row}. Error: {str(row_error)}")
                            continue

            logger.info(f"Successfully processed {total_rows} rows (inserted or updated)")

    except Exception as e:
        logger.error(f"Load error: {str(e)}", exc_info=True)
        if conn is not None:
            conn.rollback()
        raise
    finally:
        if conn is not None:
            conn.close()


def pg_to_ch_extract_data_from_postgres(**context) -> Dict[str, Any]:
    """Извлечение данных из PostgreSQL с улучшенной обработкой ошибок"""
    conn = None
    try:
        date1, date2 = get_dates(**context)
        logger.info(f"Using date range: {date1} to {date2}")

        conn = get_postgres_connection()
        with conn.cursor() as cursor:
            query = f"""
            SELECT
                temp_mark_id,
                login_user,
                student_fio,
                group_name,
                kourse, 
                semestr, 
                discipline_name, 
                mark_number,
                mark_name,
                mark_dt, 
                create_dttm,
                change_dttm
            FROM {os.getenv('POSTGRES_EXTERNAL_SCHEMA', 'sandbox')}.temp_marks_student_for_click
            where signal_ind <> 'deleted' and coalesce(change_dttm, create_dttm) >= '{date1}'::timestamp 
              AND coalesce(change_dttm, create_dttm) < '{date2}'::timestamp
            """
            cursor.execute(query)
            columns = [desc[0] for desc in cursor.description]
            data = cursor.fetchall()

        logger.info(f"Successfully extracted {len(data)} rows from PostgreSQL")
        return {'data': data, 'columns': columns}

    except Exception as e:
        logger.error(f"PostgreSQL extraction error: {str(e)}", exc_info=True)
        raise
    finally:
        if conn is not None:
            conn.close()


def pg_to_ch_transform_data(**context) -> Dict[str, Any]:
    """Трансформация данных с улучшенной валидацией"""
    try:
        ti = context['ti']
        result = ti.xcom_pull(task_ids='pg_to_ch_extract_data_from_postgres')

        if not result or 'data' not in result:
            raise ValueError("No data received from extract task")

        # Валидация и очистка данных
        valid_data = []
        datetime_fields = {'create_dttm', 'change_dttm'}  # Поля, которые должны быть datetime

        for row in result['data']:
            if len(row) != len(result['columns']):
                logger.warning(f"Skipping invalid row: {row}")
                continue

            # Преобразуем row в список для модификации
            processed_row = list(row)

            # Обрабатываем NULL значения в datetime полях
            for i, col_name in enumerate(result['columns']):
                if col_name in datetime_fields and processed_row[i] is None:
                    # Заменяем NULL на минимальную дату или текущее время
                    processed_row[i] = datetime(1970, 1, 1)  # или datetime.now()

            valid_data.append(tuple(processed_row))

        if len(valid_data) != len(result['data']):
            invalid_count = len(result['data']) - len(valid_data)
            logger.warning(f"Filtered {invalid_count} invalid rows ({(invalid_count / len(result['data'])):.2%})")

        return {'data': valid_data, 'columns': result['columns']}

    except Exception as e:
        logger.error(f"Transformation error: {str(e)}", exc_info=True)
        raise


def delete_from_click_deleted_records_from_pg(**context):
    """Удаление записей из ClickHouse, помеченных как удаленные в PostgreSQL"""
    ch_client = None
    pg_conn = None
    try:
        date1, date2 = get_dates(**context)
        logger.info(f"Using date range: {date1} to {date2}")
        # Получаем список записей, помеченных как удаленные в PostgreSQL
        pg_conn = get_postgres_connection()
        with pg_conn.cursor() as cursor:
            query = f"""
            SELECT temp_mark_id 
            FROM {os.getenv('POSTGRES_EXTERNAL_SCHEMA', 'sandbox')}.temp_marks_student_for_click
            WHERE signal_ind = 'deleted' and coalesce(change_dttm, create_dttm) >= '{date1}'::timestamp 
              AND coalesce(change_dttm, create_dttm) < '{date2}'::timestamp
            """
            cursor.execute(query)
            deleted_ids = [row[0] for row in cursor.fetchall()]

        if not deleted_ids:
            logger.info("No records marked as deleted in PostgreSQL")
            return

        logger.info(f"Found {len(deleted_ids)} records marked as deleted in PostgreSQL")

        # Удаляем соответствующие записи из ClickHouse
        ch_client = get_clickhouse_client()

        # Разбиваем на батчи для больших списков
        batch_size = 1000
        for i in range(0, len(deleted_ids), batch_size):
            batch = deleted_ids[i:i + batch_size]
            delete_query = """
            DELETE FROM temp_marks_student 
            WHERE temp_mark_id IN (%s)
            """ % ','.join(str(id) for id in batch)

            ch_client.execute(delete_query)
            logger.info(f"Deleted {min(i + batch_size, len(deleted_ids))}/{len(deleted_ids)} records")

        logger.info(f"Successfully deleted {len(deleted_ids)} records from ClickHouse")

    except Exception as e:
        logger.error(f"Error in delete_from_click_deleted_records_from_pg: {str(e)}", exc_info=True)
        raise
    finally:
        if ch_client is not None:
            ch_client.disconnect()
        if pg_conn is not None:
            pg_conn.close()


def pg_to_ch_load_data_to_clickhouse(**context) -> None:
    """Улучшенная загрузка данных с надежным подключением и поддержкой UPSERT"""
    ti = context['ti']
    result = ti.xcom_pull(task_ids='pg_to_ch_transform_data')

    if not result or not result.get('data'):
        logger.warning("No data to load - skipping")
        return

    client = None
    try:
        client = get_clickhouse_client()

        # Создаем таблицу с улучшенными настройками и поддержкой UPSERT через ReplacingMergeTree
        create_table_query = """
        CREATE TABLE IF NOT EXISTS temp_marks_student (
            temp_mark_id Int64,
            login_user String,
            student_fio Nullable(String),
            group_name Nullable(String),
            kourse Nullable(Int8),
            semestr Nullable(Int8),
            discipline_name Nullable(String),
            mark_number Nullable(Int8),
            mark_name Nullable(String),
            mark_dt Date,
            create_dttm Nullable(DateTime),
            change_dttm Nullable(DateTime),
            _version UInt32 DEFAULT 1
        ) ENGINE = ReplacingMergeTree(_version)
        primary key (temp_mark_id)
        ORDER BY (temp_mark_id, login_user, mark_dt)
        SETTINGS index_granularity=8192, min_bytes_for_wide_part=0;  
        """
        client.execute(create_table_query)

        columns = result['columns']
        data = result['data']
        batch_size = 2000  # Оптимальный размер батча

        # Преобразуем данные для вставки
        # Вариант 1: Если данные приходят как список кортежей
        if isinstance(data[0], tuple):
            processed_data = [(*row, 1) for row in data]  # Добавляем версию к каждому кортежу
        # Вариант 2: Если данные приходят как списки
        else:
            processed_data = [row + [1] for row in data]  # Добавляем версию к каждому списку

        full_columns = columns + ['_version']

        total_rows = len(data)
        logger.info(f"Starting loading {total_rows} rows to ClickHouse with UPSERT support")

        for i in range(0, total_rows, batch_size):
            batch = processed_data[i:i + batch_size]
            try:
                client.execute(
                    f"INSERT INTO temp_marks_student ({','.join(full_columns)}) VALUES",
                    batch,
                    types_check=True
                )
                loaded = min(i + batch_size, total_rows)
                logger.info(f"Loaded {loaded}/{total_rows} rows ({loaded / total_rows:.1%})")
            except Exception as e:
                logger.error(f"Failed to insert batch: {str(e)}")
                raise

        # Принудительно выполняем оптимизацию для дедупликации данных
        client.execute("OPTIMIZE TABLE temp_marks_student FINAL")

        logger.info(f"Successfully loaded {total_rows} rows with UPSERT support")

    except Exception as e:
        logger.error(f"ClickHouse operation failed: {str(e)}", exc_info=True)
        raise
    finally:
        if client is not None:
            client.disconnect()

with DAG(
            'pg_to_ch_temp_marks_student',
            default_args=default_args,
            schedule_interval='0 0 * * *',  # Ежедневно в полночь
            catchup=False,
            max_active_runs=1,
            tags=['etl', 'postgres', 'custom_dates'],
            doc_md="""### ETL Pipeline with customizable date range
        Позволяет указать даты через:
        1. Параметры запуска (UI/API)
        2. Переменные Airflow
        3. По умолчанию: последние 7 дней
        """,
    ) as dag:

    start = DummyOperator(task_id='start')

    pg_to_pg_extract_task = PythonOperator(
        task_id='pg_to_pg_extract_data_from_source',
        python_callable=pg_to_pg_extract_data_from_source,
        provide_context=True,
        doc_md="Извлечение данных за указанный период из исходной таблицы temp_marks_student PostgreSQL",
    )

    pg_to_pg_load_task = PythonOperator(
        task_id='pg_to_pg_load_data_to_target',
        python_callable=pg_to_pg_load_data_to_target,
        doc_md="Загрузка данных в целевую таблицу temp_marks_student_for_click PostgreSQL",
    )

    delete_task = PythonOperator(
        task_id='delete_from_click_deleted_records_from_pg',
        python_callable=delete_from_click_deleted_records_from_pg,
        doc_md="Удаление записей из ClickHouse, помеченных как удаленные в PostgreSQL",
    )

    pg_to_ch_extract_task = PythonOperator(
        task_id='pg_to_ch_extract_data_from_postgres',
        python_callable=pg_to_ch_extract_data_from_postgres,
        doc_md="Извлечение данных из таблицы temp_marks_student_for_click PostgreSQL",
    )

    pg_to_ch_transform_task = PythonOperator(
        task_id='pg_to_ch_transform_data',
        python_callable=pg_to_ch_transform_data,
        doc_md="Валидация и преобразование данных",
    )


    pg_to_ch_load_task = PythonOperator(
        task_id='pg_to_ch_load_data_to_clickhouse',
        python_callable=pg_to_ch_load_data_to_clickhouse,
        doc_md="Загрузка данных в таблицу temp_marks_student ClickHouse",
    )

    end = DummyOperator(task_id='end')

    start >> pg_to_pg_extract_task >> pg_to_pg_load_task >> delete_task >> pg_to_ch_extract_task >> pg_to_ch_transform_task >> pg_to_ch_load_task >> end
    
    