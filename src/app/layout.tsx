import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard Área Comercial",
  description: "Dashboard Área Comercial de Insecap (datos de ejemplo)",
};

// Todo el dashboard lee datos en vivo de la API: no hay nada que prerenderizar,
// y una página estática mostraría el snapshot de la hora del build en vez del de
// la corrida actual. Declarado en el layout para que aplique a todas las rutas.
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
