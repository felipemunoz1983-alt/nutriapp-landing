import Image from "next/image";
import {
  LayoutDashboard,
  Activity,
  Utensils,
  CalendarDays,
  TrendingUp,
  MessageSquare,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Clock,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import {
  getPatientDashboard,
  type Metric,
  type CompositionRow,
  type Appointment,
} from "@/lib/patient-dashboard-data";
import EvolutionChart from "@/components/app/evolution-chart";
import AdherenceRing from "@/components/app/adherence-ring";

const NAV: { icon: LucideIcon; label: string; active?: boolean }[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Activity, label: "Análisis InBody" },
  { icon: Utensils, label: "Plan nutricional" },
  { icon: CalendarDays, label: "Citas" },
  { icon: TrendingUp, label: "Progreso" },
  { icon: MessageSquare, label: "Mensajes" },
  { icon: Settings, label: "Configuración" },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 88;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (w * i) / (data.length - 1);
      const y = h - ((v - min) / span) * (h - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-[88px]" aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendChip({ metric }: { metric: Metric }) {
  if (metric.trend === "flat") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-surface-tint px-2 py-0.5 text-xs font-semibold text-muted">
        <Minus className="h-3 w-3" />
        {metric.delta}
      </span>
    );
  }
  const good = metric.trend === metric.goodWhen;
  const Icon = metric.trend === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold " +
        (good ? "bg-mint/15 text-mint-dark" : "bg-[var(--error,#fde8e8)] text-[#b42318]")
      }
    >
      <Icon className="h-3 w-3" />
      {metric.delta}
    </span>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const sparkColor = metric.trend === "up" ? "var(--brand-mint)" : "var(--brand-cyan)";
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,42,58,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {metric.label}
      </p>
      <div className="mt-2 flex items-end gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-ink">{metric.value}</span>
        <span className="pb-0.5 text-sm font-medium text-muted">{metric.unit}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <TrendChip metric={metric} />
        <Sparkline data={metric.spark} color={sparkColor} />
      </div>
    </div>
  );
}

function NextAppointment({ appt }: { appt: Appointment }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(11,42,58,0.04)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">Próxima cita</h3>
        <CalendarDays className="h-5 w-5 text-brand" />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Image
          src={appt.avatar}
          alt={appt.professional}
          width={48}
          height={48}
          unoptimized
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-ink">{appt.professional}</p>
          <p className="text-sm text-muted">{appt.role}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex items-center gap-2.5 text-ink">
          <CalendarDays className="h-4 w-4 text-muted" />
          <span>{appt.dateLabel}</span>
        </div>
        <div className="flex items-center gap-2.5 text-ink">
          <Clock className="h-4 w-4 text-muted" />
          <span>{appt.timeLabel}</span>
        </div>
        <div className="flex items-center gap-2.5 text-ink">
          <Stethoscope className="h-4 w-4 text-muted" />
          <span>{appt.type}</span>
        </div>
      </dl>

      <div className="mt-6 space-y-2">
        <button className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          Confirmar asistencia
        </button>
        <button className="w-full rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-surface-tint">
          Reprogramar
        </button>
      </div>
    </div>
  );
}

function BodyComposition({
  rows,
  note,
}: {
  rows: CompositionRow[];
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(11,42,58,0.04)]">
      <h3 className="text-lg font-semibold text-ink">Composición corporal</h3>
      <div className="mt-5 space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm font-medium text-ink">{row.label}</span>
              <span className="text-sm text-muted">
                {row.amount}{" "}
                <span className="font-semibold text-ink">{row.percent}%</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-tint">
              <div
                className="h-full rounded-full"
                style={{ width: `${row.percent}%`, background: row.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-xl bg-surface-tint px-4 py-3 text-sm leading-relaxed text-brand-ink">
        {note}
      </p>
    </div>
  );
}

export default function PatientDashboard() {
  const d = getPatientDashboard();

  return (
    <div className="flex min-h-screen bg-background text-ink">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            CM
          </span>
          <div className="leading-tight">
            <p className="font-bold text-ink">NutriApp Pro</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">
              Centro Metabólico
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2">
          <ul className="space-y-1">
            {NAV.map(({ icon: Icon, label, active }) => (
              <li key={label}>
                <a
                  href="#"
                  aria-current={active ? "page" : undefined}
                  className={
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " +
                    (active
                      ? "bg-surface-tint text-brand-ink"
                      : "text-muted hover:bg-surface-tint hover:text-ink")
                  }
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 border-t border-line px-6 py-4">
          <Image
            src={d.patient.avatar}
            alt={d.patient.name}
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">{d.patient.name}</p>
            <p className="text-[11px] text-muted">ID #{d.patient.id}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-line bg-surface/80 px-5 py-4 backdrop-blur-md sm:px-8">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-brand-ink">
              Hola, {d.patient.firstName}
            </p>
            <p className="truncate text-sm text-muted">{d.todayLabel}</p>
          </div>
          <div className="ml-auto hidden items-center md:flex">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-background px-3 py-2">
              <Search className="h-4 w-4 text-muted" />
              <input
                type="search"
                placeholder="Buscar métricas…"
                aria-label="Buscar métricas"
                className="w-44 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
              />
            </div>
          </div>
          <button
            aria-label="Notificaciones"
            className="relative rounded-xl border border-line bg-surface p-2.5 text-muted hover:text-ink"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-mint" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Agendar control</span>
          </button>
        </header>

        {/* Content */}
        <main id="main" className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-6 sm:px-8">
          {/* KPI row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {d.metrics.map((m) => (
              <MetricCard key={m.label} metric={m} />
            ))}
          </div>

          {/* Chart + appointment */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(11,42,58,0.04)] lg:col-span-2">
              <EvolutionChart series={d.evolution} months={d.evolutionMonths} />
            </div>
            <NextAppointment appt={d.appointment} />
          </div>

          {/* Composition + adherence */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BodyComposition rows={d.composition} note={d.compositionNote} />
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(11,42,58,0.04)]">
              <AdherenceRing
                score={d.adherence.score}
                period={d.adherence.period}
                week={d.adherence.week}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
