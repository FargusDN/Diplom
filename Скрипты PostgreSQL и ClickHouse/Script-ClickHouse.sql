CREATE TABLE class_schedule (
	class_schedule_id Int64,
    start_tm String,
    end_tm String,
    schedule_dt Date,
    numbers_week String,
    group_name String,
    discipline_name String,
    class_type_name String,
    professor_fio String,
    auditorium String,
    create_dttm DateTime,
    change_dttm DateTime,
    _version UInt32 DEFAULT 1
) ENGINE = ReplacingMergeTree(_version)
primary key (class_schedule_id)
ORDER BY (class_schedule_id, schedule_dt, group_name)
SETTINGS index_granularity=8192, min_bytes_for_wide_part=0;  



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


CREATE TABLE  IF NOT EXISTS main_marks_student (
	main_mark_id Int64,
	login_user String,
	student_fio Nullable(String),
    group_name String,
	kourse Nullable(Int8),
	semestr Nullable(Int8),
	discipline_name Nullable(String),
	mark_number Nullable(Int8),
	mark_name Nullable(String),
	create_dttm Nullable(DateTime),
	change_dttm Nullable(DateTime),
	_version UInt32 DEFAULT 1
) ENGINE = ReplacingMergeTree(_version)
primary key (main_mark_id)
ORDER BY (main_mark_id, login_user, group_name)
SETTINGS index_granularity=8192, min_bytes_for_wide_part=0; 


CREATE TABLE IF NOT EXISTS attendance_students (
    attendance_id Int64,
    schedule_dt Date,
    discipline_name Nullable(String),
    class_type_name Nullable(String),
    student_fio Nullable(String),
    group_name String,
    attendance_bool Nullable(Boolean),
    reason_absent Nullable(String),
    create_dttm Nullable(DateTime),
    change_dttm Nullable(DateTime),
    _version UInt32 DEFAULT 1
) ENGINE = ReplacingMergeTree(_version)
PRIMARY KEY (attendance_id)
ORDER BY (attendance_id, schedule_dt, group_name);



 


