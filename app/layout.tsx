import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import CookieBanner from "@/components/CookieBanner";

export const metadata = {
  title: "Micul Meu Erou",
  description: "Micul tău erou, în fișe, carte și povești animate"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      <body>
        <ToastProvider />
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
