export const MEDICINE_CATEGORIES = [
  "Tablets / Capsules",
  "Syrups / Suspensions",
  "Ointments / Gels",
  "Mouthwashes",
  "Toothpastes",
  "Kids' Products",
  "Brushes",
] as const;

export type MedicineCategory = (typeof MEDICINE_CATEGORIES)[number];

export interface CatalogueMedicineDefinition {
  name: string;
  category: MedicineCategory;
  dosage_form: string;
  stock_unit: string;
  formulation?: string;
  spellingNote?: string;
}

/**
 * 12 Canonical Medicines for 32 Smiles Dental Clinic
 * Exactly as specified:
 * 1. Betatwist™ Mint Flavour — Povidone-Iodine Gargle 2% w/v
 * 2. Candy Cop PRO — Organic Fluoride Toothpaste
 * 3. Gumloc® TOTAL — Advanced Gum Care Toothpaste
 * 4. Hydent PRO — Foaming Fluoridated Toothpaste
 * 5. Ketof-DT™ — Ketorolac Tromethamine 10 mg
 * 6. Ebility® — Diclofenac Potassium + Paracetamol + Serratiopeptidase
 * 7. Angirab-DSR — Rabeprazole + Domperidone
 * 8. Aramox CV 625 — Amoxicillin + Potassium Clavulanate
 * 9. Flagyl® ER — Metronidazole 600 mg
 * 10. Ebility® ASP — Aceclofenac + Paracetamol + Serratiopeptidase
 * 11. Hydent 360 Mouthwash — 100 mL
 * 12. Tresmox CV™ — Amoxicillin + Potassium Clavulanate 500 mg + 125 mg
 */
export const INITIAL_MEDICINES_CATALOGUE: CatalogueMedicineDefinition[] = [
  {
    name: "Betatwist™ Mint Flavour",
    category: "Mouthwashes",
    dosage_form: "Gargle",
    stock_unit: "bottles",
    formulation: "Povidone-Iodine Gargle 2% w/v",
  },
  {
    name: "Candy Cop PRO",
    category: "Toothpastes",
    dosage_form: "Toothpaste",
    stock_unit: "tubes",
    formulation: "Organic Fluoride Toothpaste",
  },
  {
    name: "Gumloc® TOTAL",
    category: "Toothpastes",
    dosage_form: "Toothpaste",
    stock_unit: "tubes",
    formulation: "Advanced Gum Care Toothpaste",
  },
  {
    name: "Hydent PRO",
    category: "Toothpastes",
    dosage_form: "Toothpaste",
    stock_unit: "tubes",
    formulation: "Foaming Fluoridated Toothpaste",
  },
  {
    name: "Ketof-DT™",
    category: "Tablets / Capsules",
    dosage_form: "Dispersible Tablet",
    stock_unit: "tablets",
    formulation: "Ketorolac Tromethamine 10 mg",
  },
  {
    name: "Ebility®",
    category: "Tablets / Capsules",
    dosage_form: "Tablet",
    stock_unit: "tablets",
    formulation: "Diclofenac Potassium + Paracetamol + Serratiopeptidase",
  },
  {
    name: "Angirab-DSR",
    category: "Tablets / Capsules",
    dosage_form: "Capsule",
    stock_unit: "capsules",
    formulation: "Rabeprazole + Domperidone",
  },
  {
    name: "Aramox CV 625",
    category: "Tablets / Capsules",
    dosage_form: "Tablet",
    stock_unit: "tablets",
    formulation: "Amoxicillin + Potassium Clavulanate",
  },
  {
    name: "Flagyl® ER",
    category: "Tablets / Capsules",
    dosage_form: "Tablet",
    stock_unit: "tablets",
    formulation: "Metronidazole 600 mg",
  },
  {
    name: "Ebility® ASP",
    category: "Tablets / Capsules",
    dosage_form: "Tablet",
    stock_unit: "tablets",
    formulation: "Aceclofenac + Paracetamol + Serratiopeptidase",
  },
  {
    name: "Hydent 360 Mouthwash",
    category: "Mouthwashes",
    dosage_form: "Mouthwash",
    stock_unit: "bottles",
    formulation: "100 mL",
  },
  {
    name: "Tresmox CV™",
    category: "Tablets / Capsules",
    dosage_form: "Tablet",
    stock_unit: "tablets",
    formulation: "Amoxicillin + Potassium Clavulanate 500 mg + 125 mg",
  },
];

/**
 * Fast set of current 12 canonical medicine names (lowercase)
 */
const CANONICAL_12_NAMES = new Set(
  INITIAL_MEDICINES_CATALOGUE.map((m) => m.name.toLowerCase())
);

/**
 * Legacy sample/mock medicine names that must be explicitly excluded
 * from the active catalogue across all views.
 */
export const OLD_MOCK_MEDICINE_NAMES = new Set([
  // Legacy 11 mocks
  "roles-d",
  "taxim-o 200",
  "acecloren",
  "zerodol-mr",
  "flagyl 400",
  "zerodol-sp",
  "orahex-dg",
  "sensodent-k",
  "orohealth toothpaste",
  "ornigreat gel",
  "flagyl gel",

  // Previous 35 sample entries (non-canonical)
  "rabross dsr",
  "moxclav 625 mg",
  "metrogyl 600 mg",
  "hifenac d",
  "zymoflam d",
  "wynox 300 mg",
  "rexfix 200 mg",
  "ketof-dt",
  "paracetamol 650 mg",
  "paracetamol 500 mg",
  "paracetamol 250 mg",
  "moxclav 375 mg",
  "isolin junior",
  "hifenac th",
  "chymerol forte",
  "ultracet",
  "zilo",
  "sm fibro",
  "doxt-sl",
  "augmentin duo",
  "flexon suspension",
  "dentogel",
  "kenacort gel",
  "gumloc",
  "multident",
  "senquel-ad",
  "chlorhex ads",
  "vantej",
  "hydent pro",
  "stolin r",
  "cheerio gel",
  "oro champ",
  "kidodent",
  "thermoseal proxa ns/ws interdental brushes",
  "colgate slim soft",
]);

/**
 * Helper to check if a medicine name was part of the legacy sample entries
 */
export function isOldMockMedicine(name: string): boolean {
  if (!name) return false;
  const clean = name.trim().toLowerCase();
  // Never exclude any of the canonical 12
  if (CANONICAL_12_NAMES.has(clean)) return false;
  return OLD_MOCK_MEDICINE_NAMES.has(clean);
}

/**
 * Returns category for a known medicine, defaulting to "Tablets / Capsules"
 */
export function getCategoryForMedicine(name: string, fallbackCategory?: string): MedicineCategory {
  if (fallbackCategory && (MEDICINE_CATEGORIES as readonly string[]).includes(fallbackCategory)) {
    return fallbackCategory as MedicineCategory;
  }
  const clean = name.trim().toLowerCase();
  const match = INITIAL_MEDICINES_CATALOGUE.find((m) => m.name.toLowerCase() === clean);
  return match ? match.category : "Tablets / Capsules";
}

/**
 * Returns formulation/description for a canonical medicine if known
 */
export function getFormulationForMedicine(name: string): string | undefined {
  const clean = name.trim().toLowerCase();
  const match = INITIAL_MEDICINES_CATALOGUE.find((m) => m.name.toLowerCase() === clean);
  return match?.formulation;
}
