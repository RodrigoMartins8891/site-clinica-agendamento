"use client";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-6">
      <div className="mb-10">
        <h2 className="text-2xl font-bold italic text-indigo-400">dr.agenda</h2>
      </div>
      <nav className="flex flex-col gap-4">
        <Link href="/" className="hover:bg-slate-800 p-3 rounded-xl transition">Início</Link>
        <Link href="#" className="hover:bg-slate-800 p-3 rounded-xl transition">Meus Agendamentos</Link>
        <Link href="#" className="hover:bg-slate-800 p-3 rounded-xl transition">Perfil</Link>
      </nav>
    </aside>
  );
}