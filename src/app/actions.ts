"use server";

import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "clinica_saude",
};

// LOGIN: Busca o usuário e retorna o ID e Nome para a sessão
export async function loginPaciente(email: string, senha: string) {
  try {
    const db = await mysql.createConnection(dbConfig);

    // A query PRECISA buscar pelo email E pela senha
    const [rows]: any = await db.execute(
      "SELECT * FROM pacientes WHERE email = ? AND senha = ?",
      [email, senha]
    );

    await db.end();

    // Se o array 'rows' estiver vazio, significa que não achou ninguém com esse email e senha
    if (rows.length === 0) {
      return { success: false, message: "E-mail ou senha incorretos!" };
    }

    // Se achou, retorna o primeiro usuário da lista
    return { success: true, user: rows[0] };
  } catch (error: any) {
    return { success: false, message: "Erro no servidor." };
  }
}

// CADASTRO: Agora com os 7 campos que você adicionou na tela
export async function cadastrarPaciente(
  nome: string,
  email: string,
  senha: string,
  telefone: string,
  data_nascimento: string,
  foto_url: string,
  plano_saude: string,
) {
  try {
    const db = await mysql.createConnection(dbConfig);

    // Verifique se os nomes das colunas abaixo batem com o seu MySQL Workbench
    const query = `
      INSERT INTO pacientes 
      (nome, email, senha, telefone, data_nascimento, foto_url, plano_saude) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      nome,
      email,
      senha,
      telefone,
      data_nascimento,
      foto_url,
      plano_saude,
    ]);

    await db.end();
    return { success: true };
  } catch (error: any) {
    console.error("Erro no Cadastro:", error.message);
    return {
      success: false,
      message: "Erro ao salvar no banco: " + error.message,
    };
  }
}

// AGENDAMENTO: Salva a consulta vinculada ao ID do paciente logado
export async function salvarAgendamento(
  id_paciente: number, 
  id_medico: number, 
  data: string, 
  hora: string, 
  valorConsulta: number,
) {
  try {
    const db = await mysql.createConnection(dbConfig);

    const dataHoraFinal = `${data} ${hora}:00`;

    // CORREÇÃO: Usando 'valor_final' que é o nome real na sua tabela 'agendamentos'
    const query =
      "INSERT INTO agendamentos (id_paciente, id_medico, data_hora, valor_final) VALUES (?, ?, ?, ?)";

    await db.execute(query, [id_paciente, id_medico, dataHoraFinal, valorConsulta]);

    await db.end();
    return { success: true };
  } catch (error: any) {
    console.error("ERRO NO BANCO:", error.message);
    return { success: false, message: "Erro ao agendar: " + error.message };
  }
}
