"use client";

import { useState } from "react";
import { loginPaciente, cadastrarPaciente, salvarAgendamento } from "./actions";

export default function Home() {
  // Controle de Interface
  const [etapa, setEtapa] = useState("login");
  const [carregando, setCarregando] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  // Campos dos Formulários
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [planoSaude, setPlanoSaude] = useState("");

  // Campos do Agendamento
  const [medico, setMedico] = useState("1");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  // Estilos Tailwind
  const inputStyle = "w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 bg-slate-50";
  const btnStyle = "w-full font-bold py-5 rounded-[2rem] shadow-xl transition-all active:scale-95 disabled:opacity-50";

  // --- FUNÇÕES DE AÇÃO ---

  async function handleLogin() {
    setCarregando(true);
    const res = await loginPaciente(email, senha);
    setCarregando(false);

    if (res.success) {
      setUsuario(res.user);
      setEtapa("agendar");
    } else {
      alert(res.message || "Erro ao entrar.");
    }
  }

  async function handleRegistro() {
    if (!nome || !email || !senha) return alert("Preencha os campos obrigatórios!");

    setCarregando(true);
    const res = await cadastrarPaciente(nome, email, senha, telefone, dataNascimento, fotoUrl, planoSaude);
    setCarregando(false);

    if (res.success) {
      alert("Cadastro realizado!");
      setEtapa("login");
    } else {
      alert(res.message);
    }
  }

  async function handleAgendar() {
    if (!data || !hora) return alert("Escolha data e hora!");

    setCarregando(true);

    // Define o valor da consulta baseado no ID do médico
    let valorConsulta = 0;
    if (medico === "1") valorConsulta = 250.00; // Dra. Ana Souza
    if (medico === "3") valorConsulta = 150.00; // Dr. Rodrigo Martins

    const res = await salvarAgendamento(
      usuario.id_paciente,
      Number(medico),
      data,
      hora,
      valorConsulta
    );

    setCarregando(false);

    if (res.success) {
      setEtapa("sucesso");
    } else {
      alert(res.message);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCarregando(true); // Começa a carregar
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/djklvz7f7/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        setFotoUrl(data.secure_url);
        // Removi o alert para não travar a tela
      }
    } catch (error) {
      console.error("Erro no upload", error);
    } finally {
      setCarregando(false); 
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-50">

        {/* CABEÇALHO DINÂMICO */}
        {etapa !== "sucesso" && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight">
              {etapa === "login" && "Bem-vindo de volta"}
              {etapa === "registro" && "Criar sua conta"}
              {etapa === "agendar" && `Olá, ${usuario?.nome?.split(' ')[0]}`}
            </h1>
            <p className="text-slate-500 mt-2">
              {etapa === "agendar" ? "Escolha um horário para sua consulta" : "Portal do Paciente dr.agenda"}
            </p>
          </div>
        )}

        {/* ETAPA: LOGIN */}
        {etapa === "login" && (
          <div className="space-y-4">
            <input type="email" placeholder="E-mail" className={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Senha" className={inputStyle} value={senha} onChange={e => setSenha(e.target.value)} />
            <button onClick={handleLogin} disabled={carregando} className={`${btnStyle} bg-indigo-600 text-white hover:bg-indigo-700`}>
              {carregando ? "ACESSANDO..." : "ACESSAR CONTA"}
            </button>
            <p className="text-center text-sm text-slate-500">
              Novo por aqui? <button onClick={() => setEtapa("registro")} className="text-indigo-600 font-bold hover:underline">Criar conta</button>
            </p>
          </div>
        )}

        {/* ETAPA: REGISTRO */}
        {etapa === "registro" && (
          <div className="space-y-4 overflow-y-auto max-h-[70vh] px-2">
            <input type="text" placeholder="Nome completo" className={inputStyle} value={nome} onChange={e => setNome(e.target.value)} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Nascimento</label>
                <input type="date" className={inputStyle} value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Telefone</label>
                <input type="tel" placeholder="(00) 00000-0000" className={inputStyle} value={telefone} onChange={e => setTelefone(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Foto de Perfil</label>
              <input
                type="file"
                accept="image/*"
                className={inputStyle}
                onChange={handleUpload} // Chama a função de upload
                disabled={carregando}
              />
            </div>
            {fotoUrl && (
              <div className="mt-2 flex flex-col items-center">
                <img
                  src={fotoUrl}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
                />
                <p className="text-[10px] text-green-500 font-bold">Upload concluído!</p>
              </div>
            )}
            <input type="text" placeholder="Plano de Saúde" className={inputStyle} value={planoSaude} onChange={e => setPlanoSaude(e.target.value)} />
            <input type="email" placeholder="E-mail" className={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Crie uma senha" className={inputStyle} value={senha} onChange={e => setSenha(e.target.value)} />

            <button onClick={handleRegistro} disabled={carregando} className={`${btnStyle} bg-slate-900 text-white hover:bg-slate-800`}>
              {carregando ? "CADASTRANDO..." : "CADASTRAR"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Já tem conta? <button onClick={() => setEtapa("login")} className="text-indigo-600 font-bold hover:underline">Fazer Login</button>
            </p>
          </div>
        )}

        {/* ETAPA: AGENDAMENTO */}
        {etapa === "agendar" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Médico Especialista</label>
              <select className={inputStyle} value={medico} onChange={e => setMedico(e.target.value)}>
                <option value="1">Dra. Ana Souza (Pediatria - R$ 250,00)</option>
                <option value="3">Dr. Rodrigo Martins (Cardiologia - R$ 150,00)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Data</label>
                <input type="date" className={inputStyle} value={data} onChange={e => setData(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-2 mb-1 block">Horário</label>
                <select className={inputStyle} value={hora} onChange={e => setHora(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="14:00">14:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </div>
            </div>
            <button onClick={handleAgendar} disabled={carregando} className={`${btnStyle} bg-green-500 text-white hover:bg-green-600 mt-4`}>
              {carregando ? "SALVANDO..." : "CONFIRMAR AGENDAMENTO"}
            </button>
          </div>
        )}

        {/* ETAPA: SUCESSO */}
        {etapa === "sucesso" && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
            <h3 className="text-2xl font-bold text-slate-800">Consulta Confirmada!</h3>
            <p className="text-slate-500 mt-4">Tudo certo, {usuario?.nome}! Seu agendamento foi salvo.</p>
            <button onClick={() => window.location.reload()} className="mt-8 text-indigo-600 font-bold hover:underline">Voltar ao Início</button>
          </div>
        )}

      </div>
    </main>
  );
}