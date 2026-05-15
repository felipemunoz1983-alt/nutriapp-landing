import { ClipboardList, Cpu, Repeat } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: ClipboardList,
    title: 'Evaluación clínica completa',
    body: 'Capturamos antropometría, composición corporal, objetivos, entrenamiento, rutina, preferencias y — crucial — tu bloque digestivo: SIBO, intolerancias, síntomas y sus horarios. Si falta info, no generamos plan.',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'Plan personalizado de verdad',
    body: 'NutriApp Pro calcula tu GET (Mifflin-St Jeor o Cunningham si tienes InBody), distribuye macros según objetivo y ajusta el timing peri-entreno. Solo los tiempos de comida que aplican a tu rutina real — sin forzar 6 comidas si pediste 4.',
  },
  {
    num: '03',
    icon: Repeat,
    title: 'Seguimiento clínico que sostiene la adherencia',
    body: 'Registras por comida, hambre y ansiedad. El score se calcula automáticamente, el profesional recibe alertas si algo se sale de banda, y ajustamos sin culpa: la app sugiere, tu nutricionista decide.',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-[var(--surface-0)]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-cyan-dark)] mb-3">
            Cómo funciona
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--surface-ink)] tracking-tight">
            De la evaluación al plan al ajuste — en un solo flujo clínico.
          </h2>
        </div>

        <ol className="grid gap-8 md:grid-cols-3 relative">
          {STEPS.map(({ num, icon: Icon, title, body }) => (
            <li
              key={num}
              className="relative rounded-2xl p-7 bg-white border border-[var(--surface-line)]"
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: 'var(--brand-cyan)' }}
                >
                  {num}
                </span>
                <span
                  className="grid place-items-center w-10 h-10 rounded-lg"
                  style={{
                    background: 'var(--brand-cyan-dark)',
                    color: 'white',
                  }}
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5" strokeWidth={2.25} />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--surface-ink)]">
                {title}
              </h3>
              <p className="text-[var(--surface-muted)] leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
