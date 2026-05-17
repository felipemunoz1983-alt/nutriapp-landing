import { Activity, Mail } from 'lucide-react';
import TrackedAppLink from '@/components/tracked-app-link';

// Inline Instagram glyph — lucide-react removed brand icons for trademark
// reasons. Meta's brand guidelines permit using the official mark for linking.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--surface-line)] bg-[var(--surface-1)]">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold text-[var(--surface-ink)] mb-3">
            <span
              className="grid place-items-center w-8 h-8 rounded-lg text-white"
              style={{ background: 'var(--brand-cyan)' }}
              aria-hidden="true"
            >
              <Activity className="w-4 h-4" />
            </span>
            <span className="tracking-tight">
              NutriApp <span className="text-[var(--brand-cyan-dark)]">Pro</span>
            </span>
          </div>
          <p className="text-[var(--surface-muted)] max-w-sm leading-relaxed">
            Nutrición clínica deportiva personalizada. Una herramienta del equipo
            de Centro Metabólico para sostener adherencia real entre consultas.
          </p>
        </div>

        <div>
          <p className="font-semibold text-[var(--surface-ink)] mb-3">Producto</p>
          <ul className="space-y-2 text-[var(--surface-muted)]">
            <li><a href="#features" className="hover:text-[var(--brand-cyan-dark)] transition-colors">Funcionalidades</a></li>
            <li><a href="#como-funciona" className="hover:text-[var(--brand-cyan-dark)] transition-colors">Cómo funciona</a></li>
            <li><a href="#diferencia" className="hover:text-[var(--brand-cyan-dark)] transition-colors">Por qué es distinta</a></li>
            <li><a href="#testimonios" className="hover:text-[var(--brand-cyan-dark)] transition-colors">Testimonios</a></li>
            <li>
              <TrackedAppLink
                location="footer"
                className="hover:text-[var(--brand-cyan-dark)] transition-colors"
              >
                Acceder a la app ↗
              </TrackedAppLink>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-[var(--surface-ink)] mb-3">Contacto</p>
          <ul className="space-y-2 text-[var(--surface-muted)]">
            <li>
              <a
                href="mailto:contacto@centrometabolico.cl"
                className="inline-flex items-center gap-2 hover:text-[var(--brand-cyan-dark)] transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                contacto@centrometabolico.cl
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/centrometabolico"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[var(--brand-cyan-dark)] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
                @centrometabolico
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--surface-line)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[var(--surface-muted)]">
          <p>
            © {new Date().getFullYear()} Centro Metabólico · NutriApp Pro
          </p>
          <p>
            La app no entrega diagnósticos. Complementa el trabajo con tu profesional de salud.
          </p>
        </div>
      </div>
    </footer>
  );
}
