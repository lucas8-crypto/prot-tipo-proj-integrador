import { Routes, Route } from "react-router-dom";
import ListaOS from "./pages/ListaOS";
import CadastroOS from "./pages/CadastroOS";
import DetalheOS from "./pages/DetalheOS";
import EditarOS from "./pages/EditarOS";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
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
          <PrivateRoute>
            <CadastroOS />
          </PrivateRoute>
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
    </Routes>
  );
}