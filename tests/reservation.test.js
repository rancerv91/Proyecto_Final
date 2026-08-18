require("./setup");
const request = require("supertest");
const app = require("../src/server");
const User = require("../src/models/User");
const Space = require("../src/models/Space");

async function createUserAndLogin(role = "estudiante", email = "user@itla.edu.do") {
  await request(app).post("/api/auth/register").send({
    name: "Usuario Test", email, password: "clave1234", role,
  });
  const res = await request(app).post("/api/auth/login").send({ email, password: "clave1234" });
  return res.body.token;
}

async function createSpace(adminToken) {
  const res = await request(app)
    .post("/api/spaces")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: "Auditorio A", type: "auditorio", capacity: 100, location: "Edificio 1" });
  return res.body;
}

describe("HU05 - Crear solicitud de reserva", () => {
  it("crea una reserva válida cuando el espacio está disponible", async () => {
    const adminToken = await createUserAndLogin("administrador", "admin@itla.edu.do");
    const userToken = await createUserAndLogin("estudiante", "student@itla.edu.do");
    const space = await createSpace(adminToken);

    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        spaceId: space._id,
        startTime: "2026-09-20T10:00:00.000Z",
        endTime: "2026-09-20T12:00:00.000Z",
        purpose: "Conferencia de tecnología",
      });

    expect(res.status).toBe(201);
    expect(res.body.reservation.status).toBe("pendiente");
  });

  it("rechaza una reserva que se solapa con otra existente (RF05)", async () => {
    const adminToken = await createUserAndLogin("administrador", "admin2@itla.edu.do");
    const userToken = await createUserAndLogin("estudiante", "student2@itla.edu.do");
    const space = await createSpace(adminToken);

    await request(app).post("/api/reservations").set("Authorization", `Bearer ${userToken}`).send({
      spaceId: space._id,
      startTime: "2026-09-21T10:00:00.000Z",
      endTime: "2026-09-21T12:00:00.000Z",
      purpose: "Primera reserva",
    });

    const res = await request(app).post("/api/reservations").set("Authorization", `Bearer ${userToken}`).send({
      spaceId: space._id,
      startTime: "2026-09-21T11:00:00.000Z",
      endTime: "2026-09-21T13:00:00.000Z",
      purpose: "Reserva solapada",
    });

    expect(res.status).toBe(409);
  });
});

describe("HU06 - Aprobar / rechazar reservas (administrador)", () => {
  it("un usuario no administrador no puede aprobar reservas", async () => {
    const adminToken = await createUserAndLogin("administrador", "admin3@itla.edu.do");
    const userToken = await createUserAndLogin("estudiante", "student3@itla.edu.do");
    const space = await createSpace(adminToken);

    const created = await request(app).post("/api/reservations").set("Authorization", `Bearer ${userToken}`).send({
      spaceId: space._id,
      startTime: "2026-09-22T10:00:00.000Z",
      endTime: "2026-09-22T12:00:00.000Z",
      purpose: "Prueba",
    });

    const res = await request(app)
      .patch(`/api/reservations/${created.body.reservation._id}/review`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ decision: "aprobada" });

    expect(res.status).toBe(403);
  });
});
