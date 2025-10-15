import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import CookieBanner from "@/components/CookieBanner";

export const metadata = {
  title: "Micul Meu Erou",
  description: "Micul tău erou, în fișe, cărți și povești animate"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      <body className="min-h-screen relative overflow-x-hidden">
        {/* gradient puternic pe fundal */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[70vw] h-[70vw] rounded-full blur-3xl opacity-50"
               style={{background:"radial-gradient(circle at center,#64D8DF 0%, rgba(100,216,223,0.2) 40%, transparent 60%)"}}/>
          <div className="absolute -bottom-40 -right-40 w-[70vw] h-[70vw] rounded-full blur-3xl opacity-50"
               style={{background:"radial-gradient(circle at center,#B58AD7 0%, rgba(181,138,215,0.2) 40%, transparent 60%)"}}/>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-turquoise/35 via-white to-brand-lilac/35" />
        </div>

        <ToastProvider />
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
