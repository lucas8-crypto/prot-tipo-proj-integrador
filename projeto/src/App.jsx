import { Routes, Route } from "react-router-dom";
import ListaOS from "./pages/ListaOS";
import CadastroOS from "./pages/CadastroOS";
import DetalheOS from "./pages/DetalheOS";
import EditarOS from "./pages/EditarOS";
import Login from "./pages/Login";
import CadastroUsuario from "./pages/CadastroUsuario";
import ListaUsuarios from "./pages/ListaUsuarios";
import EditarUsuario from "./pages/EditarUsuario";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import FuncionarioRoute from "./components/FuncionarioRoute";
import HomeRedirect from "./components/HomeRedirect";
import "./App.css";


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomeRedirect />} />
      

      <Route
        path="/ordens"
        element={
          <FuncionarioRoute>
            <ListaOS />
          </FuncionarioRoute>
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
          <FuncionarioRoute>
            <DetalheOS />
          </FuncionarioRoute>
        }
      />

      <Route
        path="/ordens/:id/editar"
        element={
          <FuncionarioRoute>
            <EditarOS />
          </FuncionarioRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <AdminRoute>
            <ListaUsuarios />
          </AdminRoute>
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

      <Route
          path="/usuarios/:id/editar"
          element={
            <AdminRoute>
              <EditarUsuario />
            </AdminRoute>
          }
        />
      </Routes>
  );
}