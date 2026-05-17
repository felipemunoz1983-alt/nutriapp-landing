import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = "https://nutriapp-landing.vercel.app";
const APP_URL = "https://centro-metabolico-pro.vercel.app";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriApp Pro — Nutrición clínica deportiva personalizada | Centro Metabólico",
  description:
    "La app clínico-deportiva que ajusta tu plan a tu sistema digestivo, tu entrenamiento y tu adherencia real. Por el equipo de Centro Metabólico.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "NutriApp Pro — Nutrición que respeta tu digestión",
    description:
      "Planes nutricionales personalizados con seguimiento clínico real. Por Centro Metabólico.",
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: "NutriApp Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriApp Pro — Nutrición que respeta tu digestión",
    description:
      "Planes nutricionales personalizados con seguimiento clínico real. Por Centro Metabólico.",
  },
};

// JSON-LD structured data — Organization + WebSite + SoftwareApplication.
// Helps search engines render rich results and helps social platforms parse
// the link reliably.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Centro Metabólico",
      url: "https://centrometabolico.cl",
      sameAs: ["https://instagram.com/centrometabolico"],
      description:
        "Equipo nutricional clínico con foco metabólico y deportivo. Creadores de NutriApp Pro.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "NutriApp Pro",
      inLanguage: "es-CL",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "NutriApp Pro",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      url: APP_URL,
      inLanguage: "es-CL",
      offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
      description:
        "App clínico-deportiva para diseñar planes nutricionales personalizados con seguimiento de adherencia, ajuste por sistema digestivo y suplementación segura.",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${inter.variable} ${archivoBlack.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--surface-0)] text-[var(--surface-ink)]">
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
