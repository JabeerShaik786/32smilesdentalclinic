-- ============================================================================
-- DENTPRO OS - 32 SMILES DENTAL CLINIC SECURITY PATCH
-- Target Supabase Project Ref: `gjxpellqcgxlicbylbhe`
-- Target Supabase Project URL: `https://gjxpellqcgxlicbylbhe.supabase.co`
-- ============================================================================
-- Idempotent SQL Security Patch to apply live database RLS and trigger updates.
-- 1. Restrict profiles write access to Owner ONLY (Prevents self-promotion).
-- 2. Restrict receptionist write access on public.patients (Guards clinical fields
--    on INSERT and UPDATE while allowing administrative registration/intake medical notes).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROFILES RLS WRITE POLICY (OWNER ONLY)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow owner write profiles" ON public.profiles;
CREATE POLICY "Allow owner write profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (public.get_user_role() = 'owner')
    WITH CHECK (public.get_user_role() = 'owner');

-- ----------------------------------------------------------------------------
-- 2. PATIENT CLINICAL COLUMN PROTECTION TRIGGER FUNCTION
-- ----------------------------------------------------------------------------
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
-- 3. PATIENT CLINICAL COLUMN PROTECTION TRIGGER ATTACHMENT
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_enforce_patient_column_permissions ON public.patients;
CREATE TRIGGER tr_enforce_patient_column_permissions
    BEFORE INSERT OR UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.enforce_patient_column_permissions();
