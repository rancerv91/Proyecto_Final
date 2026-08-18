import { useState } from "react";
import api from "../api/axios";

// HU05 - formulario de solicitud de reserva
export default function ReservationForm({ space, onClose, onCreated }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/reservations", {
        spaceId: space._id,
        startTime,
        endTime,
        purpose,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la reserva");
    }
  }

  return (
    <div className="modal">
      <h2>Reservar {space.name}</h2>
      <form onSubmit={handleSubmit}>
        <label>Inicio</label>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />

        <label>Fin</label>
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

        <label>Propósito</label>
        <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} required />

        {error && <p className="error">{error}</p>}
        <button type="submit">Enviar solicitud</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}
