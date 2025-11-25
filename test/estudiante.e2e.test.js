const request = require("supertest");
const app = require("../app");
const supabaseService = require("../conexion");
const supabase = supabaseService.getClient();

let createdEstudianteId;

describe("E2E pruebas Estudiante", () => {

  // Limpiar estudiante de prueba antes de iniciar
  beforeAll(async () => {
    await supabase
      .from("estudiante")
      .delete()
      .ilike("nombre", "E2ETest%");
  });

  // Limpiar después de todos los tests
  afterAll(async () => {
    if (createdEstudianteId) {
      await supabase.from("estudiante").delete().eq("idestudiante", createdEstudianteId);
    }
  });

  test("Flujo completo: crear, listar, obtener, actualizar y eliminar estudiante", async () => {
    let res = await request(app)
      .post("/estudiante")
      .send({ nombre: "E2ETest Juan", apep: "Perez", apem: "Lopez" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("idestudiante");
    expect(res.body.nombre).toBe("E2ETest Juan");
    createdEstudianteId = res.body.idestudiante;
    res = await request(app).get("/estudiante");
    expect(res.statusCode).toBe(200);
    const estudiantes = res.body;
    expect(Array.isArray(estudiantes)).toBe(true);
    const estudianteCreado = estudiantes.find(e => e.idestudiante === createdEstudianteId);
    expect(estudianteCreado).toBeDefined();
    res = await request(app).get(`/estudiante/${createdEstudianteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idestudiante).toBe(createdEstudianteId);
    res = await request(app)
      .put(`/estudiante/${createdEstudianteId}`)
      .send({ nombre: "E2ETest Juan Actualizado", apep: "Perez", apem: "Lopez" });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("E2ETest Juan Actualizado");
    res = await request(app).get("/estudiante/999999");
    expect(res.statusCode).toBe(404);
    res = await request(app)
      .post("/estudiante")
      .send({ apep: "Perez" });
    expect(res.statusCode).toBe(400);
    res = await request(app).delete(`/estudiante/${createdEstudianteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Estudiante eliminado");
    res = await request(app).get(`/estudiante/${createdEstudianteId}`);
    expect(res.statusCode).toBe(404);

    createdEstudianteId = null;
  });
});
