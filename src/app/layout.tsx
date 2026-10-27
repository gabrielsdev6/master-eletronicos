import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: {
    default: "Órbita Celulares | iPhone novo e seminovo",
    template: "%s | Órbita Celulares",
  },
  description:
    "iPhone novo e seminovo. Veja os modelos, preços e fale com a loja pelo WhatsApp.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0d1330",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
