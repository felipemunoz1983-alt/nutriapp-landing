import {
  Stethoscope,
  Dumbbell,
  LineChart,
  ShieldCheck,
  MessageCircleHeart,
  FileBarChart,
  type LucideIcon,
} from 'lucide-react';

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    icon: Stethoscope,
    title: 'Bloque digestivo obligatorio',
    body: 'Capturamos SIBO, reflujo, constipación, hinchazón, intolerancias percibidas (lácteos, legumbres, gluten, FODMAPs) y el horario de los síntomas. Sin esos datos, el generador no entrega plan — el patrón que más rompe adherencia temprana son planes que ignoran el eje digestivo.',
  },
  {
    icon: Dumbbell,
    title: 'GET con la fórmula correcta',
    body: 'Mifflin-St Jeor cuando no hay composición corporal medida; Cunningham cuando hay masa libre de grasa por InBody o ISAK reciente. Factores de actividad diferenciados por fuerza, resistencia y mixto, con timing peri-entreno (CHO pre/post) calibrado al horario real de tu entrenamiento.',
  },
  {
    icon: LineChart,
    title: 'Adherencia ponderada, no promediada',
    body: 'Registro por comida con cuatro estados (realizada, parcial, reemplazada saludablemente, no realizada). Las comidas principales pesan más que las colaciones, y el score baja si reportó alta hambre o ansiedad — señal de que el plan no está calibrado, no de que el paciente falló. Alerta automática al profesional bajo 50%.',
  },
  {
    icon: ShieldCheck,
    title: 'Suplementación con 4 preguntas obligatorias',
    body: 'Antes de cualquier sugerencia se capturan: objetivo actual, tipo y carga de entrenamiento, condiciones médicas con medicamentos, y suplementos en uso. La tabla de contraindicaciones bloquea recomendaciones de riesgo. Si hay condición clínica relevante, deriva a evaluación profesional — no sugiere y avisa después.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Comunicación clínica, no moralizante',
    body: 'Banco editable de mensajes diarios por contexto: recordatorio, refuerzo positivo, adherencia baja, ajuste solicitado. Una colación fuera del plan no es "no cumpliste" — es una señal a leer en la próxima sesión.',
  },
  {
    icon: FileBarChart,
    title: 'Reportes que llegan listos a la consulta',
    body: 'Exports PDF y PPTX con branding Centro Metabólico: evaluación, plan vigente, evolución de composición corporal (no solo peso), score de adherencia y próximas acciones. Versión paciente (motivacional) y versión profesional (datos estructurados) en el mismo motor.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 px-6 bg-[var(--surface-1)]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-cyan-dark)] mb-3">
            Construida con criterio clínico, no con métricas de engagement
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--surface-ink)] tracking-tight">
            La diferencia entre &ldquo;app de nutrición&rdquo; y herramienta clínica de consulta.
          </h2>
          <p className="mt-4 text-lg text-[var(--surface-muted)] leading-relaxed">
            Cada funcionalidad responde a un error real que rompe la adherencia
            en otras apps — y a una decisión clínica que tu paciente nota en la
            sesión 2.
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-2xl border border-[var(--surface-line)] bg-white p-6 shadow-[0_1px_2px_rgba(11,42,58,0.04)] hover:shadow-[0_8px_24px_rgba(11,42,58,0.08)] transition-shadow"
            >
              <div
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                style={{
                  background: 'var(--surface-tint)',
                  color: 'var(--brand-cyan-dark)',
                }}
                aria-hidden="true"
              >
                <Icon className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--surface-ink)]">
                {title}
              </h3>
              <p className="text-[var(--surface-muted)] leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
