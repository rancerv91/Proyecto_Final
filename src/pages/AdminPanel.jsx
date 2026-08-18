import { useEffect, useState } from "react";
import api from "../api/axios";

// HU06 - panel de administrador para aprobar/rechazar solicitudes pendientes
export default function AdminPanel() {
  const [pending, setPending] = useState([]);

  async function loadPending() {
    const { data } = await api.get("/reservations/pending");
    setPending(data);
  }

  useEffect(() => { loadPending(); }, []);

  async function review(id, decision) {
    const comment = window.prompt(`Comentario para la decisión "${decision}" (opcional):`) || "";
    await api.patch(`/reservations/${id}/review`, { decision, comment });
    loadPending();
  }

  return (
    <div className="admin-page">
      <h1>Solicitudes pendientes</h1>
      {pending.length === 0 && <p>No hay solicitudes pendientes.</p>}
      <table>
        <thead>
          <tr>
            <th>Espacio</th><th>Solicitante</th><th>Inicio</th><th>Fin</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((r) => (
            <tr key={r._id}>
              <td>{r.space?.name}</td>
              <td>{r.requestedBy?.name} ({r.requestedBy?.email})</td>
              <td>{new Date(r.startTime).toLocaleString()}</td>
              <td>{new Date(r.endTime).toLocaleString()}</td>
              <td>
                <button onClick={() => review(r._id, "aprobada")}>Aprobar</button>
                <button onClick={() => review(r._id, "rechazada")}>Rechazar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
