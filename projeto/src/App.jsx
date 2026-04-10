import { Routes, Route } from "react-router-dom";
import ListaOS from "./pages/ListaOS";
import CadastroOS from "./pages/CadastroOS";
import DetalheOS from "./pages/DetalheOS";
import EditarOS from "./pages/EditarOS";
import Login from "./pages/Login";
import CadastroUsuario from "./pages/CadastroUsuario";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import FuncionarioRoute from "./components/FuncionarioRoute";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <ListaOS />
          </PrivateRoute>
        }
      />

      <Route
        path="/ordens/nova"
        element={
          <FuncionarioRoute>
            <CadastroOS />
          </FuncionarioRoute>
        }
      />

      <Route
        path="/ordens/:id"
        element={
          <PrivateRoute>
            <DetalheOS />
          </PrivateRoute>
        }
      />

      <Route
        path="/ordens/:id/editar"
        element={
          <PrivateRoute>
            <EditarOS />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuarios/novo"
        element={
          <AdminRoute>
            <CadastroUsuario />
          </AdminRoute>
        }
      />
    </Routes>
  );
}