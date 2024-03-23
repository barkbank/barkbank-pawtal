CREATE TABLE admins (
  admin_id BIGSERIAL,
  admin_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  admin_hashed_email TEXT NOT NULL,
  admin_encrypted_pii TEXT NOT NULL,
  admin_modification_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  admin_can_manage_admin_accounts BOOLEAN NOT NULL DEFAULT FALSE,
  admin_can_manage_vet_accounts BOOLEAN NOT NULL DEFAULT FALSE,
  admin_can_manage_user_accounts BOOLEAN NOT NULL DEFAULT FALSE,
  admin_can_manage_donors BOOLEAN NOT NULL DEFAULT FALSE,
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

CREATE TYPE t_residency AS ENUM ('OTHER', 'SINGAPORE');

CREATE TABLE users (
  user_id BIGSERIAL,
  user_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_hashed_email TEXT NOT NULL,
  user_encrypted_pii TEXT NOT NULL,
  user_modification_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_residency t_residency NOT NULL,
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

  -- User ID is nullable, allowing User records to be deleted while leaving
  -- behind Dog records. This way records used to track dog related activities
  -- would not have broken references.
  user_id BIGINT,

  dog_encrypted_oii TEXT NOT NULL,
  dog_breed TEXT NOT NULL,
  dog_gender t_dog_gender NOT NULL,
  dog_dea1_point1 t_dog_antigen_presence NOT NULL,
  dog_modification_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dog_ever_pregnant t_yes_no_unknown NOT NULL,
  dog_ever_received_transfusion t_yes_no_unknown NOT NULL,
  dog_weight_kg REAL, -- NULL means weight is not known.

  -- TIMESTAMP WITH TIME ZONE so the Date in TypeScript isn't ambiguous.
  dog_birthday TIMESTAMP WITH TIME ZONE NOT NULL,

  -- In PostgreSQL ``a check constraint is satisfied if the check expression
  -- evaluates to true or the null value. Since most expressions will evaluate
  -- to the null value if any operand is null, they will not prevent null values
  -- in the constrained columns'' (Ref1)
  --
  -- However, in the interest of clarity and the avoidence of doubt, we have
  -- included it in the constraint.
  --
  -- Ref1:
  -- https://www.postgresql.org/docs/15/ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS
  --
  CONSTRAINT dog_weight_kg_is_null_or_positive CHECK (dog_weight_kg IS NULL OR dog_weight_kg > 0),

  CONSTRAINT dogs_fk_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL,
  CONSTRAINT dogs_pk PRIMARY KEY (dog_id)
);

-- A user's vet preference for each given dog.
CREATE TABLE dog_vet_preferences (
  dog_id BIGINT NOT NULL,
  vet_id BIGINT NOT NULL,

  -- The reason for this FK is so that dog-vet preferences can be deleted when
  -- user is deleted. Necessary because ON DELETE for dogs_fk_users is SET NULL.
  user_id BIGINT NOT NULL,

  preference_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT dog_vet_preferences_fk_dogs FOREIGN KEY (dog_id) REFERENCES dogs (dog_id) ON DELETE CASCADE,
  CONSTRAINT dog_vet_preferences_fk_vets FOREIGN KEY (vet_id) REFERENCES vets (vet_id) ON DELETE CASCADE,
  CONSTRAINT dog_vet_preferences_fk_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT dog_vet_preferences_pk PRIMARY KEY (dog_id, vet_id)
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
