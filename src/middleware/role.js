// Middleware de autorización por rol (usado por HU04, HU06, HU10 - solo administrador)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos para esta acción" });
    }
    next();
  };
}

module.exports = requireRole;
