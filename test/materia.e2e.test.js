const request = require("supertest");
const app = require("../app");
const supabaseService = require("../conexion");
const supabase = supabaseService.getClient();

let createdMateriaId;

describe("E2E pruebas Materia", () => {

  // Limpiar materias de prueba antes de todo
  beforeAll(async () => {
    await supabase
      .from("materia")
      .delete()
      .ilike("nombremateria", "E2EMateria%");
  });

  // Limpiar después de todos los tests
  afterAll(async () => {
    if (createdMateriaId) {
      await supabase.from("materia").delete().eq("idmateria", createdMateriaId);
    }
  });

  test("Flujo completo: crear, listar, obtener, actualizar y eliminar materia", async () => {
    let res = await request(app)
      .post("/materia")
      .send({
        nombremateria: "E2EMateria1",
        descripcion: "Materia de prueba E2E"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombremateria).toBe("E2EMateria1");
    createdMateriaId = res.body.idmateria;
    res = await request(app).get("/materia");
    expect(res.statusCode).toBe(200);
    const materiaList = res.body;
    expect(Array.isArray(materiaList)).toBe(true);
    const materiaCreada = materiaList.find(m => m.idmateria === createdMateriaId);
    expect(materiaCreada).toBeDefined();
    res = await request(app).get(`/materia/${createdMateriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idmateria).toBe(createdMateriaId);
    expect(res.body.nombremateria).toBe("E2EMateria1");
    res = await request(app)
      .put(`/materia/${createdMateriaId}`)
      .send({
        nombremateria: "E2EMateriaActualizada",
        descripcion: "Descripcion actualizada E2E"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombremateria).toBe("E2EMateriaActualizada");
    res = await request(app).get("/materia/999999");
    expect(res.statusCode).toBe(404);
    res = await request(app)
      .post("/materia")
      .send({ descripcion: "Sin nombre" });
    expect(res.statusCode).toBe(400);
    res = await request(app).delete(`/materia/${createdMateriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.materia.idmateria).toBe(createdMateriaId);

    createdMateriaId = null;
  });
});
