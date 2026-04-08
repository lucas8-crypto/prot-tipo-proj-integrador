const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuarioModel");

const cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: "Nome, email e senha são obrigatórios"
      });
    }

    const usuarioExistente = await usuarioModel.buscarPorEmail(email);

    if (usuarioExistente) {
      return res.status(400).json({
        erro: "Já existe um usuário com esse email"
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const resultado = await usuarioModel.criar({
      nome,
      email,
      senha: senhaCriptografada,
      tipo: tipo || "funcionario"
    });

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      id: resultado.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Email e senha são obrigatórios"
      });
    }

    const usuario = await usuarioModel.buscarPorEmail(email);

    if (!usuario) {
      return res.status(401).json({
        erro: "Usuário ou senha inválidos"
      });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: "Usuário ou senha inválidos"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao realizar login" });
  }
};

module.exports = {
  cadastrar,
  login
};