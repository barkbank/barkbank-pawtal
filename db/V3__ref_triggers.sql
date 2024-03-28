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

CREATE FUNCTION update_report_modification_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.report_modification_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_report_modification_time_trigger
BEFORE UPDATE ON reports
FOR EACH ROW EXECUTE FUNCTION update_report_modification_time();
