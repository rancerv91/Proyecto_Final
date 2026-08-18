# SIRA — Sistema de Reservas de Auditorios y Salones

Código base del Proyecto Final de Programación III. Implementa el primer Release
descrito en la documentación: registro/login con roles, catálogo de espacios,
solicitud y aprobación de reservas (con validación de solapamiento de horario),
cancelación, calendario de disponibilidad, notificaciones por correo y reporte
de uso.

## Estructura

```
sira-project/
├── backend/          API REST (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── models/         User, Space, Reservation
│   │   ├── controllers/    lógica de negocio (auth, spaces, reservations)
│   │   ├── routes/         endpoints REST
│   │   ├── middleware/     auth (JWT) y control de roles
│   │   └── utils/          envío de notificaciones por correo
│   └── tests/         Jest + Supertest (HU01, HU02, HU05, HU06)
├── frontend/          React (login, registro, catálogo, panel admin)
│   └── cypress/e2e/   prueba end-to-end del flujo de reserva
└── .github/workflows/ CI con GitHub Actions (ejecuta los tests en cada PR)
```

## Cómo correrlo

### Backend
```bash
cd backend
cp .env.example .env      # ajusta MONGO_URI y JWT_SECRET
npm install
npm run dev                # http://localhost:4000
```

### Pruebas del backend
```bash
cd backend
npm test                   # Jest + Supertest, usa MongoDB en memoria
```
> La primera ejecución descarga el binario de `mongodb-memory-server`
> (requiere conexión a internet); en este entorno de generación no fue
> posible descargarlo por las restricciones de red del sandbox, pero el
> código fue verificado sintácticamente y el servidor Express arranca
> y responde correctamente (`/api/health` → 200 OK). Al correrlo en la
> máquina o en GitHub Actions debería funcionar sin problema.

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm start                  # http://localhost:3000
```

### Pruebas E2E (Cypress)
```bash
cd frontend
npm run cypress:open       # con backend y frontend corriendo
```

## Mapeo Historias de Usuario → código

| Historia | Dónde está implementada |
|---|---|
| HU01 | `backend/src/controllers/authController.js` (`register`), `frontend/src/pages/Register.jsx` |
| HU02 | `authController.js` (`login`, bloqueo tras 5 intentos), `frontend/src/pages/Login.jsx` |
| HU03 | `spaceController.js` (`listSpaces`), `frontend/src/pages/Catalog.jsx` |
| HU04 | `spaceController.js` (`createSpace`, `updateSpace`, `deleteSpace`) |
| HU05 | `reservationController.js` (`createReservation`, valida solapamiento) |
| HU06 | `reservationController.js` (`listPending`, `reviewReservation`), `frontend/src/pages/AdminPanel.jsx` |
| HU07 | `reservationController.js` (`cancelReservation`) |
| HU08 | `reservationController.js` (`getSpaceCalendar`) |
| HU09 | `backend/src/utils/sendEmail.js`, invocado desde `reviewReservation` y `cancelReservation` |
| HU10 | `reservationController.js` (`usageReport`) |

## Próximos pasos sugeridos
1. Crear el repositorio en GitHub y subir este código.
2. Crear el proyecto y las 10 historias de usuario en Jira (usa la tabla del
   documento de planificación como referencia).
3. Configurar un clúster de MongoDB (Atlas o local) y variables de entorno reales.
4. Grabar el video demostrativo mostrando el flujo: registro → login → catálogo
   → solicitud de reserva → aprobación (admin) → notificación.
