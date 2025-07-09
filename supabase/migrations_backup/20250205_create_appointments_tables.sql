-- Create services table
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- Insert default services
INSERT INTO services (id, title, duration, price, description, icon) VALUES
    ('consultation', 'Consultation Naturopathie', '1h30', 90, 'Bilan de vitalité complet et plan d''action personnalisé', 'eco'),
    ('suivi', 'Suivi Nutritionnel', '1h', 75, 'Accompagnement et ajustement de votre plan alimentaire', 'restaurant'),
    ('phyto', 'Consultation Phytothérapie', '1h', 80, 'Conseils personnalisés en plantes médicinales', 'spa'),
    ('massage', 'Massage Bien-être', '1h', 85, 'Massage relaxant aux huiles essentielles', 'self_improvement');

-- Create appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id TEXT REFERENCES services(id) NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    stripe_session_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for checking availability
CREATE INDEX idx_appointments_date_time_status ON appointments(date, time, status);

-- Create RLS policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Services policies (anyone can read)
CREATE POLICY "Services are viewable by everyone" ON services
    FOR SELECT USING (true);

-- Appointments policies
CREATE POLICY "Users can create appointments" ON appointments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own appointments" ON appointments
    FOR SELECT USING (client_email = auth.jwt()->>'email');

-- Function to check appointment availability
CREATE OR REPLACE FUNCTION check_appointment_availability(
    check_date DATE,
    check_time TIME,
    service_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1
        FROM appointments
        WHERE date = check_date
        AND time = check_time
        AND status = 'confirmed'
    );
END;
$$;
