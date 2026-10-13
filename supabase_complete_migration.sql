-- ============================================================================
-- DENTPRO OS - 32 SMILES STANDALONE SINGLE-CLINIC CANONICAL MIGRATION
-- ============================================================================
-- Complete, single-file DDL script for 32 Smiles Multispeciality Dental Clinic.
-- Standalone single-clinic database architecture (No multi-tenant clinic_id).
-- Strict 2-Role RBAC: 'owner' (Full Clinical/Admin) vs 'receptionist' (Admin/Billing).
-- Fully idempotent (IF NOT EXISTS / DROP IF EXISTS) and safe for execution in 
-- the Supabase SQL Editor for project `gjxpellqcgxlicbylbhe`.
--
-- DEPENDENCY-SAFE PHASE ARCHITECTURE:
-- Phase 1: Extensions
-- Phase 2: Core Tables (Ordered by FK dependencies: profiles -> patients -> doctors -> appointments...)
-- Phase 3: Sequences
-- Phase 4: Helper Functions (Created ONLY after referenced tables exist)
-- Phase 5: Triggers (Created ONLY after tables and functions exist)
-- Phase 6: Indexes & Unique Constraints
-- Phase 7: Seed Data (Initial Medicines)
-- Phase 8: Row Level Security (RLS) Policies
-- Phase 9: Permissions & Grants
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PHASE 1: EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- PHASE 2: CORE SINGLE-CLINIC TABLES CREATION (DEPENDENCY-SAFE ORDER - 14 TABLES)
-- ----------------------------------------------------------------------------

-- Table 1: Staff Profiles Table (No FK dependencies)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'receptionist')),
    custom_title TEXT,
    phone TEXT,
    status TEXT CHECK (status IN ('Active', 'Inactive', 'On Leave')) DEFAULT 'Active',
    has_login BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 2: Patients Table (No FK dependencies)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    age TEXT,
    gender TEXT,
    address TEXT,
    visit TEXT,
    medical_notes TEXT,
    balance TEXT DEFAULT '₹0',
    status TEXT CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    dental_chart JSONB DEFAULT '{}'::jsonb,
    prescriptions JSONB DEFAULT '[]'::jsonb,
    notes JSONB DEFAULT '[]'::jsonb,
    files JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 3: Doctors Table (Depends on public.profiles)
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    specialty TEXT,
    phone TEXT,
    status TEXT CHECK (status IN ('Available', 'Active', 'In Consultation', 'On Break', 'Finished Today', 'Inactive')) DEFAULT 'Available',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 4: Appointments Table (Depends on public.patients, public.doctors)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    procedure_name TEXT,
    status TEXT CHECK (status IN ('Scheduled', 'Waiting', 'Checked In', 'In Consultation', 'In Procedure', 'Completed', 'Cancelled', 'No Show')) DEFAULT 'Scheduled',
    queue_token TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 5: Blocked Slots Table (Depends on public.doctors)
CREATE TABLE IF NOT EXISTS public.blocked_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocked_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 6: Treatments Catalog & Clinical Records Table (Depends on public.patients, public.doctors)
CREATE TABLE IF NOT EXISTS public.treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT,
    cost NUMERIC NOT NULL DEFAULT 0,
    duration TEXT,
    stage TEXT CHECK (stage IN ('Planned', 'In Progress', 'Completed')) DEFAULT 'Planned',
    status TEXT DEFAULT 'Active',
    tooth_number INTEGER,
    diagnosis TEXT,
    notes TEXT,
    treatment_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 7: Billing & Receipts Table (Depends on public.patients)
CREATE TABLE IF NOT EXISTS public.billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id TEXT,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name TEXT,
    treatment TEXT,
    subtotal NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    paid_amount NUMERIC DEFAULT 0,
    payment_method TEXT,
    payment_date TIMESTAMPTZ DEFAULT now(),
    status TEXT CHECK (status IN ('Paid', 'Partially Paid', 'Unpaid', 'Pending')) DEFAULT 'Unpaid',
    items JSONB DEFAULT '[]'::jsonb,
    payment_logs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 8: Medicines Catalogue Table (No internal FK dependencies)
CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    stock_unit TEXT NOT NULL DEFAULT 'tablets',
    opening_stock NUMERIC NULL,
    available_quantity NUMERIC NULL,
    low_stock_threshold NUMERIC NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_configured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 9: Stock Transactions Table (Depends on public.medicines, auth.users)
CREATE TABLE IF NOT EXISTS public.stock_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('opening_stock', 'received', 'dispensed', 'adjustment')),
    quantity NUMERIC NOT NULL,
    previous_quantity NUMERIC NULL,
    new_quantity NUMERIC NOT NULL,
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    reference TEXT NULL,
    notes TEXT NULL,
    prescription_id TEXT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 10: Patient Prescriptions Table (No internal FK dependencies)
CREATE TABLE IF NOT EXISTS public.patient_prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
    diagnosis TEXT NULL,
    advice TEXT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 11: Persistent Database Backup History Table (No internal FK dependencies)
CREATE TABLE IF NOT EXISTS public.backup_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL CHECK (status IN ('triggered', 'pending', 'completed', 'failed')),
    backup_size BIGINT NULL,
    file_name TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ NULL
);

-- Table 12: Activities Audit Log Table (No internal FK dependencies)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    user_name TEXT,
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 13: System Notifications Table (No internal FK dependencies)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    time TEXT,
    type TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 14: Clinic Settings Table (No internal FK dependencies)
CREATE TABLE IF NOT EXISTS public.clinic_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_name TEXT DEFAULT '32 Smiles Multispeciality Dental Clinic',
    tagline TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- PHASE 3: SEQUENCES
-- (MUST RUN AFTER public.patients EXISTS)
-- ----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.patient_id_seq START 1001;

SELECT setval(
    'public.patient_id_seq', 
    COALESCE(
        (SELECT MAX(SUBSTRING(patient_id FROM '[0-9]+')::integer) FROM public.patients WHERE patient_id LIKE 'DS-%'),
        1000
    )
);

-- ----------------------------------------------------------------------------
-- PHASE 4: HELPER FUNCTIONS (7 FUNCTIONS TOTAL)
-- (CREATED ONLY AFTER ALL REFERENCED TABLES EXIST)
-- ----------------------------------------------------------------------------

-- Function 1: Timestamp modifier trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Function 2: Single-Clinic Role Resolution Helper Function
-- Returns the user's role ('owner' or 'receptionist') from public.profiles.
-- Executed after public.profiles exists.
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()), 'receptionist');
$$;

REVOKE ALL ON FUNCTION public.get_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO service_role;

-- Function 3: Trigger Function to Keep has_login Synced with Auth Users
CREATE OR REPLACE FUNCTION public.handle_profile_has_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.has_login := EXISTS (SELECT 1 FROM auth.users WHERE id = NEW.id);
    RETURN NEW;
END;
$$;

-- Function 4: Trigger Function for User Deletion Cleanup
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.profiles WHERE id = OLD.id;
    RETURN OLD;
END;
$$;

-- Function 5: Atomic Bootstrap & Registration Trigger
-- First registered user becomes active Owner; subsequent signups default to Receptionist.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_owner_count INT;
BEGIN
    PERFORM pg_advisory_xact_lock(hashtext('single_clinic_owner_bootstrap_lock'));
    SELECT COUNT(*) INTO v_owner_count FROM public.profiles WHERE role = 'owner';
    
    IF v_owner_count = 0 THEN
        INSERT INTO public.profiles (id, full_name, role, has_login, status)
        VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'owner', true, 'Active')
        ON CONFLICT (id) DO UPDATE SET role = 'owner', status = 'Active';
    ELSE
        INSERT INTO public.profiles (id, full_name, role, has_login, status)
        VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'receptionist', true, 'Inactive')
        ON CONFLICT (id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

-- Function 6: Patient Display ID (DS-xxxx) Generator
-- Depends on public.patient_id_seq sequence
CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.patient_id IS NULL OR NEW.patient_id = '' THEN
        NEW.patient_id := 'DS-' || nextval('public.patient_id_seq')::text;
    END IF;
    RETURN NEW;
END;
$$;

-- Function 7: Patient Clinical Column Protection Trigger Function
-- Depends on get_user_role() and public.patients
CREATE OR REPLACE FUNCTION public.enforce_patient_column_permissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF public.get_user_role() = 'receptionist' THEN
        IF TG_OP = 'INSERT' THEN
            -- On INSERT, receptionists cannot inject clinical data:
            -- dental_chart, prescriptions, files, or notes must not contain clinical data.
            IF (NEW.dental_chart IS NOT NULL AND NEW.dental_chart IS DISTINCT FROM '{}'::jsonb) OR
               (NEW.prescriptions IS NOT NULL AND NEW.prescriptions IS DISTINCT FROM '[]'::jsonb) OR
               (NEW.files IS NOT NULL AND NEW.files IS DISTINCT FROM '[]'::jsonb) OR
               (NEW.notes IS NOT NULL AND NEW.notes IS DISTINCT FROM '[]'::jsonb) THEN
                RAISE EXCEPTION 'Access Denied: Receptionists are not permitted to insert clinical patient data (dental_chart, prescriptions, files, notes).';
            END IF;
        ELSIF TG_OP = 'UPDATE' THEN
            -- On UPDATE, receptionists cannot modify any clinical patient fields.
            IF (NEW.medical_notes IS DISTINCT FROM OLD.medical_notes) OR
               (NEW.dental_chart IS DISTINCT FROM OLD.dental_chart) OR
               (NEW.prescriptions IS DISTINCT FROM OLD.prescriptions) OR
               (NEW.notes IS DISTINCT FROM OLD.notes) OR
               (NEW.files IS DISTINCT FROM OLD.files) THEN
                RAISE EXCEPTION 'Access Denied: Receptionists are not permitted to modify clinical patient data (medical_notes, dental_chart, prescriptions, notes, files).';
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_patient_column_permissions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enforce_patient_column_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_patient_column_permissions() TO service_role;

-- ----------------------------------------------------------------------------
-- PHASE 5: TRIGGERS
-- (CREATED ONLY AFTER TABLES AND FUNCTIONS EXIST)
-- ----------------------------------------------------------------------------

-- Patient ID Generator Trigger
DROP TRIGGER IF EXISTS tr_generate_patient_id ON public.patients;
CREATE TRIGGER tr_generate_patient_id
    BEFORE INSERT ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.generate_patient_id();

-- Auth User Creation -> Profile Bootstrap Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profile Login Flag Sync Trigger
DROP TRIGGER IF EXISTS tr_profile_has_login ON public.profiles;
CREATE TRIGGER tr_profile_has_login
    BEFORE INSERT OR UPDATE OF id ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_profile_has_login();

-- Auth User Delete -> Profile Delete Trigger
DROP TRIGGER IF EXISTS tr_user_delete ON auth.users;
CREATE TRIGGER tr_user_delete
    AFTER DELETE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- Updated At Timestamps Triggers
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_patients_updated_at ON public.patients;
CREATE TRIGGER tr_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_doctors_updated_at ON public.doctors;
CREATE TRIGGER tr_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_appointments_updated_at ON public.appointments;
CREATE TRIGGER tr_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_treatments_updated_at ON public.treatments;
CREATE TRIGGER tr_treatments_updated_at BEFORE UPDATE ON public.treatments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_billing_updated_at ON public.billing;
CREATE TRIGGER tr_billing_updated_at BEFORE UPDATE ON public.billing FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_medicines_updated_at ON public.medicines;
CREATE TRIGGER tr_medicines_updated_at BEFORE UPDATE ON public.medicines FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_patient_prescriptions_updated_at ON public.patient_prescriptions;
CREATE TRIGGER tr_patient_prescriptions_updated_at BEFORE UPDATE ON public.patient_prescriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Patient Clinical Column Protection Trigger
DROP TRIGGER IF EXISTS tr_enforce_patient_column_permissions ON public.patients;
CREATE TRIGGER tr_enforce_patient_column_permissions
    BEFORE INSERT OR UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.enforce_patient_column_permissions();

-- ----------------------------------------------------------------------------
-- PHASE 6: INDEXES & UNIQUE CONSTRAINTS
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON public.patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);

-- Prevent active doctor double-booking on same slot
DROP INDEX IF EXISTS public.idx_appointments_no_double_booking;
CREATE UNIQUE INDEX idx_appointments_no_double_booking 
ON public.appointments (doctor_id, appointment_date, time_slot) 
WHERE (status != 'Cancelled' AND status != 'No Show' AND doctor_id IS NOT NULL);

-- Blocked Slots Indexing
CREATE INDEX IF NOT EXISTS blocked_slots_date_idx ON public.blocked_slots(blocked_date);
DROP INDEX IF EXISTS public.blocked_slots_unique_idx;
CREATE UNIQUE INDEX blocked_slots_unique_idx 
ON public.blocked_slots (blocked_date, time_slot, COALESCE(doctor_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- Medicine Inventory Indexing
CREATE INDEX IF NOT EXISTS idx_medicines_active ON public.medicines(is_active);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_med ON public.stock_transactions(medicine_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_date ON public.stock_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_patient_prescriptions_patient ON public.patient_prescriptions(patient_id);

-- ----------------------------------------------------------------------------
-- PHASE 7: INITIAL MEDICINES SEED DATA (EXACTLY 11 DEFAULT MEDICINES, UNSET QUANTITIES)
-- ----------------------------------------------------------------------------
INSERT INTO public.medicines (name, stock_unit, low_stock_threshold, is_active, is_configured, opening_stock, available_quantity)
VALUES
    ('Roles-D', 'tablets', 5, true, false, NULL, NULL),
    ('Taxim-O 200', 'tablets', 5, true, false, NULL, NULL),
    ('Acecloren', 'tablets', 5, true, false, NULL, NULL),
    ('Zerodol-MR', 'tablets', 5, true, false, NULL, NULL),
    ('Flagyl 400', 'tablets', 5, true, false, NULL, NULL),
    ('Zerodol-SP', 'tablets', 5, true, false, NULL, NULL),
    ('Orahex-DG', 'bottles', 5, true, false, NULL, NULL),
    ('Sensodent-K', 'tubes', 5, true, false, NULL, NULL),
    ('Orohealth Toothpaste', 'tubes', 5, true, false, NULL, NULL),
    ('Ornigreat Gel', 'tubes', 5, true, false, NULL, NULL),
    ('Flagyl Gel', 'tubes', 5, true, false, NULL, NULL)
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- PHASE 8: ROW LEVEL SECURITY (RLS) POLICIES
-- (SAFE TO REFERENCE get_user_role() AFTER PROFILES AND get_user_role() EXIST)
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- A. Profiles RLS
DROP POLICY IF EXISTS "Allow authenticated read profiles" ON public.profiles;
CREATE POLICY "Allow authenticated read profiles" ON public.profiles
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow owner write profiles" ON public.profiles;
CREATE POLICY "Allow owner write profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (public.get_user_role() = 'owner')
    WITH CHECK (public.get_user_role() = 'owner');

-- B. Patients RLS
DROP POLICY IF EXISTS "Allow staff read patients" ON public.patients;
CREATE POLICY "Allow staff read patients" ON public.patients FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow staff write patients" ON public.patients;

DROP POLICY IF EXISTS "Allow staff insert patients" ON public.patients;
CREATE POLICY "Allow staff insert patients" ON public.patients
    FOR INSERT TO authenticated
    WITH CHECK (public.get_user_role() IN ('owner', 'receptionist'));

DROP POLICY IF EXISTS "Allow staff update patients" ON public.patients;
CREATE POLICY "Allow staff update patients" ON public.patients
    FOR UPDATE TO authenticated
    USING (public.get_user_role() IN ('owner', 'receptionist'))
    WITH CHECK (public.get_user_role() IN ('owner', 'receptionist'));

DROP POLICY IF EXISTS "Allow owner delete patients" ON public.patients;
CREATE POLICY "Allow owner delete patients" ON public.patients
    FOR DELETE TO authenticated
    USING (public.get_user_role() = 'owner');

-- C. Doctors RLS
DROP POLICY IF EXISTS "Allow staff read doctors" ON public.doctors;
CREATE POLICY "Allow staff read doctors" ON public.doctors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow owner write doctors" ON public.doctors;
CREATE POLICY "Allow owner write doctors" ON public.doctors
    FOR ALL TO authenticated
    USING (public.get_user_role() = 'owner')
    WITH CHECK (public.get_user_role() = 'owner');

-- D. Appointments & Blocked Slots RLS
DROP POLICY IF EXISTS "Allow staff read appointments" ON public.appointments;
CREATE POLICY "Allow staff read appointments" ON public.appointments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow staff write appointments" ON public.appointments;
CREATE POLICY "Allow staff write appointments" ON public.appointments
    FOR ALL TO authenticated
    USING (public.get_user_role() IN ('owner', 'receptionist'))
    WITH CHECK (public.get_user_role() IN ('owner', 'receptionist'));

DROP POLICY IF EXISTS "Allow staff read blocked_slots" ON public.blocked_slots;
CREATE POLICY "Allow staff read blocked_slots" ON public.blocked_slots FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow staff write blocked_slots" ON public.blocked_slots;
CREATE POLICY "Allow staff write blocked_slots" ON public.blocked_slots
    FOR ALL TO authenticated
    USING (public.get_user_role() IN ('owner', 'receptionist'))
    WITH CHECK (public.get_user_role() IN ('owner', 'receptionist'));

-- E. Treatments Clinical RLS
DROP POLICY IF EXISTS "Allow staff read treatments" ON public.treatments;
CREATE POLICY "Allow staff read treatments" ON public.treatments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow owner write treatments" ON public.treatments;
CREATE POLICY "Allow owner write treatments" ON public.treatments
    FOR ALL TO authenticated
    USING (public.get_user_role() = 'owner')
    WITH CHECK (public.get_user_role() = 'owner');

-- F. Billing RLS
DROP POLICY IF EXISTS "Allow staff read billing" ON public.billing;
CREATE POLICY "Allow staff read billing" ON public.billing FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow staff write billing" ON public.billing;
CREATE POLICY "Allow staff write billing" ON public.billing
    FOR ALL TO authenticated
    USING (public.get_user_role() IN ('owner', 'receptionist'))
    WITH CHECK (public.get_user_role() IN ('owner', 'receptionist'));

-- G. Medicine Stock Inventory RLS
DROP POLICY IF EXISTS "Allow staff read medicines" ON public.medicines;
CREATE POLICY "Allow staff read medicines" ON public.medicines FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow owner write medicines" ON public.medicines;
CREATE POLICY "Allow owner write medicines" ON public.medicines
    FOR ALL TO authenticated
    USING (public.get_user_role() = 'owner')
    WITH CHECK (public.get_user_role() = 'owner');

-- H. Stock Transactions Audit Log RLS
DROP POLICY IF EXISTS "Allow owner access stock_transactions" ON public.stock_transactions;
CREATE POLICY "Allow owner access stock_transactions" ON public.stock_transactions
    FOR ALL TO authenticated
    USING (public.get_user_role() = 'owner')
    WITH CHECK (public.get_user_role() = 'owner');

-- I. Patient Prescriptions RLS
DROP POLICY IF EXISTS "Allow staff read patient_prescriptions" ON public.patient_prescriptions;
CREATE POLICY "Allow staff read patient_prescriptions" ON public.patient_prescriptions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow owner write patient_prescriptions" ON public.patient_prescriptions;
CREATE POLICY "Allow owner write patient_prescriptions" ON public.patient_prescriptions
    FOR ALL TO authenticated
    USING (public.get_user_role() = 'owner')
    WITH CHECK (public.get_user_role() = 'owner');

-- J. Backup History Audit Log RLS
DROP POLICY IF EXISTS "Owner full access on backup_history" ON public.backup_history;
CREATE POLICY "Owner full access on backup_history" ON public.backup_history
    FOR ALL TO authenticated
    USING (public.get_user_role() = 'owner')
    WITH CHECK (public.get_user_role() = 'owner');

-- K. Activities & Notifications RLS
DROP POLICY IF EXISTS "Allow staff read activities" ON public.activities;
CREATE POLICY "Allow staff read activities" ON public.activities FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow staff write activities" ON public.activities;
CREATE POLICY "Allow staff write activities" ON public.activities FOR ALL TO authenticated USING (public.get_user_role() IN ('owner', 'receptionist')) WITH CHECK (public.get_user_role() IN ('owner', 'receptionist'));

DROP POLICY IF EXISTS "Allow staff read notifications" ON public.notifications;
CREATE POLICY "Allow staff read notifications" ON public.notifications FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow staff write notifications" ON public.notifications;
CREATE POLICY "Allow staff write notifications" ON public.notifications FOR ALL TO authenticated USING (public.get_user_role() IN ('owner', 'receptionist')) WITH CHECK (public.get_user_role() IN ('owner', 'receptionist'));

-- L. Clinic Settings RLS
DROP POLICY IF EXISTS "Allow staff read clinic_settings" ON public.clinic_settings;
DROP POLICY IF EXISTS "Allow owner read clinic_settings" ON public.clinic_settings;
CREATE POLICY "Allow owner read clinic_settings" ON public.clinic_settings
    FOR SELECT TO authenticated
    USING (public.get_user_role() = 'owner');

DROP POLICY IF EXISTS "Allow owner write clinic_settings" ON public.clinic_settings;
CREATE POLICY "Allow owner write clinic_settings" ON public.clinic_settings
    FOR ALL TO authenticated
    USING (public.get_user_role() = 'owner')
    WITH CHECK (public.get_user_role() = 'owner');

-- ----------------------------------------------------------------------------
-- PHASE 9: PERMISSIONS & GRANTS
-- ----------------------------------------------------------------------------
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
