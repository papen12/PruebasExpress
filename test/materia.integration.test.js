const request = require("supertest");
const app = require("../app");
const supabaseService = require("../conexion");
const supabase = supabaseService.getClient();

let createdMateriaId;

describe("Integración completa CRUD Materia", () => {

  // Limpiar datos de prueba antes de todo
  beforeAll(async () => {
    await supabase
      .from("materia")
      .delete()
      .ilike("nombremateria", "test%");
  });

  // Limpiar después de terminar todos los tests
  afterAll(async () => {
    if (createdMateriaId) {
      await supabase.from("materia").delete().eq("idmateria", createdMateriaId);
    }
  });

  test("POST /materia - Crear materia", async () => {
    const res = await request(app)
      .post("/materia")
      .send({
        nombremateria: "TestMateriaIntegracion",
        descripcion: "Materia de prueba integración"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombremateria).toBe("TestMateriaIntegracion");
    createdMateriaId = res.body.idmateria;
  });

  test("GET /materia - Listar materias", async () => {
    const res = await request(app).get("/materia");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const materia = res.body.find(m => m.idmateria === createdMateriaId);
    expect(materia).toBeDefined();
  });

  test("GET /materia/:id - Obtener materia por id", async () => {
    const res = await request(app).get(`/materia/${createdMateriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idmateria).toBe(createdMateriaId);
    expect(res.body.nombremateria).toBe("TestMateriaIntegracion");
  });

  test("PUT /materia/:id - Actualizar materia", async () => {
    const res = await request(app)
      .put(`/materia/${createdMateriaId}`)
      .send({
        nombremateria: "TestMateriaActualizada",
        descripcion: "Descripcion actualizada integración"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombremateria).toBe("TestMateriaActualizada");
  });

  test("DELETE /materia/:id - Eliminar materia", async () => {
    const res = await request(app).delete(`/materia/${createdMateriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.materia.idmateria).toBe(createdMateriaId);
    createdMateriaId = null;
  });

});
