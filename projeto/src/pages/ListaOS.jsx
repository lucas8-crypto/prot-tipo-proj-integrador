import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ListaOS.css";

export default function ListaOS() {
  const [ordens, setOrdens] = useState([]);
  const [filtroProjeto, setFiltroProjeto] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    carregarOrdens();
  }, []);

  async function carregarOrdens() {
    try {
      const resposta = await api.get("/ordens");
      setOrdens(resposta.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar ordens de serviço");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  const ordensFiltradas = ordens.filter((os) => {
    const projetoOk = os.nome_projeto
      .toLowerCase()
      .includes(filtroProjeto.toLowerCase());

    const statusOk = filtroStatus ? os.status === filtroStatus : true;

    return projetoOk && statusOk;
  });

  return (
    <div className="container-lista">
      <div className="painel-lista">
        <div className="topo-lista">
          <div className="topo-info">
            <h2>Ordens de Serviço</h2>
            <p className="usuario-logado">
              Usuário: {usuarioLogado?.nome || "Não identificado"}
            </p>
          </div>

          <div className="topo-acoes">
            {usuarioLogado?.tipo !== "admin" && (
              <button type="button" onClick={() => navigate("/ordens/nova")}>
                Nova OS
              </button>
            )}

            {usuarioLogado?.tipo === "admin" && (
              <button type="button" onClick={() => navigate("/usuarios/novo")}>
                Novo Usuário
              </button>
            )}
            
            <button type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>

        <div className="filtros">
          <div className="campo-filtro">
            <label>Buscar por projeto</label>
            <input
              type="text"
              value={filtroProjeto}
              onChange={(e) => setFiltroProjeto(e.target.value)}
              placeholder="Digite o nome do projeto"
            />
          </div>

          <div className="campo-filtro">
            <label>Filtrar por status</label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="aprovada">Aprovada</option>
              <option value="recusada">Recusada</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </div>
        </div>

        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Projeto</th>
                <th>Status</th>
                <th>Data de lançamento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ordensFiltradas.length > 0 ? (
                ordensFiltradas.map((os) => (
                  <tr key={os.id}>
                    <td>{os.id}</td>
                    <td>{os.nome_projeto}</td>
                    <td>{os.status}</td>
                    <td>{new Date(os.data_lancamento).toLocaleString("pt-BR")}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => navigate(`/ordens/${os.id}`)}
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nenhuma ordem encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}