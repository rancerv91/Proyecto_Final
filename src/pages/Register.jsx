import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

// HU01 - Registro de usuario con correo institucional
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "estudiante" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      setMessage("Registro exitoso. Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    }
  }

  return (
    <div className="auth-page">
      <h1>Crear cuenta — SIRA</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombre completo</label>
        <input value={form.name} onChange={update("name")} required />

        <label>Correo institucional</label>
        <input type="email" value={form.email} onChange={update("email")} required />

        <label>Contraseña (mínimo 8 caracteres)</label>
        <input type="password" minLength={8} value={form.password} onChange={update("password")} required />

        <label>Rol</label>
        <select value={form.role} onChange={update("role")}>
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
          <option value="administrador">Administrador</option>
        </select>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit">Registrarme</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
}
