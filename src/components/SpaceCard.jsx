// HU03 - tarjeta de un espacio en el catálogo
export default function SpaceCard({ space, onReserve }) {
  return (
    <div className="space-card">
      <h3>{space.name}</h3>
      <p>Tipo: {space.type}</p>
      <p>Capacidad: {space.capacity} personas</p>
      <p>Ubicación: {space.location}</p>
      {space.equipment?.length > 0 && <p>Equipamiento: {space.equipment.join(", ")}</p>}
      <button onClick={() => onReserve(space)}>Reservar</button>
    </div>
  );
}
