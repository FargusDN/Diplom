
-- 1. Создаем роль simple_user с правами только на чтение
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'simple_user') THEN
        CREATE ROLE simple_user WITH
		    NOLOGIN
		    NOSUPERUSER
		    NOCREATEDB
		    NOCREATEROLE
		    NOINHERIT
		    NOREPLICATION
		    CONNECTION LIMIT -1;
    END IF;
END
$$;


-- Даем права на чтение всем таблицам в текущей схеме (public)
GRANT USAGE ON SCHEMA public TO simple_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO simple_user;
-- Запрещаем доступ к конкретной таблице
REVOKE SELECT ON TABLE public.audit_log FROM simple_user;

-- 2. Создаем роль middle_user с правами simple_user + добавление записей
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'middle_user') THEN
        CREATE ROLE middle_user WITH
		    NOLOGIN
		    NOSUPERUSER
		    NOCREATEDB
		    NOCREATEROLE
		    NOINHERIT
		    NOREPLICATION
		    CONNECTION LIMIT -1;
    END IF;
END
$$;



-- Наследуем права simple_user
GRANT simple_user TO middle_user;

-- Даем дополнительные права на вставку данных
GRANT INSERT ON ALL TABLES IN SCHEMA public TO middle_user;

-- 3. Создаем роль super_user со всеми правами
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'super_user') THEN
        CREATE ROLE super_user WITH
		    NOLOGIN
		    SUPERUSER
		    CREATEDB
		    CREATEROLE
		    INHERIT
		    REPLICATION
		    BYPASSRLS
		    CONNECTION LIMIT -1;
    END IF;
END
$$;


-- Даем все возможные права
GRANT ALL PRIVILEGES ON DATABASE ios_ystu_db TO super_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO super_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO super_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO super_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO super_user;


DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Перебираем всех пользователей из таблицы users
    FOR user_record IN 
        SELECT login_user, password_user, role_user 
        FROM users where role_user = 'super_user'
    LOOP
        -- Создаем пользователя в PostgreSQL с тем же логином
        EXECUTE format('CREATE USER %I WITH PASSWORD %L', 
                      user_record.login_user, 
                      user_record.password_user);
        
        -- Назначаем соответствующую роль
        EXECUTE format('GRANT %I TO %I', 
                      user_record.role_user, 
                      user_record.login_user);
        
        RAISE NOTICE 'Пользователь % создан с ролью %', 
                     user_record.login_user, 
                     user_record.role_user;
    END LOOP;
END $$;

