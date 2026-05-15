'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/70 border-b border-[var(--surface-line)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[var(--surface-ink)]"
          aria-label="NutriApp Pro — inicio"
        >
          <span
            className="grid place-items-center w-8 h-8 rounded-lg text-white"
            style={{ background: 'var(--brand-cyan)' }}
          >
            <Activity className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="tracking-tight">
            NutriApp <span className="text-[var(--brand-cyan-dark)]">Pro</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--surface-muted)]">
          <a href="#features" className="hover:text-[var(--brand-cyan-dark)] transition-colors">
            Funcionalidades
          </a>
          <a href="#como-funciona" className="hover:text-[var(--brand-cyan-dark)] transition-colors">
            Cómo funciona
          </a>
          <a href="#diferencia" className="hover:text-[var(--brand-cyan-dark)] transition-colors">
            Por qué es distinta
          </a>
          <a href="#testimonios" className="hover:text-[var(--brand-cyan-dark)] transition-colors">
            Testimonios
          </a>
        </nav>

        <a
          href="https://centro-metabolico-pro.vercel.app/login"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
          style={{ background: 'var(--brand-mint-dark)' }}
        >
          Acceder a la app
        </a>
      </div>
    </header>
  );
}
