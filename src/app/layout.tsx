import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Importando seus componentes (verifique se os caminhos estão corretos)
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AIAssistant } from "./components/AIAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dr. Agenda - Gestão Médica",
  description: "Sistema inteligente de agendamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100`}>
        
        <div className="flex h-screen overflow-hidden">
          {/* 1. Sidebar sempre visível à esquerda */}
          <Sidebar />

          <div className="flex flex-col flex-1">
            {/* 2. Header no topo */}
            <Header />

            {/* 3. Onde as páginas (Dashboard, Site, etc) aparecem */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>

        {/* 4. Assistente de IA flutuando sobre tudo */}
        <AIAssistant />

      </body>
    </html>
  );
}