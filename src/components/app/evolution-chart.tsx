"use client";

import { useId, useMemo, useState } from "react";
import type { EvolutionSeries } from "@/lib/patient-dashboard-data";

type Range = "1M" | "3M" | "6M" | "1A";
const RANGES: { id: Range; points: number }[] = [
  { id: "1M", points: 2 },
  { id: "3M", points: 3 },
  { id: "6M", points: 6 },
  { id: "1A", points: 6 }, // we only hold 6 months of mock data
];

const W = 640;
const H = 240;
const PAD = { top: 16, right: 12, bottom: 28, left: 12 };

/** Catmull-Rom → cubic-bezier smoothing for a list of [x,y] points. */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export default function EvolutionChart({
  series,
  months,
}: {
  series: EvolutionSeries[];
  months: string[];
}) {
  const [range, setRange] = useState<Range>("6M");
  const gid = useId().replace(/:/g, "");

  const take = RANGES.find((r) => r.id === range)!.points;

  const { paths, dots, xLabels } = useMemo(() => {
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const sliced = series.map((s) => ({
      ...s,
      data: s.data.slice(-take),
    }));
    const xLabels = months.slice(-take);

    const n = xLabels.length;
    const xAt = (i: number) =>
      PAD.left + (n === 1 ? innerW / 2 : (innerW * i) / (n - 1));

    const paths = sliced.map((s) => {
      const values = s.data.map((d) => d.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const span = max - min || 1;
      // leave headroom so curves don't kiss the edges
      const yAt = (v: number) =>
        PAD.top + innerH - ((v - min) / span) * (innerH * 0.82) - innerH * 0.09;
      const pts = s.data.map((d, i) => [xAt(i), yAt(d.value)] as [number, number]);
      const line = smoothPath(pts);
      const area = `${line} L ${pts[pts.length - 1][0]},${PAD.top + innerH} L ${pts[0][0]},${PAD.top + innerH} Z`;
      return { id: s.id, color: s.color, line, area, pts };
    });

    const dots = paths.map((p) => ({
      id: p.id,
      color: p.color,
      x: p.pts[p.pts.length - 1][0],
      y: p.pts[p.pts.length - 1][1],
    }));

    return { paths, dots, xLabels };
  }, [series, months, take]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">Evolución metabólica</h3>
          <p className="text-sm text-muted">Peso vs. % grasa en los últimos 6 meses</p>
        </div>
        <div
          className="flex rounded-xl border border-line bg-surface-tint p-0.5"
          role="tablist"
          aria-label="Rango de tiempo"
        >
          {RANGES.map((r) => {
            const active = r.id === range;
            return (
              <button
                key={r.id}
                role="tab"
                aria-selected={active}
                onClick={() => setRange(r.id)}
                className={
                  "rounded-lg px-3 py-1 text-xs font-semibold transition-colors " +
                  (active
                    ? "bg-surface text-brand-ink shadow-[0_1px_2px_rgba(11,42,58,0.08)]"
                    : "text-muted hover:text-ink")
                }
              >
                {r.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5">
        {series.map((s) => (
          <span key={s.id} className="flex items-center gap-2 text-xs font-medium text-muted">
            <span className="h-1.5 w-4 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 w-full"
        role="img"
        aria-label="Gráfico de evolución de peso y porcentaje de grasa corporal"
      >
        <defs>
          {paths.map((p) => (
            <linearGradient key={p.id} id={`${gid}-${p.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={p.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Horizontal guide lines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + (H - PAD.top - PAD.bottom) * t}
            y2={PAD.top + (H - PAD.top - PAD.bottom) * t}
            stroke="var(--surface-line)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        ))}

        {paths.map((p) => (
          <g key={p.id}>
            <path d={p.area} fill={`url(#${gid}-${p.id})`} />
            <path
              d={p.line}
              fill="none"
              stroke={p.color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Glowing latest-value points */}
        {dots.map((d) => (
          <g key={d.id}>
            <circle cx={d.x} cy={d.y} r="7" fill={d.color} opacity="0.18" />
            <circle cx={d.x} cy={d.y} r="3.5" fill={d.color} stroke="var(--surface-1)" strokeWidth="2" />
          </g>
        ))}

        {/* X axis labels */}
        {xLabels.map((m, i) => {
          const innerW = W - PAD.left - PAD.right;
          const x =
            PAD.left + (xLabels.length === 1 ? innerW / 2 : (innerW * i) / (xLabels.length - 1));
          return (
            <text
              key={m}
              x={x}
              y={H - 8}
              textAnchor="middle"
              fontSize="12"
              fill="var(--surface-muted)"
            >
              {m}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
