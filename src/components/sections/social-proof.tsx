import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'Por primera vez una app me preguntó por mi hinchazón antes de pasarme un plan. Llevo tres meses usándola y dejé de pelearme con la comida.',
    name: 'Camila R.',
    role: 'Usuaria · plan de recomposición',
  },
  {
    quote:
      'Lo que más uso es el registro por comida con el ajuste por hambre y ansiedad. En la app veo en un gráfico lo que antes me tomaba media hora reconstruir.',
    name: 'Dra. Paulina M.',
    role: 'Nutricionista · usuaria profesional',
  },
  {
    quote:
      'Antes de sugerirme cualquier suplemento, la app me preguntó por mis medicamentos. Esa pausa de 30 segundos me dio confianza para usarla en serio.',
    name: 'Felipe O.',
    role: 'Usuario · objetivo rendimiento deportivo',
  },
];

export default function SocialProof() {
  return (
    <section id="testimonios" className="py-24 px-6 bg-[var(--surface-0)]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-cyan-dark)] mb-3">
            Voces de quienes la usan
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--surface-ink)] tracking-tight">
            Lo que dicen pacientes y profesionales que ya están dentro.
          </h2>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li
              key={t.name}
              className="rounded-2xl bg-white p-7 border border-[var(--surface-line)] flex flex-col"
            >
              <Quote
                className="w-7 h-7 mb-4"
                style={{ color: 'var(--brand-cyan)' }}
                aria-hidden="true"
              />
              <p className="text-[var(--surface-ink)] leading-relaxed mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-[var(--surface-ink)]">{t.name}</p>
                <p className="text-sm text-[var(--surface-muted)]">{t.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
