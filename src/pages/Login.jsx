import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

// HU02 - Inicio de sesión
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("sira_token", data.token);
      localStorage.setItem("sira_user", JSON.stringify(data.user));
      navigate("/catalogo");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  }

  return (
    <div className="auth-page">
      <h1>Iniciar sesión — SIRA</h1>
      <form onSubmit={handleSubmit}>
        <label>Correo institucional</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="error">{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
    </div>
  );
}
