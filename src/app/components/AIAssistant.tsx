"use client";
import { useState } from "react";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mensagens, setMensagens] = useState([{ role: 'bot', text: 'Olá! Sou o assistente da clínica. Em que posso ajudar?' }]);

  const enviar = async () => {
    if(!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMensagens(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/perguntar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: input }),
      });
      const data = await res.json();
      setMensagens(prev => [...prev, { role: 'bot', text: data.resposta }]);
    } catch {
      setMensagens(prev => [...prev, { role: 'bot', text: "Ligue o servidor Python na porta 8000!" }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 bg-white shadow-2xl rounded-3xl border border-slate-100 overflow-hidden flex flex-col">
          <div className="bg-indigo-600 p-4 text-white font-bold">Assistente Virtual</div>
          <div className="h-64 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-2">
            {mensagens.map((m, i) => (
              <div key={i} className={`p-2 rounded-lg text-sm ${m.role === 'bot' ? 'bg-indigo-100 self-start' : 'bg-indigo-600 text-white self-end'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 text-sm outline-none text-slate-800" placeholder="Perguntar..." />
            <button onClick={enviar} className="text-indigo-600 font-bold">OK</button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-indigo-600 text-white p-4 rounded-full shadow-lg">🤖</button>
    </div>
  );
}