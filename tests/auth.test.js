require("./setup");
const request = require("supertest");
const app = require("../src/server");

describe("HU01 - Registro de usuario", () => {
  it("registra un usuario válido con correo institucional", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Ana Pérez",
      email: "ana.perez@itla.edu.do",
      password: "clave1234",
      role: "estudiante",
    });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("ana.perez@itla.edu.do");
  });

  it("rechaza contraseñas de menos de 8 caracteres", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Ana Pérez",
      email: "ana.perez@itla.edu.do",
      password: "123",
    });
    expect(res.status).toBe(400);
  });

  it("rechaza correos que no son institucionales", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Ana Pérez",
      email: "ana.perez@gmail.com",
      password: "clave1234",
    });
    expect(res.status).toBe(500); // falla validación de Mongoose (match)
  });
});

describe("HU02 - Inicio de sesión", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Ana Pérez",
      email: "ana.perez@itla.edu.do",
      password: "clave1234",
    });
  });

  it("inicia sesión con credenciales correctas y devuelve un token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "ana.perez@itla.edu.do",
      password: "clave1234",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rechaza credenciales incorrectas", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "ana.perez@itla.edu.do",
      password: "incorrecta",
    });
    expect(res.status).toBe(401);
  });

  it("bloquea la cuenta tras 5 intentos fallidos", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/auth/login").send({
        email: "ana.perez@itla.edu.do",
        password: "incorrecta",
      });
    }
    const res = await request(app).post("/api/auth/login").send({
      email: "ana.perez@itla.edu.do",
      password: "clave1234", // incluso con la correcta, debe seguir bloqueada
    });
    expect(res.status).toBe(423);
  });
});
