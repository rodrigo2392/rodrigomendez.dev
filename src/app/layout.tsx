import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV == "development"
      ? "http://localhost:3000"
      : "https://rodrigomendez.dev"
  ),
  title: "Rodrigo Méndez - Frontend developer",
  description:
    "Rodrigo Méndez desarrollador frontend con 10 años de experiencia",
  keywords:
    "frontend,desarrollador,guadalajara,zapopan,jalisco,backend,fullstack,react,native",
  icons: "favicon.ico",
  twitter: {
    images: ["https://rodrigomendez.dev/banner.png"],
    title: "Rodrigo Méndez - Frontend developer",
    description:
      "Rodrigo Méndez desarrollador frontend con 10 años de experiencia",
    card: "summary",
    site: "https://rodrigomendez.dev",
  },
  assets: ["https://rodrigomendez.dev/banner.png"],
  openGraph: {
    title: "Rodrigo Méndez - Frontend developer",
    description:
      "Rodrigo Méndez desarrollador frontend con 10 años de experiencia",
    images: "https://rodrigomendez.dev/banner.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
