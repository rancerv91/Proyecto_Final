import { useEffect, useState } from "react";
import api from "../api/axios";
import SpaceCard from "../components/SpaceCard";
import ReservationForm from "../components/ReservationForm";

// HU03 + HU05 - catálogo de espacios y creación de reservas
export default function Catalog() {
  const [spaces, setSpaces] = useState([]);
  const [minCapacity, setMinCapacity] = useState("");
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [feedback, setFeedback] = useState("");

  async function loadSpaces() {
    const { data } = await api.get("/spaces", { params: minCapacity ? { minCapacity } : {} });
    setSpaces(data);
  }

  useEffect(() => { loadSpaces(); }, [minCapacity]); // eslint-disable-line

  return (
    <div className="catalog-page">
      <h1>Catálogo de auditorios y salones</h1>

      <label>Capacidad mínima</label>
      <input
        type="number"
        value={minCapacity}
        onChange={(e) => setMinCapacity(e.target.value)}
        placeholder="Ej: 50"
      />

      {feedback && <p className="success">{feedback}</p>}

      <div className="space-grid">
        {spaces.map((space) => (
          <SpaceCard key={space._id} space={space} onReserve={setSelectedSpace} />
        ))}
      </div>

      {selectedSpace && (
        <ReservationForm
          space={selectedSpace}
          onClose={() => setSelectedSpace(null)}
          onCreated={() => setFeedback("Solicitud de reserva enviada. Queda pendiente de aprobación.")}
        />
      )}
    </div>
  );
}
