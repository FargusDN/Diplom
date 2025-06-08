DROP TABLE IF EXISTS positions_in_vuc cascade;
DROP TABLE IF EXISTS role_in_naryad cascade;
DROP TABLE IF EXISTS vuc_users cascade;
DROP TABLE IF EXISTS temp_vuc_users_in_naryad cascade; 
DROP TABLE IF EXISTS military_inventory cascade;
DROP TABLE IF EXISTS inventory_transactions cascade;
drop table if exists military_applications cascade;
DROP TABLE IF EXISTS selection_protocols cascade; 
DROP TABLE IF EXISTS preliminary_results cascade;
DROP TABLE IF EXISTS main_results cascade;
DROP TABLE IF EXISTS enrollment_decisions cascade;



CREATE TABLE positions_in_vuc(
    position_in_vuc_id INT PRIMARY KEY,
    position_in_vuc_name VARCHAR(100) not null default 'Не определено',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP
);

CREATE TABLE role_in_naryad(
    role_in_naryad_id INT PRIMARY KEY,
    role_name_in_naryad VARCHAR(100) not null default 'Не определено',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    CONSTRAINT valid_role_name_in_naryad CHECK (role_name_in_naryad IN ('Дежурный', 'Помощник', 'Дневальный'))
);


CREATE TABLE vuc_users(
    vuc_user_id INT PRIMARY KEY not null,
    position_in_vuc_id INT not null REFERENCES positions_in_vuc(position_in_vuc_id),
    manager_id INT NULL REFERENCES vuc_users(vuc_user_id),
    CONSTRAINT valid_hierarchy CHECK (manager_id != vuc_user_id),  -- Запрет самоподчинения
    last_name VARCHAR  default 'Не определено',
    first_name VARCHAR  default 'Не определено',
    middle_name VARCHAR default 'Не определено',
    birth_dt DATE default '1925-01-01'::date,
    signal_ind varchar(8) not null default 'active',
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP,
    auto_delete_dt date NOT NULL DEFAULT (NOW() + INTERVAL '4 year'),
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'disabled', 'deleted'))
);


create table temp_vuc_users_in_naryad(
	naryad_id INT PRIMARY KEY,
	naryad_dt DATE NOT NULL DEFAULT CURRENT_DATE,
	start_naryad_tm TIME(0) not null default date_trunc('minute', CURRENT_TIMESTAMP)::time(0),
    end_naryad_tm TIME(0) not null default date_trunc('minute', CURRENT_TIMESTAMP+ INTERVAL '6 hours')::time(0),
	vuc_user_id INT REFERENCES vuc_users(vuc_user_id),
	role_in_naryad_id INT REFERENCES role_in_naryad(role_in_naryad_id),
    signal_ind varchar(8) not null default 'active',
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP,
    auto_delete_dt date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 day')::date,
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'deleted'))
);


CREATE TABLE military_inventory (
    id_inventory SERIAL PRIMARY KEY,
    name_inventory VARCHAR(100) NOT NULL UNIQUE,
    category_inventory VARCHAR(50) NOT NULL CHECK (category_inventory IN ('Оружие', 'Форма', 'Снаряжение')),
    quantity_inventory INTEGER NOT NULL CHECK (quantity_inventory >= 0),
    responsible_id INTEGER NOT NULL REFERENCES vuc_users(vuc_user_id),
    last_dt_check_inventory DATE not null default CURRENT_DATE,
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP
);

CREATE TABLE inventory_transactions (
    id_inventory_transaction SERIAL PRIMARY KEY,
    id_inventory INT NOT NULL REFERENCES military_inventory(id_inventory),
    type_transaction VARCHAR(20) NOT NULL CHECK (type_transaction IN ('Выдача', 'Возврат', 'Списание', 'Добавление')),
    amount INT NOT NULL CHECK (amount > 0),
    transaction_date DATE not null DEFAULT CURRENT_DATE,
    signal_ind varchar(8) not null default 'active',
    issuer_id INTEGER NOT NULL REFERENCES vuc_users(vuc_user_id),
	vuc_user_id INT not null REFERENCES vuc_users(vuc_user_id),
	create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP,
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'deleted'))
);


CREATE TABLE military_applications (
    id_military_application SERIAL PRIMARY KEY,
    signal_ind varchar(8) not null default 'active',
    student_id INT NOT NULL,
    last_name VARCHAR  default 'Не определено',
    first_name VARCHAR  default 'Не определено',
    middle_name VARCHAR default 'Не определено',
    birth_dt DATE default '1925-01-01'::date,
    study_group_name VARCHAR default 'Не определено',
    application_date DATE DEFAULT CURRENT_DATE,
    status_military_application VARCHAR(30) DEFAULT 'В процессе' CHECK (status_military_application IN ('Принято', 'Отклонено', 'В процессе')),
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP,
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'deleted'))
);



CREATE TABLE selection_protocols (
    id_protocol SERIAL PRIMARY KEY,
    protocol_date DATE DEFAULT CURRENT_DATE,
    vacancy_count INTEGER NOT NULL CHECK (vacancy_count > 0),
    min_rank NUMERIC(5,2) NOT null,
	id_military_application INT not null REFERENCES military_applications(id_military_application),
	create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP
);


CREATE TABLE preliminary_results (
    id_preliminary_result SERIAL PRIMARY KEY,
    id_military_application INTEGER NOT NULL REFERENCES military_applications(id_military_application),
    medical_status VARCHAR(50) NOT NULL CHECK (medical_status IN ('Годен', 'Негоден')),
    psych_test_score INTEGER NOT NULL CHECK (psych_test_score BETWEEN 0 AND 100),
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP
);


CREATE TABLE main_results (
    id_main_result SERIAL PRIMARY KEY,
    id_military_application INTEGER NOT NULL REFERENCES military_applications(id_military_application),
    gpa NUMERIC(4,2) NOT NULL CHECK (gpa BETWEEN 2.0 AND 5.0),
    physical_score INTEGER NOT NULL CHECK (physical_score BETWEEN 0 AND 100),
    total_rank NUMERIC(5,2) NOT null,
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP
);



CREATE TABLE enrollment_decisions (
    id_enrollment_decision SERIAL PRIMARY KEY,
    id_military_application INTEGER NOT NULL REFERENCES military_applications(id_military_application),
    id_protocol INTEGER NOT NULL REFERENCES selection_protocols(id_protocol),
    decision VARCHAR(20) NOT NULL CHECK (decision IN ('Зачислен', 'Не зачислен')),
    military_card_issued BOOLEAN DEFAULT false,
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP
);


  

CREATE OR REPLACE FUNCTION handle_custom_timestamps()
RETURNS TRIGGER AS $$
BEGIN

    IF TG_TABLE_NAME = 'positions_in_vuc' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;
    
    ELSIF TG_TABLE_NAME = 'role_in_naryad' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    ELSIF TG_TABLE_NAME = 'vuc_users' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    ELSIF TG_TABLE_NAME = 'temp_vuc_users_in_naryad' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    ELSIF TG_TABLE_NAME = 'military_inventory' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    ELSIF TG_TABLE_NAME = 'inventory_transactions' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    ELSIF TG_TABLE_NAME = 'military_applications' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    ELSIF TG_TABLE_NAME = 'selection_protocols' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    ELSIF TG_TABLE_NAME = 'preliminary_results' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    ELSIF TG_TABLE_NAME = 'main_results' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    ELSIF TG_TABLE_NAME = 'enrollment_decisions' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;
	END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION create_changes_timestamps_triggers_for_all_tables()
RETURNS void AS $$
DECLARE
    tbl_record RECORD;
BEGIN
    FOR tbl_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN ('audit_log', 'other_excluded_tables') -- Исключения
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS changes_timestamps_trigger ON %I;
            CREATE TRIGGER changes_timestamps_trigger
            BEFORE INSERT OR UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION handle_custom_timestamps();
        ', tbl_record.table_name, tbl_record.table_name);
        
        RAISE NOTICE 'Создан триггер обновления времени изменений для таблицы %', tbl_record.table_name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Выполняем функцию для создания триггеров
SELECT create_changes_timestamps_triggers_for_all_tables();































