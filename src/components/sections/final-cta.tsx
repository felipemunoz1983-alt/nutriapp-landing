import { ArrowRight, ListChecks } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section id="cta" className="py-24 px-6">
      <div
        className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
        style={{
          background:
            'linear-gradient(135deg, var(--brand-cyan-dark) 0%, var(--brand-cyan) 100%)',
        }}
      >
        <div className="relative px-8 py-16 md:px-16 md:py-20 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/80">
            Empieza ahora
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
            Tu plan personalizado, a un clic.
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/90 leading-relaxed">
            Inicia sesión en NutriApp Pro y arranca con tu evaluación, tu plan
            nutricional y tu seguimiento de adherencia — sin esperas y desde
            cualquier dispositivo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://centro-metabolico-pro.vercel.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold bg-white text-[var(--brand-cyan-dark)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer shadow-lg"
            >
              Acceder a la app
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold border-2 border-white/70 text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ListChecks className="w-5 h-5" aria-hidden="true" />
              Conocer las funciones
            </a>
          </div>

          <p className="mt-8 text-sm text-white/70">
            La app complementa el trabajo con tu profesional de salud. No
            reemplaza la consulta clínica.
          </p>
        </div>
      </div>
    </section>
  );
}
