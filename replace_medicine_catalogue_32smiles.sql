-- ============================================================================
-- 32 SMILES DENTAL CLINIC: CANONICAL MEDICINE CATALOGUE MIGRATION
-- Replaces old sample/default medicine entries with the 12 canonical clinic medicines.
-- Preserves all patient records, prescriptions, invoices, and clinical data.
-- ============================================================================

-- 1. Ensure optional category & dosage_form columns exist if supported
ALTER TABLE public.medicines 
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Tablets / Capsules',
    ADD COLUMN IF NOT EXISTS dosage_form TEXT DEFAULT 'tablets';

CREATE INDEX IF NOT EXISTS idx_medicines_category ON public.medicines(category);

-- 2. Deactivate old mock & sample catalogue entries so they do not appear in the active catalogue
-- We do NOT run destructive DELETE on rows that might be linked to historical data.
UPDATE public.medicines 
SET is_active = false 
WHERE LOWER(name) IN (
    'roles-d',
    'taxim-o 200',
    'acecloren',
    'zerodol-mr',
    'flagyl 400',
    'zerodol-sp',
    'orahex-dg',
    'sensodent-k',
    'orohealth toothpaste',
    'ornigreat gel',
    'flagyl gel',
    'rabross dsr',
    'moxclav 625 mg',
    'metrogyl 600 mg',
    'hifenac d',
    'zymoflam d',
    'wynox 300 mg',
    'rexfix 200 mg',
    'ketof-dt',
    'paracetamol 650 mg',
    'paracetamol 500 mg',
    'paracetamol 250 mg',
    'moxclav 375 mg',
    'isolin junior',
    'hifenac th',
    'chymerol forte',
    'ultracet',
    'zilo',
    'sm fibro',
    'doxt-sl',
    'augmentin duo',
    'flexon suspension',
    'dentogel',
    'kenacort gel',
    'gumloc',
    'multident',
    'senquel-ad',
    'chlorhex ads',
    'vantej',
    'hydent pro',
    'stolin r',
    'cheerio gel',
    'oro champ',
    'kidodent',
    'thermoseal proxa ns/ws interdental brushes',
    'colgate slim soft'
);

-- 3. Upsert the 12 Canonical Clinic Medicines
INSERT INTO public.medicines (
    name,
    category,
    dosage_form,
    stock_unit,
    low_stock_threshold,
    is_active,
    is_configured,
    opening_stock,
    available_quantity
)
VALUES
    -- 1. Betatwist™ Mint Flavour — Povidone-Iodine Gargle 2% w/v
    ('Betatwist™ Mint Flavour', 'Mouthwashes', 'Gargle', 'bottles', 5, true, false, NULL, NULL),

    -- 2. Candy Cop PRO — Organic Fluoride Toothpaste
    ('Candy Cop PRO', 'Toothpastes', 'Toothpaste', 'tubes', 5, true, false, NULL, NULL),

    -- 3. Gumloc® TOTAL — Advanced Gum Care Toothpaste
    ('Gumloc® TOTAL', 'Toothpastes', 'Toothpaste', 'tubes', 5, true, false, NULL, NULL),

    -- 4. Hydent PRO — Foaming Fluoridated Toothpaste
    ('Hydent PRO', 'Toothpastes', 'Toothpaste', 'tubes', 5, true, false, NULL, NULL),

    -- 5. Ketof-DT™ — Ketorolac Tromethamine 10 mg
    ('Ketof-DT™', 'Tablets / Capsules', 'Dispersible Tablet', 'tablets', 5, true, false, NULL, NULL),

    -- 6. Ebility® — Diclofenac Potassium + Paracetamol + Serratiopeptidase
    ('Ebility®', 'Tablets / Capsules', 'Tablet', 'tablets', 5, true, false, NULL, NULL),

    -- 7. Angirab-DSR — Rabeprazole + Domperidone
    ('Angirab-DSR', 'Tablets / Capsules', 'Capsule', 'capsules', 5, true, false, NULL, NULL),

    -- 8. Aramox CV 625 — Amoxicillin + Potassium Clavulanate
    ('Aramox CV 625', 'Tablets / Capsules', 'Tablet', 'tablets', 5, true, false, NULL, NULL),

    -- 9. Flagyl® ER — Metronidazole 600 mg
    ('Flagyl® ER', 'Tablets / Capsules', 'Tablet', 'tablets', 5, true, false, NULL, NULL),

    -- 10. Ebility® ASP — Aceclofenac + Paracetamol + Serratiopeptidase
    ('Ebility® ASP', 'Tablets / Capsules', 'Tablet', 'tablets', 5, true, false, NULL, NULL),

    -- 11. Hydent 360 Mouthwash — 100 mL
    ('Hydent 360 Mouthwash', 'Mouthwashes', 'Mouthwash', 'bottles', 5, true, false, NULL, NULL),

    -- 12. Tresmox CV™ — Amoxicillin + Potassium Clavulanate 500 mg + 125 mg
    ('Tresmox CV™', 'Tablets / Capsules', 'Tablet', 'tablets', 5, true, false, NULL, NULL)

ON CONFLICT (name) DO UPDATE SET
    category = EXCLUDED.category,
    dosage_form = EXCLUDED.dosage_form,
    stock_unit = EXCLUDED.stock_unit,
    is_active = true;

-- Verification
SELECT id, name, category, dosage_form, stock_unit, is_active 
FROM public.medicines 
WHERE is_active = true 
ORDER BY name;
