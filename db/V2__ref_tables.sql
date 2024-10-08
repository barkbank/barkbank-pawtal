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

CREATE TABLE vet_accounts (
  vet_account_id BIGSERIAL,
  vet_id BIGINT,
  vet_account_hashed_email TEXT NOT NULL,
  vet_account_encrypted_email TEXT NOT NULL,
  vet_account_encrypted_name TEXT NOT NULL,
  CONSTRAINT vet_accounts_unique_hashed_email UNIQUE(vet_account_hashed_email),
  CONSTRAINT vet_accounts_fk_vets FOREIGN KEY (vet_id) REFERENCES vets (vet_id),
  CONSTRAINT vet_account_pk PRIMARY KEY (vet_account_id)
);

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

CREATE TABLE dogs (
  dog_id BIGSERIAL,
  dog_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
  dog_birthday TIMESTAMP WITH TIME ZONE NOT NULL,
  dog_participation_status t_participation_status NOT NULL DEFAULT 'PARTICIPATING',
  dog_pause_expiry_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  dog_encrypted_reason TEXT NOT NULL DEFAULT '',

  -- profile_modification_time is not updated by table triggers
  profile_modification_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT dog_weight_kg_is_null_or_positive CHECK (dog_weight_kg IS NULL OR dog_weight_kg > 0),
  CONSTRAINT dog_participation_check CHECK (
    (dog_participation_status = 'PARTICIPATING' AND dog_pause_expiry_time IS NULL AND dog_encrypted_reason = '' )
    OR (dog_participation_status = 'PAUSED' AND dog_pause_expiry_time IS NOT NULL)
    OR (dog_participation_status = 'OPTED_OUT' AND dog_pause_expiry_time IS NULL)
  ),
  CONSTRAINT dog_pregnancy_check CHECK (
    (dog_gender <> 'MALE' OR dog_ever_pregnant = 'NO')
  ),
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

CREATE TABLE calls (
  call_id BIGSERIAL,
  call_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vet_id BIGINT NOT NULL,
  dog_id BIGINT NOT NULL,
  call_outcome t_call_outcome NOT NULL,
  encrypted_opt_out_reason TEXT NOT NULL,
  CONSTRAINT calls_fk_vets FOREIGN KEY (vet_id) REFERENCES vets (vet_id) ON DELETE RESTRICT,
  CONSTRAINT calls_fk_dogs FOREIGN KEY (dog_id) REFERENCES dogs (dog_id) ON DELETE RESTRICT,
  CONSTRAINT calls_pk PRIMARY KEY (call_id)
);

CREATE TABLE reports (
  report_id BIGSERIAL,
  report_creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  report_modification_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  call_id BIGINT NOT NULL,
  visit_time TIMESTAMP WITH TIME ZONE NOT NULL,
  dog_weight_kg REAL NOT NULL,
  dog_body_conditioning_score INTEGER NOT NULL,
  dog_heartworm t_pos_neg_nil NOT NULL,
  dog_dea1_point1 t_pos_neg_nil NOT NULL,
  dog_reported_ineligibility t_reported_ineligibility NOT NULL,
  encrypted_ineligibility_reason TEXT NOT NULL,
  ineligibility_expiry_time TIMESTAMP WITH TIME ZONE,
  dog_id BIGINT NOT NULL,
  vet_id BIGINT NOT NULL,
  dog_did_donate_blood BOOLEAN NOT NULL,
  CONSTRAINT reports_fk_calls FOREIGN KEY (call_id) REFERENCES calls (call_id) ON DELETE RESTRICT,
  CONSTRAINT reports_fk_dogs FOREIGN KEY (dog_id) REFERENCES dogs (dog_id) ON DELETE RESTRICT,
  CONSTRAINT reports_fk_vets FOREIGN KEY (vet_id) REFERENCES vets (vet_id) ON DELETE RESTRICT,
  CONSTRAINT reports_unique_dog_visit_time UNIQUE (dog_id, visit_time),
  CONSTRAINT reports_pk PRIMARY KEY (report_id)
);

CREATE TABLE pawtal_events (
  event_id BIGSERIAL,
  event_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT NOT NULL,
  ctk TEXT DEFAULT NULL,
  account_type TEXT DEFAULT NULL,
  account_id TEXT DEFAULT NULL,
  stk TEXT DEFAULT NULL,
  x_pathname TEXT DEFAULT NULL,
  x_vet_account_id TEXT DEFAULT NULL,
  x_query_string TEXT DEFAULT NULL,
  event_data JSONB DEFAULT NULL,
  pawtal_version TEXT DEFAULT NULL,
  CONSTRAINT ui_events_pk PRIMARY KEY (event_id)
);

CREATE INDEX idx_pawtal_events_event_ts ON pawtal_events(event_ts);

CREATE TABLE donor_snapshots (
  "snapshot_id" BIGSERIAL,
  "day" DATE NOT NULL,
  "dog_id" BIGINT NOT NULL,
  "dog_breed" TEXT NOT NULL,
  "dog_age_months" INTEGER NOT NULL,
  "dog_gender" t_dog_gender NOT NULL,
  "dog_weight_kg" REAL NULL,
  "dog_dea1_point1" t_pos_neg_nil NOT NULL,
  "dog_ever_pregnant" t_yes_no_unknown NOT NULL,
  "dog_ever_received_transfusion" t_yes_no_unknown NOT NULL,
  "dog_medical_status" t_medical_status NOT NULL,
  "dog_profile_status" t_profile_status NOT NULL,
  "user_id" BIGINT NOT NULL,
  "user_residency" t_residency NOT NULL,
  CONSTRAINT unique_day_dog UNIQUE ("day", "dog_id"),
  CONSTRAINT donor_snapshots_pk PRIMARY KEY ("snapshot_id")
);
