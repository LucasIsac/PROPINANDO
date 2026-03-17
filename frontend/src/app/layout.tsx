import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROPINANDO - Gestión de Propinas Digitales",
  description: "Sistema profesional de gestión de propinas digitales con split payment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
