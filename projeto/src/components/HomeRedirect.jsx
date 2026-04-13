// Para redireicionar para qual tela abrir de for funcionário ou se for admin.
import { Navigate } from "react-router-dom";

export default function HomeRedirect() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (usuario?.tipo === "admin") {
    return <Navigate to="/usuarios" replace />;
  }

  return <Navigate to="/ordens" replace />;
}