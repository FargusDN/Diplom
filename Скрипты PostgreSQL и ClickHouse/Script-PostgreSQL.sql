DROP TABLE IF EXISTS study_group cascade;
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS marks cascade;
DROP TABLE IF EXISTS institutes cascade; 
DROP TABLE IF EXISTS faculties cascade;
DROP TABLE IF EXISTS disciplines cascade;
drop table if exists class_types cascade;
DROP TABLE IF EXISTS class_schedule cascade; 
DROP TABLE IF EXISTS main_marks_student cascade;
DROP TABLE IF EXISTS temp_marks_student cascade;
DROP TABLE IF EXISTS control_types cascade;
DROP TABLE IF EXISTS user_info cascade;
DROP TABLE IF EXISTS positions_in_vuc cascade;
DROP TABLE IF EXISTS vuc_users cascade;
DROP TABLE IF EXISTS temp_vuc_users_in_naryad cascade;
DROP TABLE IF EXISTS achievements_categories cascade;
DROP TABLE IF exists achievements_user cascade;
DROP TABLE IF exists notification_types cascade;
DROP TABLE IF exists notifications cascade;
DROP TABLE IF exists request_types cascade;
DROP TABLE IF exists user_requests cascade;
DROP TABLE IF exists attendance_students cascade;
drop table IF exists audit_log cascade;


create table users (
    login_user VARCHAR PRIMARY key,
    password_user TEXT NOT NULL,
    role_user text not null default 'simple_user',
    signal_ind varchar(8) default 'active',
    privilege_mil_center_ystu bool not null default false,
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    auto_delete_dt date DEFAULT (NOW() + INTERVAL '4 years 3 months'),
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'disabled', 'deleted')),
    CONSTRAINT valid_role_user CHECK (role_user IN ('simple_user', 'middle_user', 'super_user'))
);


create table institutes (
    institute_id SERIAL PRIMARY KEY,
    institute_name VARCHAR not null default 'Не определено',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP
);

create table faculties (
    faculty_id SERIAL PRIMARY KEY,
    faculty_code VARCHAR not null default 'Не определено',
    faculty_name VARCHAR not null default 'Не определено',
    institute_id INT REFERENCES institutes(institute_id),
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP
);


create table study_group (
    group_id BIGSERIAL PRIMARY KEY,
    group_name VARCHAR NOT NULL,
    signal_ind varchar(8) not null default 'active',
    faculty_id INT REFERENCES faculties(faculty_id),
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    auto_delete_dt date NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'deleted'))
);


create table user_info (
    user_id BIGSERIAL PRIMARY KEY,
    user_status VARCHAR not null default 'Студент',
    login_user VARCHAR unique REFERENCES users(login_user) ON DELETE CASCADE,
    last_name VARCHAR  default 'Не определено',
    first_name VARCHAR  default 'Не определено',
    middle_name VARCHAR default 'Не определено',
    birth_dt DATE default '1925-01-01'::date,
    email VARCHAR unique,
    number_phone VARCHAR unique,
    address_registration VARCHAR default 'Не определено',
    source_finance VARCHAR default 'Не определено',
    form_study VARCHAR default 'Не определено',
    group_id INT REFERENCES study_group(group_id),
    qualification VARCHAR default 'Не определено',
    add_info TEXT,
    photo_user TEXT,
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    CONSTRAINT valid_user_status CHECK (user_status IN ('Студент', 'Преподаватель', 'Сотрудник ЯГТУ'))
);



create table disciplines (
    discipline_id SERIAL PRIMARY KEY,
    discipline_name VARCHAR not null default 'Не определено',
    signal_ind varchar(8) not null default 'active',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'deleted'))
);


create table class_types (
    class_type_id SERIAL PRIMARY KEY,
    class_type_name VARCHAR not null default 'Не определено',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP
);



create table class_schedule (
	class_schedule_id BIGSERIAL PRIMARY KEY,
	signal_ind varchar(8) not null default 'active',
	start_tm TIME(0) not null default date_trunc('minute', CURRENT_TIMESTAMP)::time(0),
    end_tm TIME(0) GENERATED ALWAYS AS 
        (date_trunc('minute', start_tm + INTERVAL '1.5 hours')) stored,
    schedule_dt DATE not null default CURRENT_DATE,
    numbers_week VARCHAR not null default 'Не определено',
    group_id INT REFERENCES study_group(group_id),
    discipline_id INT REFERENCES disciplines(discipline_id),
    class_type_id INT REFERENCES class_types(class_type_id),
    professor_id INT REFERENCES user_info(user_id),
    auditorium VARCHAR not null default 'Не определено',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'deleted'))
);


create table marks (
    mark_number INT PRIMARY KEY,
    mark_name VARCHAR not null default 'Не определено',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP
);

create table control_types (
    control_id BIGSERIAL PRIMARY KEY,
    control_name VARCHAR not null default 'Не определено',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP
);



create table main_marks_student (
	main_mark_id BIGSERIAL PRIMARY KEY,
	signal_ind varchar(8) not null default 'active',
    user_id INT REFERENCES user_info(user_id),
    kourse INT,
    semestr INT,
    discipline_id INT REFERENCES disciplines(discipline_id),
    control_id INT  REFERENCES control_types(control_id),
    mark_number INT  REFERENCES marks(mark_number),
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'deleted'))
);



create table temp_marks_student (
	temp_mark_id BIGSERIAL PRIMARY KEY,
	signal_ind varchar(8) not null default 'active',
    user_id INT REFERENCES user_info(user_id),
    kourse INT,
    semestr INT,
    discipline_id INT  REFERENCES disciplines(discipline_id),
    mark_number INT  REFERENCES marks(mark_number),
    mark_dt DATE  default CURRENT_DATE, 
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'deleted'))
);


CREATE TABLE positions_in_vuc(
    position_in_vuc_id SERIAL PRIMARY KEY,
    position_in_vuc_name VARCHAR(100) not null default 'Не определено',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP
);



CREATE TABLE vuc_users(
    vuc_user_id INT not null PRIMARY KEY REFERENCES user_info(user_id),
    position_in_vuc_id INT not null REFERENCES positions_in_vuc(position_in_vuc_id),
    manager_id INT NULL REFERENCES vuc_users(vuc_user_id),
    CONSTRAINT valid_hierarchy CHECK (manager_id != vuc_user_id),  -- Запрет самоподчинения
    signal_ind varchar(8) not null default 'active',
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP,
    auto_delete_dt date NOT NULL DEFAULT (NOW() + INTERVAL '4 year'),
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'disabled', 'deleted'))
);



create table temp_vuc_users_in_naryad(
	naryad_id SERIAL PRIMARY KEY,
	naryad_dt DATE NOT NULL DEFAULT CURRENT_DATE,
	start_naryad_tm TIME(0) not null default date_trunc('minute', CURRENT_TIMESTAMP)::time(0),
    end_naryad_tm TIME(0) GENERATED ALWAYS AS 
        (date_trunc('minute', start_naryad_tm + INTERVAL '6 hours')) stored,
	vuc_user_id INT REFERENCES vuc_users(vuc_user_id),
    signal_ind varchar(8) not null default 'active',
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP,
    auto_delete_dt date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 day')::date,
    CONSTRAINT valid_signal_ind CHECK (signal_ind IN ('active', 'deleted'))
);


create table achievements_categories (
    achievement_category_id SERIAL PRIMARY KEY,
    achievement_category_name varchar(100) not null, 
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP
);

create table achievements_user (
	achievement_id BIGSERIAL PRIMARY KEY,
    user_id INT not null REFERENCES user_info(user_id),
    kourse INT,
    semestr INT,
    achievement_dt DATE NOT NULL DEFAULT CURRENT_DATE, 
    achievement_name VARCHAR(150) not null default 'Не определено',
    achievement_category_id INT not null REFERENCES achievements_categories(achievement_category_id), 
    achievement_link text,
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP
);


CREATE TABLE notification_types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) not null default 'Не определено',
    title TEXT not null default 'Не определено',
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP
);

CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES user_info(user_id),
    type_id INT NOT NULL REFERENCES notification_types(type_id),
    message TEXT not null default 'Не определено',
    is_read BOOLEAN DEFAULT FALSE,
    create_dttm TIMESTAMP  not null default now(),
    change_dttm TIMESTAMP
);



CREATE TABLE request_types (
    request_type_id SERIAL PRIMARY KEY,
    request_type_name VARCHAR(100) not null default 'Не определено',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP
);


CREATE TABLE user_requests (
    request_id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES user_info(user_id),
    request_type_id INT NULL REFERENCES request_types(request_type_id),
    title VARCHAR(100) NOT NULL,
    description TEXT not null default 'Не определено',
    status_request VARCHAR(20) NOT NULL DEFAULT 'pending',
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    closed_at TIMESTAMP,
    assigned_to INT NULL REFERENCES user_info(user_id),
    CONSTRAINT valid_assigned CHECK (assigned_to != user_id),  -- Запрет самоподчинения
    response_rejected TEXT,
    attachments JSONB,
    additional_data JSONB,
    CONSTRAINT valid_status CHECK (status_request IN ('pending', 'in_progress', 'completed', 'rejected', 'cancelled'))
);



CREATE TABLE attendance_students (
    attendance_id BIGSERIAL PRIMARY KEY,
    class_schedule_id INT NOT NULL REFERENCES class_schedule(class_schedule_id),
    student_id INT NOT NULL REFERENCES user_info(user_id),
    attendance_bool bool,
    reason_absent TEXT,
    create_dttm TIMESTAMP not null default now(),
    change_dttm TIMESTAMP,
    CONSTRAINT unique_attendance UNIQUE (class_schedule_id, student_id)
);


CREATE OR REPLACE FUNCTION handle_custom_timestamps()
RETURNS TRIGGER AS $$
BEGIN

    -- Для таблицы class_schedule
    IF TG_TABLE_NAME = 'class_schedule' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;
    
    -- Для таблицы control_types
    ELSIF TG_TABLE_NAME = 'control_types' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

	-- Для таблицы class_types
    ELSIF TG_TABLE_NAME = 'class_types' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

	-- Для таблицы disciplines
    ELSIF TG_TABLE_NAME = 'disciplines' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы faculties
    ELSIF TG_TABLE_NAME = 'faculties' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы institutes
    ELSIF TG_TABLE_NAME = 'institutes' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы marks
    ELSIF TG_TABLE_NAME = 'marks' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы main_marks_student
    ELSIF TG_TABLE_NAME = 'main_marks_student' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы temp_marks_student
    ELSIF TG_TABLE_NAME = 'temp_marks_student' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы study_group
    ELSIF TG_TABLE_NAME = 'study_group' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы user_info
    ELSIF TG_TABLE_NAME = 'user_info' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы positions_in_vuc
    ELSIF TG_TABLE_NAME = 'positions_in_vuc' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы vuc_users
    ELSIF TG_TABLE_NAME = 'vuc_users' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы achievements_categories
    ELSIF TG_TABLE_NAME = 'achievements_categories' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы achievements_user
    ELSIF TG_TABLE_NAME = 'achievements_user' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы users
    ELSIF TG_TABLE_NAME = 'users' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы temp_vuc_users_in_naryad
	ELSIF TG_TABLE_NAME = 'temp_vuc_users_in_naryad' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы notification_types
	ELSIF TG_TABLE_NAME = 'notification_types' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы notifications
	ELSIF TG_TABLE_NAME = 'notifications' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы request_types
	ELSIF TG_TABLE_NAME = 'request_types' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы user_requests
	ELSIF TG_TABLE_NAME = 'user_requests' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

-- Для таблицы attendance_students
	ELSIF TG_TABLE_NAME = 'attendance_students' THEN
        IF TG_OP = 'UPDATE' THEN
            NEW.change_dttm = NOW();
        END IF;

    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION process_auto_deletions_daily()
RETURNS VOID AS $$
BEGIN
	BEGIN
		UPDATE users
		SET signal_ind = 'deleted',
		    change_dttm = NOW()
		WHERE auto_delete_dt <= CURRENT_DATE;
	END;
	BEGIN
		UPDATE temp_vuc_users_in_naryad
		SET signal_ind = 'deleted',
		    change_dttm = NOW()
		WHERE auto_delete_dt <= CURRENT_DATE;
	END;
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


CREATE TABLE audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    event_dttm TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    db_user TEXT NOT NULL DEFAULT current_user,  -- пользователь БД
    app_user TEXT,                              -- пользователь приложения (если известен)
    ip_address INET,                            -- IP-адрес клиента
    table_name TEXT NOT NULL,                   -- имя таблицы
    operation CHAR(1) NOT NULL,                 -- 'I'=insert, 'U'=update, 'D'=delete
    old_data JSONB,                             -- данные до изменения
    new_data JSONB,                             -- данные после изменения
    query_text TEXT                             -- SQL-запрос
);

CREATE INDEX idx_audit_log_time ON audit_log(event_dttm);
CREATE INDEX idx_audit_log_app_user ON audit_log(app_user);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);


CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    v_app_user TEXT;
    v_ip INET;
    v_db_user TEXT := current_user;  -- Пользователь БД (роль с доступом)
BEGIN
    -- 1. Определяем реального пользователя приложения:
    v_app_user := COALESCE(session_user, v_db_user);
    
    -- 2. Получаем IP-адрес клиента
    BEGIN
        v_ip := inet_client_addr();
    EXCEPTION WHEN OTHERS THEN
        v_ip := NULL;
    END;
    
    -- 3. Логирование события
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_log (
            app_user,  -- Реальный пользователь приложения
            db_user,   -- Роль с доступом к функции
            ip_address,
            table_name,
            operation,
            new_data,
            query_text
        ) VALUES (
            v_app_user,
            v_db_user,
            v_ip,
            TG_TABLE_NAME,
            'I',
            to_jsonb(NEW),
            current_query()
        );
        RETURN NEW;
    
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.audit_log (
            app_user,
            db_user,
            ip_address,
            table_name,
            operation,
            old_data,
            new_data,
            query_text
        ) VALUES (
            v_app_user,
            v_db_user,
            v_ip,
            TG_TABLE_NAME,
            'U',
            to_jsonb(OLD),
            to_jsonb(NEW),
            current_query()
        );
        RETURN NEW;
    
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_log (
            app_user,
            db_user,
            ip_address,
            table_name,
            operation,
            old_data,
            query_text
        ) VALUES (
            v_app_user,
            v_db_user,
            v_ip,
            TG_TABLE_NAME,
            'D',
            to_jsonb(OLD),
            current_query()
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'audit_writer') THEN
        CREATE ROLE audit_writer;
    END IF;
END
$$;

GRANT INSERT, SELECT ON audit_log TO audit_writer;

GRANT USAGE ON SCHEMA public TO audit_writer;
GRANT INSERT ON public.audit_log TO audit_writer;

-- Или конкретной роли:
GRANT USAGE, SELECT ON SEQUENCE audit_log_audit_id_seq TO audit_writer;

ALTER FUNCTION log_audit_event() OWNER TO audit_writer;

   
CREATE OR REPLACE FUNCTION create_audit_triggers_for_all_tables()
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
            DROP TRIGGER IF EXISTS audit_trigger ON %I;
            CREATE TRIGGER audit_trigger
            AFTER INSERT OR UPDATE OR DELETE ON %I
            FOR EACH ROW EXECUTE FUNCTION log_audit_event();
        ', tbl_record.table_name, tbl_record.table_name);
        
        RAISE NOTICE 'Создан триггер аудита для таблицы %', tbl_record.table_name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Выполняем функцию для создания триггеров
SELECT create_audit_triggers_for_all_tables();











