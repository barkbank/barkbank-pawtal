CREATE TABLE admins (
  admin_id BIGSERIAL,
  admin_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  admin_hashed_email TEXT NOT NULL,
  admin_encrypted_pii TEXT NOT NULL,
  admin_modification_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT admins_unique_admin_hashed_email UNIQUE (admin_hashed_email),
  CONSTRAINT admins_pk PRIMARY KEY (admin_id)
);

CREATE TABLE vets (
  vet_id BIGSERIAL,
  vet_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vet_email TEXT NOT NULL,
  vet_name TEXT NOT NULL,
  vet_phone_number TEXT NOT NULL,
  vet_address TEXT NOT NULL,
  vet_modification_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT vet_unique_vet_email UNIQUE (vet_email),
  CONSTRAINT vet_pk PRIMARY KEY (vet_id)
);

CREATE TABLE users (
  user_id BIGSERIAL,
  user_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_hashed_email TEXT NOT NULL,
  user_encrypted_pii TEXT NOT NULL,
  user_modification_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_unique_user_hashed_email UNIQUE (user_hashed_email),
  CONSTRAINT users_pk PRIMARY KEY (user_id)
);

CREATE TYPE t_yes_no_unknown AS ENUM ('YES', 'NO', 'UNKNOWN');
CREATE TYPE t_dog_gender AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE t_dog_antigen_presence AS ENUM ('POSITIVE', 'NEGATIVE', 'UNKNOWN');

CREATE TABLE dogs (
  dog_id BIGSERIAL,
  dog_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dog_status TEXT NOT NULL,
  user_id BIGINT NOT NULL,
  dog_encrypted_oii TEXT NOT NULL,
  dog_breed TEXT NOT NULL,
  dog_gender t_dog_gender NOT NULL,
  dog_dea1_point1 t_dog_antigen_presence NOT NULL,
  dog_modification_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dog_birthday TEXT NOT NULL, -- YYYY-MM-DD format, 00 for absent DD and/or MM
  dog_ever_pregnant t_yes_no_unknown NOT NULL,
  dog_ever_received_transfusion t_yes_no_unknown NOT NULL,
  dog_weight_kg INTEGER, -- NULL means weight is not known.
  CONSTRAINT dog_weight_kg_is_positive CHECK (dog_weight_kg > 0),
  CONSTRAINT dog_birthday_fmt CHECK (dog_birthday ~ '^\d{4}-\d{2}-\d{2}$'),
  CONSTRAINT dogs_fk_users FOREIGN KEY (user_id) REFERENCES users (user_id),
  CONSTRAINT dogs_pk PRIMARY KEY (dog_id)
);


-- ------------------------------------------------------------
-- # Triggers

CREATE FUNCTION update_admin_modification_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.admin_modification_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_modification_time_trigger
BEFORE UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION update_admin_modification_time();

CREATE FUNCTION update_user_modification_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_modification_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_modification_time_trigger
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_user_modification_time();

CREATE FUNCTION update_vet_modification_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.vet_modification_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vet_modification_time_trigger
BEFORE UPDATE ON vets
FOR EACH ROW EXECUTE FUNCTION update_vet_modification_time();

CREATE FUNCTION update_dog_modification_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.dog_modification_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dog_modification_time_trigger
BEFORE UPDATE ON dogs
FOR EACH ROW EXECUTE FUNCTION update_dog_modification_time();
