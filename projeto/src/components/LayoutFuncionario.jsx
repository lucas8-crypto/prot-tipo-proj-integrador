import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FuncionarioRoute from "./FuncionarioRoute";
import "../App.css";

export default function LayoutFuncionario() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  return (
    <FuncionarioRoute>
      <div className="app-layout">
        <Header onLogout={handleLogout} />

        <main className="app-main">
          <Outlet />
        </main>

        <Footer />
      </div>
    </FuncionarioRoute>
  );
}