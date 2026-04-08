const db = require("../config/db");

const buscarPorEmail = async (email) => {
  const [rows] = await db.execute(
    `SELECT * FROM usuarios WHERE email = ?`,
    [email]
  );

  return rows[0];
};

const criar = async ({ nome, email, senha, tipo }) => {
  const [resultado] = await db.execute(
    `
    INSERT INTO usuarios (nome, email, senha, tipo)
    VALUES (?, ?, ?, ?)
    `,
    [nome, email, senha, tipo]
  );

  return resultado;
};

module.exports = {
  buscarPorEmail,
  criar
};