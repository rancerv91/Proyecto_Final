const Space = require("../models/Space");

// HU03 - listar catálogo, con filtro opcional de capacidad mínima
exports.listSpaces = async (req, res) => {
  const { minCapacity } = req.query;
  const filter = { active: true };
  if (minCapacity) filter.capacity = { $gte: Number(minCapacity) };

  const spaces = await Space.find(filter).sort({ name: 1 });
  res.json(spaces);
};

exports.getSpace = async (req, res) => {
  const space = await Space.findById(req.params.id);
  if (!space) return res.status(404).json({ message: "Espacio no encontrado" });
  res.json(space);
};

// HU04 - alta de espacio (solo administrador)
exports.createSpace = async (req, res) => {
  try {
    const { name, type, capacity, location, equipment, imageUrl } = req.body;
    if (!name || !type || !capacity || !location) {
      return res.status(400).json({ message: "Nombre, tipo, capacidad y ubicación son obligatorios" });
    }
    const space = await Space.create({ name, type, capacity, location, equipment, imageUrl });
    res.status(201).json(space);
  } catch (err) {
    res.status(500).json({ message: "Error al crear el espacio", error: err.message });
  }
};

// HU04 - edición de espacio
exports.updateSpace = async (req, res) => {
  const space = await Space.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!space) return res.status(404).json({ message: "Espacio no encontrado" });
  res.json(space);
};

// HU04 - eliminación (soft delete) de espacio
exports.deleteSpace = async (req, res) => {
  const space = await Space.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!space) return res.status(404).json({ message: "Espacio no encontrado" });
  res.json({ message: "Espacio eliminado", space });
};
