CREATE TYPE t_residency AS ENUM ('OTHER', 'SINGAPORE');
CREATE TYPE t_yes_no_unknown AS ENUM ('YES', 'NO', 'UNKNOWN');
CREATE TYPE t_pos_neg_nil AS ENUM ('POSITIVE', 'NEGATIVE', 'NIL');
CREATE TYPE t_dog_gender AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE t_dog_antigen_presence AS ENUM ('POSITIVE', 'NEGATIVE', 'UNKNOWN');
CREATE TYPE t_call_outcome AS ENUM ('APPOINTMENT', 'DECLINED', 'OPT_OUT');
CREATE TYPE t_reported_ineligibility AS ENUM ('NIL', 'TEMPORARY_INELIGIBLE', 'PERMANENTLY_INELIGIBLE');
