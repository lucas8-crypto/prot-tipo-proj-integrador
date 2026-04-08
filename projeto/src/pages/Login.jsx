import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const resposta = await api.post("/auth/login", {
        email,
        senha
      });

      localStorage.setItem("token", resposta.data.token);
      localStorage.setItem("usuario", JSON.stringify(resposta.data.usuario));

      alert("Login realizado com sucesso");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.erro || "Erro ao realizar login");
    }
  }

  return (
    <div className="container-login">
      <form className="form-login" onSubmit={handleLogin}>
        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}