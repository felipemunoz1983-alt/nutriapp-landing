// ─────────────────────────────────────────────────────────────
// NutriApp Pro — Patient Dashboard mock data
//
// First screen of the patient-facing app (Centro Metabólico).
// All values here are placeholder/mock. When the API lands, replace
// `getPatientDashboard()` with a real fetch — the component tree
// already consumes this shape via props, so nothing else changes.
//
// Domain choices follow the product's clinical rules (see the
// marketing FeatureGrid): composición corporal over weight-only,
// adherencia PONDERADA (not averaged), GET via Mifflin/Cunningham.
// ─────────────────────────────────────────────────────────────

export type Trend = "up" | "down" | "flat";

export type Metric = {
  /** Short uppercase label, e.g. "Peso actual" */
  label: string;
  value: string;
  unit: string;
  /** Human-readable change vs previous measurement, e.g. "-1.2 kg" */
  delta: string;
  trend: Trend;
  /** Whether a downward trend is the desirable outcome (e.g. body fat). */
  goodWhen: Trend;
  /** Tiny sparkline series (most recent last). */
  spark: number[];
};

export type SeriesPoint = { month: string; value: number };

export type EvolutionSeries = {
  id: string;
  label: string;
  unit: string;
  /** CSS color token reference, e.g. "var(--brand-cyan)". */
  color: string;
  data: SeriesPoint[];
};

export type Appointment = {
  professional: string;
  role: string;
  avatar: string;
  dateLabel: string;
  timeLabel: string;
  type: string;
};

export type CompositionRow = {
  label: string;
  amount: string;
  percent: number;
  /** CSS color token reference for the bar fill. */
  color: string;
};

export type AdherenceDay = {
  /** Single-letter day initial (L M X J V S D). */
  initial: string;
  /** undefined = future/not-yet, otherwise the weighted state. */
  state?: "done" | "partial" | "missed";
};

export type PatientDashboard = {
  patient: { name: string; firstName: string; id: string; avatar: string };
  todayLabel: string;
  metrics: Metric[];
  evolution: EvolutionSeries[];
  evolutionMonths: string[];
  appointment: Appointment;
  composition: CompositionRow[];
  compositionNote: string;
  adherence: {
    /** Weighted adherence score 0–100 (NOT a simple average). */
    score: number;
    period: string;
    week: AdherenceDay[];
  };
};

// Avatars come from Stitch's generated asset CDN (stable URLs).
const DOCTOR_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1D9RDFEJMddj3c2VHh1fiiFIyBBFf53Cdf5n2ABhA09YmMyO042fRXbhpBqikJwmhxMtzB63Ps8jZnKy08rIvcGcXCZWLt_9I9xZLWCMwf74BX2wVuVf3m7iYTSOdbQzvOozzQoeIkt3gG942QVbamQVpsJ5ocv3-waJKlUEVwCtnsgSFvv8ytJCE0hpKDCoTW6bWuz8hafmhLvAQvQ4VkVcldqWJ-V9t1p2yPl7gVhrctHwo0cZRVPI9jH0-k2QzjB-TdjcAoaU";
const PATIENT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDgnI4ol9ZM0AxeTCy625VKlmV2s3v7VENcIyRz6RmYObnVeXehYMx_4Z4KOBf5hFmBenkP5MLyEvJ1pn11JSK3t6CEldrVuY4MXHSDG0KMimRa2Il2I3nJ7TH4hSFj1OGyD8DVspfIBQc4mkLNn8GxEPlTgcaGCMb_YXS-jrMmf2M_ewkS8Rb2g21plDny_TNIRD_mAdWloUju62fF1izyBmAaatVYRSS2FCjoRREJsY3IG4fP3fnDVdjaRIKOYkXGqFnNW4Oy9kA";

const MOCK: PatientDashboard = {
  patient: {
    name: "Adrián Benítez",
    firstName: "Adrián",
    id: "MET-8842",
    avatar: PATIENT_AVATAR,
  },
  todayLabel: "Jueves, 24 de octubre de 2024",
  metrics: [
    {
      label: "Peso actual",
      value: "78,4",
      unit: "kg",
      delta: "-1,2 kg",
      trend: "down",
      goodWhen: "down",
      spark: [82, 81.2, 80.6, 80, 79.1, 78.4],
    },
    {
      label: "% Grasa corporal",
      value: "22,1",
      unit: "%",
      delta: "-0,8 pts",
      trend: "down",
      goodWhen: "down",
      spark: [24, 23.6, 23.1, 22.8, 22.4, 22.1],
    },
    {
      label: "Masa muscular",
      value: "34,8",
      unit: "kg",
      delta: "+0,4 kg",
      trend: "up",
      goodWhen: "up",
      spark: [34, 34.1, 34.3, 34.4, 34.6, 34.8],
    },
    {
      label: "GET estimado",
      value: "1.690",
      unit: "kcal",
      delta: "Cunningham (InBody)",
      trend: "flat",
      goodWhen: "flat",
      spark: [1700, 1695, 1692, 1690, 1690, 1690],
    },
  ],
  evolutionMonths: ["May", "Jun", "Jul", "Ago", "Sep", "Oct"],
  evolution: [
    {
      id: "weight",
      label: "Peso",
      unit: "kg",
      color: "var(--brand-cyan)",
      data: [
        { month: "May", value: 82 },
        { month: "Jun", value: 81.2 },
        { month: "Jul", value: 80.6 },
        { month: "Ago", value: 80 },
        { month: "Sep", value: 79.1 },
        { month: "Oct", value: 78.4 },
      ],
    },
    {
      id: "fat",
      label: "% Grasa",
      unit: "%",
      color: "var(--brand-mint)",
      data: [
        { month: "May", value: 24 },
        { month: "Jun", value: 23.6 },
        { month: "Jul", value: 23.1 },
        { month: "Ago", value: 22.8 },
        { month: "Sep", value: 22.4 },
        { month: "Oct", value: 22.1 },
      ],
    },
  ],
  appointment: {
    professional: "Dra. Elena Varela",
    role: "Médico deportólogo",
    avatar: DOCTOR_AVATAR,
    dateLabel: "30 de octubre, 2024",
    timeLabel: "16:30 – 17:15",
    type: "Bioimpedancia · control InBody",
  },
  composition: [
    { label: "Masa magra", amount: "60,2 kg", percent: 76.8, color: "var(--brand-cyan)" },
    { label: "Masa grasa", amount: "17,3 kg", percent: 22.1, color: "var(--brand-mint)" },
    { label: "Agua corporal total", amount: "44,1 L", percent: 56.2, color: "var(--brand-cyan-ink)" },
  ],
  compositionNote:
    "Tu nivel de hidratación está dentro del rango óptimo para el entrenamiento de alta intensidad programado esta semana.",
  adherence: {
    score: 86,
    period: "Esta semana · ponderada por comida",
    week: [
      { initial: "L", state: "done" },
      { initial: "M", state: "done" },
      { initial: "X", state: "done" },
      { initial: "J", state: "partial" },
      { initial: "V" },
      { initial: "S" },
      { initial: "D" },
    ],
  },
};

/**
 * Returns the dashboard data for the signed-in patient.
 * TODO: replace the mock with a real API call once the backend exists.
 */
export function getPatientDashboard(): PatientDashboard {
  return MOCK;
}
