const db = require("../config/db");

const criar = async (dados) => {
  const {
    tipo_solicitante,
    setor_interno,
    solicitante_externo,
    contato,
    nome_projeto,
    descricao_projeto,
    medida_final,
    quantidade,
    manipulacao_arquivo,
    processos,
    materiais,
    observacoes,
    usuario_id
  } = dados;

  const sql = `
    INSERT INTO ordens_servico (
      tipo_solicitante,
      setor_interno,
      solicitante_externo,
      contato,
      nome_projeto,
      descricao_projeto,
      medida_final,
      quantidade,
      manipulacao_arquivo,
      processos,
      materiais,
      observacoes,
      usuario_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    tipo_solicitante,
    setor_interno || null,
    solicitante_externo || null,
    contato || null,
    nome_projeto,
    descricao_projeto,
    medida_final || null,
    quantidade,
    manipulacao_arquivo ? 1 : 0,
    processos || null,
    materiais || null,
    observacoes || null,
    usuario_id
  ];

  const [resultado] = await db.execute(sql, valores);
  return resultado;
};

const listar = async () => {
  const [rows] = await db.execute(`
    SELECT id, nome_projeto, status, data_lancamento
    FROM ordens_servico
    ORDER BY id DESC
  `);

  return rows;
};

const buscarPorId = async (id) => {
  const [rows] = await db.execute(
    `
    SELECT 
      os.*,
      u.nome AS nome_atendente,
      u.email AS email_atendente
    FROM ordens_servico os
    JOIN usuarios u ON os.usuario_id = u.id
    WHERE os.id = ?
    `,
    [id]
  );

  return rows[0];
};

// permitir editar apenas OSs pendentes
const atualizar = async (id, dados) => {
  const {
    tipo_solicitante,
    setor_interno,
    solicitante_externo,
    contato,
    nome_projeto,
    descricao_projeto,
    medida_final,
    quantidade,
    manipulacao_arquivo,
    processos,
    materiais,
    observacoes
  } = dados;

  const sql = `
    UPDATE ordens_servico
    SET
      tipo_solicitante = ?,
      setor_interno = ?,
      solicitante_externo = ?,
      contato = ?,
      nome_projeto = ?,
      descricao_projeto = ?,
      medida_final = ?,
      quantidade = ?,
      manipulacao_arquivo = ?,
      processos = ?,
      materiais = ?,
      observacoes = ?
    WHERE id = ? AND status = 'pendente'
  `;

  const valores = [
    tipo_solicitante,
    setor_interno || null,
    solicitante_externo || null,
    contato || null,
    nome_projeto,
    descricao_projeto,
    medida_final || null,
    quantidade,
    manipulacao_arquivo ? 1 : 0,
    processos || null,
    materiais || null,
    observacoes || null,
    id
  ];

  const [resultado] = await db.execute(sql, valores);
  return resultado;
};

const buscarStatusPorId = async (id) => {
  const [rows] = await db.execute(
    `SELECT status FROM ordens_servico WHERE id = ?`,
    [id]
  );

  return rows[0];
};

const atualizarStatus = async (id, dados) => {
  const { status, coordenador_nome, motivo_recusa } = dados;

  let sql = `
    UPDATE ordens_servico
    SET status = ?, coordenador_nome = ?, motivo_recusa = ?
  `;
  const valores = [status, coordenador_nome || null, motivo_recusa || null];

  if (status === "aprovada" || status === "recusada") {
    sql += `, data_autorizacao = NOW()`;
  }

  if (status === "finalizada") {
    sql += `, data_conclusao = NOW()`;
  }

  sql += ` WHERE id = ?`;
  valores.push(id);

  const [resultado] = await db.execute(sql, valores);
  return resultado;
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  buscarStatusPorId,
  atualizar,
  atualizarStatus
};