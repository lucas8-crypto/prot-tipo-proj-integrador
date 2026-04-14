import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ titulo, usuario, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header-esquerda">
        <h1>{titulo}</h1>
        {usuario && (
          <p className="app-header-usuario">
            Usuário: {usuario.nome} ({usuario.tipo})
          </p>
        )}
      </div>

      <div className="app-header-acoes">
        <button type="button" onClick={() => navigate("/")}>
          Início
        </button>

        {onLogout && (
          <button type="button" onClick={onLogout}>
            Sair
          </button>
        )}
      </div>
    </header>
  );
}