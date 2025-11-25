const request = require("supertest");
const app = require("../app"); // tu archivo principal de Express
const supabaseService = require("../conexion");
const supabase = supabaseService.getClient();

let createdMateriaId;

describe("CRUD Materia", () => {
  // Limpiar datos de prueba antes de iniciar
  beforeAll(async () => {
    await supabase
      .from("materia")
      .delete()
      .ilike("nombremateria", "test%");
  });

  // Crear Materia
  it("POST /materia - debe crear una materia", async () => {
    const res = await request(app)
      .post("/materia")
      .send({
        nombremateria: "TestMateria",
        descripcion: "Materia de prueba"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombremateria).toBe("TestMateria");
    createdMateriaId = res.body.idmateria;
  });

  // Obtener todas las materias
  it("GET /materia - debe retornar todas las materias", async () => {
    const res = await request(app).get("/materia");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Obtener materia por id
  it("GET /materia/:id - debe retornar la materia creada", async () => {
    const res = await request(app).get(`/materia/${createdMateriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idmateria).toBe(createdMateriaId);
  });

  // Actualizar materia
  it("PUT /materia/:id - debe actualizar la materia", async () => {
    const res = await request(app)
      .put(`/materia/${createdMateriaId}`)
      .send({
        nombremateria: "TestMateriaActualizada",
        descripcion: "Descripcion actualizada"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombremateria).toBe("TestMateriaActualizada");
  });

  // Eliminar materia
  it("DELETE /materia/:id - debe eliminar la materia", async () => {
    const res = await request(app).delete(`/materia/${createdMateriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.materia.idmateria).toBe(createdMateriaId);
  });
});
