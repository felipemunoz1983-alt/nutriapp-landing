import type { AdherenceDay } from "@/lib/patient-dashboard-data";

const STATE_STYLE: Record<NonNullable<AdherenceDay["state"]>, string> = {
  done: "bg-brand text-white",
  partial: "bg-mint text-white",
  missed: "bg-[var(--surface-line)] text-muted",
};

export default function AdherenceRing({
  score,
  period,
  week,
}: {
  score: number;
  period: string;
  week: AdherenceDay[];
}) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const dash = (score / 100) * C;

  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">Adherencia al plan</h3>
      <p className="text-sm text-muted">{period}</p>

      <div className="mt-6 flex justify-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              stroke="var(--surface-2)"
              strokeWidth="12"
            />
            <circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              stroke="var(--brand-cyan)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-ink">{score}%</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Ponderada
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">
        Registro diario
      </p>
      <div className="mt-2 flex items-center justify-between">
        {week.map((d, i) => (
          <div key={`${d.initial}-${i}`} className="flex flex-col items-center gap-1.5">
            <span
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold " +
                (d.state ? STATE_STYLE[d.state] : "border border-dashed border-line text-muted/60")
              }
            >
              {d.state === "partial" ? "½" : d.state === "done" ? "✓" : ""}
            </span>
            <span className="text-[11px] font-medium text-muted">{d.initial}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
