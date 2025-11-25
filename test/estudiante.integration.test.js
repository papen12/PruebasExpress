const request = require("supertest");
const app = require("../app");
const supabaseService = require("../conexion");
const supabase = supabaseService.getClient();

describe("Integración CRUD Estudiante (ID fijo = 1)", () => {

  beforeAll(async () => {
    await supabase
      .from("estudiante")
      .delete()
      .eq("idestudiante", 1);
  });

  afterAll(async () => {
    await supabase
      .from("estudiante")
      .delete()
      .eq("idestudiante", 1);
  });

  it("Crea un estudiante (POST)", async () => {
    const res = await request(app)
      .post("/estudiante")
      .send({ nombre: "Test Juan", apep: "Perez", apem: "Lopez" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("idestudiante");
    expect(res.body.nombre).toBe("Test Juan");
  });

  it("Obtiene todos los estudiantes (GET)", async () => {
    const res = await request(app).get("/estudiante");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(s => s.idestudiante === 1)).toBe(true);
  });

  it("Obtiene un estudiante por ID (GET /:id)", async () => {
    const res = await request(app).get(`/estudiante/1`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idestudiante).toBe(1);
  });

  it("Actualiza un estudiante (PUT /:id)", async () => {
    const res = await request(app)
      .put(`/estudiante/1`)
      .send({ nombre: "Test Juan Actualizado", apep: "Perez", apem: "Lopez" });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Test Juan Actualizado");
  });

  it("Elimina un estudiante (DELETE /:id)", async () => {
    const res = await request(app).delete(`/estudiante/1`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Estudiante eliminado");

    const check = await request(app).get(`/estudiante/1`);
    expect(check.statusCode).toBe(404);
  });

});
