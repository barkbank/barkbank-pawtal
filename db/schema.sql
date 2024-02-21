CREATE TABLE users (
  user_id BIGSERIAL,
  user_creation_time TIMESTAMP WITH TIME ZONE NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone_number TEXT NOT NULL,
  CONSTRAINT users_unique_user_email UNIQUE (user_email),
  CONSTRAINT users_pk PRIMARY KEY (user_id)
);

CREATE TABLE admins (
  admin_id BIGSERIAL,
  admin_creation_time TIMESTAMP WITH TIME ZONE NOT NULL,
  admin_email TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  admin_phone_number TEXT NOT NULL,
  CONSTRAINT admin_unique_admin_email UNIQUE (admin_email),
  CONSTRAINT admin_pk PRIMARY KEY (admin_id)
);

CREATE TABLE vets (
  vet_id BIGSERIAL,
  vet_creation_time TIMESTAMP WITH TIME ZONE NOT NULL,
  vet_email TEXT NOT NULL,
  vet_name TEXT NOT NULL,
  vet_phone_number TEXT NOT NULL,
  vet_address TEXT NOT NULL,
  CONSTRAINT vet_unique_vet_email UNIQUE (vet_email),
  CONSTRAINT vet_pk PRIMARY KEY (vet_id)
);

CREATE TYPE t_dog_gender AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE t_dog_antigen_presence AS ENUM ('POSITIVE', 'NEGATIVE', 'UNKNOWN');

CREATE TABLE dogs (
  dog_id BIGSERIAL,
  dog_creation_time TIMESTAMP WITH TIME ZONE NOT NULL,
  dog_status TEXT NOT NULL,
  user_id BIGINT NOT NULL,
  dog_name TEXT NOT NULL,
  dog_breed TEXT NOT NULL,
  dog_birth_month TEXT NOT NULL, -- YYYY-MM format MM=00 means month is unknown
  dog_gender t_dog_gender NOT NULL,
  dog_dea1_point1 t_dog_antigen_presence NOT NULL,
  CONSTRAINT dogs_fk_users FOREIGN KEY (user_id) REFERENCES users (user_id),
  CONSTRAINT dogs_unique_user_dog UNIQUE (user_id, dog_name),
  CONSTRAINT dogs_pk PRIMARY KEY (dog_id)
);
