// Prueba E2E - flujo crítico HU02 + HU05
// Requiere que el backend y frontend estén corriendo (npm run dev / npm start)
// y que exista un usuario de prueba previamente registrado.

describe("Flujo de reserva de un espacio", () => {
  const email = "estudiante.demo@itla.edu.do";
  const password = "clave1234";

  it("permite iniciar sesión y crear una solicitud de reserva", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("input[type=email]").type(email);
    cy.get("input[type=password]").type(password);
    cy.contains("button", "Ingresar").click();

    cy.url().should("include", "/catalogo");
    cy.contains("Catálogo de auditorios y salones");

    cy.get(".space-card").first().within(() => {
      cy.contains("button", "Reservar").click();
    });

    cy.get("input[type=datetime-local]").eq(0).type("2026-09-20T10:00");
    cy.get("input[type=datetime-local]").eq(1).type("2026-09-20T12:00");
    cy.get("textarea").type("Conferencia de prueba automatizada");
    cy.contains("button", "Enviar solicitud").click();

    cy.contains("Solicitud de reserva enviada");
  });
});
