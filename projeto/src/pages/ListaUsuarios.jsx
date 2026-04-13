import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ListaUsuarios.css";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  async function carregarUsuarios() {
    try {
      const resposta = await api.get("/usuarios");
      setUsuarios(resposta.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar usuários");
    }
  }

  async function desativarUsuario(id) {
    if (usuarioLogado?.id === id) {
      alert("Você não pode desativar seu próprio usuário");
      return;
    }
  
    const confirmar = window.confirm("Deseja realmente desativar este usuário?");
    if (!confirmar) return;
  
    try {
      await api.put(`/usuarios/${id}/desativar`, {
        usuarioLogadoId: usuarioLogado.id
      });
  
      alert("Usuário desativado com sucesso");
      carregarUsuarios();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.erro || "Erro ao desativar usuário");
    }
  }
  
  async function reativarUsuario(id) {
    try {
      await api.put(`/usuarios/${id}/reativar`);
      alert("Usuário reativado com sucesso");
      carregarUsuarios();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.erro || "Erro ao reativar usuário");
    }
  }

  return (
    <div className="container-usuarios">
      <div className="painel-usuarios">
        <div className="topo-usuarios">
          <h2>Gerenciar Usuários</h2>

          <div className="topo-usuarios-acoes">
            <button type="button" onClick={() => navigate("/usuarios/novo")}>
              Novo Usuário
            </button>

            <button type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>

        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Data de cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.tipo}</td>
                    <td>{usuario.ativo ? "Ativo" : "Inativo"}</td>
                    <td>
                      {usuario.created_at
                        ? new Date(usuario.created_at).toLocaleString("pt-BR")
                        : "-"}
                    </td>
                    <td>
                      <div className="acoes-tabela">
                        <button
                          type="button"
                          onClick={() => navigate(`/usuarios/${usuario.id}/editar`)}
                        >
                          Editar
                        </button>

                        {usuario.ativo ? (
                          usuarioLogado?.id !== usuario.id && (
                            <button
                              type="button"
                              onClick={() => desativarUsuario(usuario.id)}
                            >
                              Desativar
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => reativarUsuario(usuario.id)}
                          >
                            Reativar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Nenhum usuário encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}