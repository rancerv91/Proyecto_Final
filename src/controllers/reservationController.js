const Reservation = require("../models/Reservation");
const Space = require("../models/Space");
const User = require("../models/User");
const sendReservationEmail = require("../utils/sendEmail");

// RF05 - valida que no existan solapamientos de horario para un mismo espacio
async function hasOverlap(spaceId, start, end, excludeId = null) {
  const query = {
    space: spaceId,
    status: { $in: ["pendiente", "aprobada"] },
    startTime: { $lt: end },
    endTime: { $gt: start },
  };
  if (excludeId) query._id = { $ne: excludeId };
  const conflict = await Reservation.findOne(query);
  return !!conflict;
}

// HU05 - crear solicitud de reserva
exports.createReservation = async (req, res) => {
  try {
    const { spaceId, startTime, endTime, purpose } = req.body;
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (!spaceId || !startTime || !endTime || !purpose) {
      return res.status(400).json({ message: "Espacio, fecha de inicio, fin y propósito son obligatorios" });
    }
    if (start >= end) {
      return res.status(400).json({ message: "La hora de inicio debe ser anterior a la hora de fin" });
    }

    const space = await Space.findById(spaceId);
    if (!space || !space.active) {
      return res.status(404).json({ message: "Espacio no disponible" });
    }

    if (await hasOverlap(spaceId, start, end)) {
      return res.status(409).json({ message: "El espacio ya está reservado en ese horario" });
    }

    const reservation = await Reservation.create({
      space: spaceId,
      requestedBy: req.user.id,
      startTime: start,
      endTime: end,
      purpose,
      status: "pendiente",
    });

    res.status(201).json({ message: "Solicitud de reserva creada", reservation });
  } catch (err) {
    res.status(500).json({ message: "Error al crear la reserva", error: err.message });
  }
};

// HU08 - calendario de disponibilidad por espacio
exports.getSpaceCalendar = async (req, res) => {
  const { spaceId } = req.params;
  const reservations = await Reservation.find({
    space: spaceId,
    status: { $in: ["pendiente", "aprobada"] },
  }).select("startTime endTime status");
  res.json(reservations);
};

// HU06 - listar solicitudes pendientes (administrador)
exports.listPending = async (req, res) => {
  const reservations = await Reservation.find({ status: "pendiente" })
    .populate("space", "name location")
    .populate("requestedBy", "name email")
    .sort({ createdAt: 1 });
  res.json(reservations);
};

// HU06 - aprobar o rechazar una solicitud (administrador)
exports.reviewReservation = async (req, res) => {
  try {
    const { decision, comment } = req.body; // decision: "aprobada" | "rechazada"
    if (!["aprobada", "rechazada"].includes(decision)) {
      return res.status(400).json({ message: "Decisión inválida" });
    }

    const reservation = await Reservation.findById(req.params.id).populate("requestedBy");
    if (!reservation) return res.status(404).json({ message: "Reserva no encontrada" });
    if (reservation.status !== "pendiente") {
      return res.status(400).json({ message: "Solo se pueden revisar solicitudes pendientes" });
    }

    if (decision === "aprobada" && (await hasOverlap(reservation.space, reservation.startTime, reservation.endTime, reservation._id))) {
      return res.status(409).json({ message: "Ya existe una reserva aprobada que se solapa con este horario" });
    }

    reservation.status = decision;
    reservation.reviewedBy = req.user.id;
    reservation.reviewComment = comment || "";
    await reservation.save();

    // RF07 / HU09 - notificación por correo al solicitante
    await sendReservationEmail({
      to: reservation.requestedBy.email,
      subject: `Tu reserva fue ${decision}`,
      text: `Tu solicitud de reserva ha sido ${decision}. Comentario: ${comment || "N/A"}`,
    });

    res.json({ message: `Reserva ${decision}`, reservation });
  } catch (err) {
    res.status(500).json({ message: "Error al revisar la reserva", error: err.message });
  }
};

// HU07 - cancelar una reserva (dueño o administrador)
exports.cancelReservation = async (req, res) => {
  const { reason } = req.body;
  const reservation = await Reservation.findById(req.params.id).populate("requestedBy");
  if (!reservation) return res.status(404).json({ message: "Reserva no encontrada" });

  const isOwner = String(reservation.requestedBy._id) === req.user.id;
  const isAdmin = req.user.role === "administrador";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "No tienes permiso para cancelar esta reserva" });
  }
  if (reservation.status === "cancelada") {
    return res.status(400).json({ message: "La reserva ya estaba cancelada" });
  }

  reservation.status = "cancelada";
  reservation.cancelReason = reason || "";
  await reservation.save();

  await sendReservationEmail({
    to: reservation.requestedBy.email,
    subject: "Tu reserva fue cancelada",
    text: `Tu reserva fue cancelada. Motivo: ${reason || "No especificado"}`,
  });

  res.json({ message: "Reserva cancelada", reservation });
};

// HU10 - reporte de uso de espacios por rango de fechas (administrador)
exports.usageReport = async (req, res) => {
  const { from, to, spaceId } = req.query;
  const filter = { status: { $in: ["aprobada", "cancelada"] } };
  if (from || to) {
    filter.startTime = {};
    if (from) filter.startTime.$gte = new Date(from);
    if (to) filter.startTime.$lte = new Date(to);
  }
  if (spaceId) filter.space = spaceId;

  const reservations = await Reservation.find(filter).populate("space", "name");

  const totalsBySpace = {};
  reservations.forEach((r) => {
    const key = r.space?.name || "Desconocido";
    totalsBySpace[key] = (totalsBySpace[key] || 0) + 1;
  });

  res.json({ totalReservations: reservations.length, totalsBySpace, reservations });
};
