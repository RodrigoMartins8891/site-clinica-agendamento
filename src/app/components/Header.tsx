"use client";

export function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="text-slate-500 font-medium">Portal do Paciente</div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">Olá, Paciente</p>
          <p className="text-xs text-green-500">Online</p>
        </div>
        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
      </div>
    </header>
  );
}