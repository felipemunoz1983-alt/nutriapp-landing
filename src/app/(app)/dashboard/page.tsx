import type { Metadata } from "next";
import PatientDashboard from "@/components/app/patient-dashboard";

export const metadata: Metadata = {
  title: "Dashboard del paciente · NutriApp Pro",
  description:
    "Panel clínico del paciente: peso, composición corporal, evolución metabólica, próxima cita y adherencia ponderada al plan.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <PatientDashboard />;
}
