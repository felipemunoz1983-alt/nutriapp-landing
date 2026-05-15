import { Check, X } from 'lucide-react';

const ROWS = [
  {
    them: 'Peso semanal como métrica principal',
    us: 'Evolución de composición corporal (MM, MG, agua) + adherencia ponderada + síntomas digestivos',
  },
  {
    them: '“Baja 5 kg en 8 semanas” como promesa',
    us: 'Rangos esperables, tendencias y probabilidades — la app sugiere, el profesional decide',
  },
  {
    them: 'Suplementos sugeridos por algoritmo opaco',
    us: '4 preguntas clínicas obligatorias + tabla de contraindicaciones antes de cualquier candidato',
  },
  {
    them: 'Notificaciones culpabilizadoras (“no registraste tu comida”)',
    us: 'Mensajes calibrados para sostener adherencia, no para presionar',
  },
  {
    them: 'Plan estándar con macros ajustados al objetivo',
    us: 'Solo los tiempos de tu rutina real (desayuno, almuerzo, cena ± colaciones ± peri-entreno)',
  },
  {
    them: 'Export Excel sin marca',
    us: 'Reportes PDF/PPTX con branding Centro Metabólico, versión paciente y versión profesional',
  },
];

export default function Differentiators() {
  return (
    <section id="diferencia" className="py-24 px-6 bg-[var(--surface-1)]">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-cyan-dark)] mb-3">
            App de calorías vs. herramienta clínica
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--surface-ink)] tracking-tight">
            Donde una app de calorías se detiene, una herramienta clínica recién
            empieza.
          </h2>
          <p className="mt-4 text-lg text-[var(--surface-muted)] leading-relaxed">
            Lo que ves abajo no son matices de marketing: son decisiones de
            producto que tu paciente — y tú, en consulta — notan en la sesión 2.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6">
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 rounded-2xl overflow-hidden border border-[var(--surface-line)] bg-white"
            >
              <div className="flex items-start gap-3 p-5 md:p-6 bg-[#FAFBFC] border-b md:border-b-0 md:border-r border-[var(--surface-line)]">
                <X
                  className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--surface-muted)] mb-1">
                    Otras apps
                  </p>
                  <p className="text-[var(--surface-ink)]">{row.them}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-5 md:p-6">
                <Check
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--brand-mint-dark)' }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--brand-cyan-dark)' }}>
                    NutriApp Pro
                  </p>
                  <p className="text-[var(--surface-ink)] font-medium">{row.us}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
