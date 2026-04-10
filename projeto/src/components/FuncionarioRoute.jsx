import { Navigate } from "react-router-dom";

export default function FuncionarioRoute({ children }) {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (usuario?.tipo !== "funcionario") {
    return <Navigate to="/" replace />;
  }

  return children;
}