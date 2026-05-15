import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://nutriapp.centrometabolico.cl"),
  openGraph: {
    title: "NutriApp Pro — Nutrición que respeta tu digestión",
    description:
      "Planes nutricionales personalizados con seguimiento clínico real. Por Centro Metabólico.",
    type: "website",
    locale: "es_CL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${inter.variable} ${archivoBlack.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--surface-0)] text-[var(--surface-ink)]">
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
