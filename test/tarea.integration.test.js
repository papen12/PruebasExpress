const request = require("supertest");
const app = require("../app");
const supabaseService = require("../conexion");
const supabase = supabaseService.getClient();

let createdTareaId;

describe("Integración completa CRUD Tarea", () => {

  // Limpiar cualquier tarea de prueba antes de todo
  beforeAll(async () => {
    await supabase
      .from("tarea")
      .delete()
      .ilike("nombretarea", "TestTareaIntegracion%");
  });

  // Limpiar después de todos los tests
  afterAll(async () => {
    if (createdTareaId) {
      await supabase.from("tarea").delete().eq("idtarea", createdTareaId);
    }
  });

  test("POST /tarea - Crear tarea", async () => {
    const res = await request(app)
      .post("/tarea")
      .send({
        nombretarea: "TestTareaIntegracion1",
        descripcion: "Tarea integración",
        estadotarea: "pendiente",
        notatarea: 80,
        fechaasignacion: "2025-11-25",
        fechaentrega: "2025-11-30",
        idestudiante: 1,
        idmateria: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombretarea).toBe("TestTareaIntegracion1");
    createdTareaId = res.body.idtarea;
  });

  test("GET /tarea - Listar tareas", async () => {
    const res = await request(app).get("/tarea");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const tarea = res.body.find(t => t.idtarea === createdTareaId);
    expect(tarea).toBeDefined();
  });

  test("GET /tarea/:id - Obtener tarea por id", async () => {
    const res = await request(app).get(`/tarea/${createdTareaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idtarea).toBe(createdTareaId);
    expect(res.body.nombretarea).toBe("TestTareaIntegracion1");
  });

  test("PUT /tarea/:id - Actualizar tarea", async () => {
    const res = await request(app)
      .put(`/tarea/${createdTareaId}`)
      .send({
        nombretarea: "TestTareaIntegracionActualizada",
        descripcion: "Descripcion actualizada integración",
        estadotarea: "completada",
        notatarea: 100,
        fechaasignacion: "2025-11-25",
        fechaentrega: "2025-12-01",
        idestudiante: 1,
        idmateria: 1
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombretarea).toBe("TestTareaIntegracionActualizada");
    expect(res.body.estadotarea).toBe("completada");
  });

  test("DELETE /tarea/:id - Eliminar tarea", async () => {
    const res = await request(app).delete(`/tarea/${createdTareaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.tarea.idtarea).toBe(createdTareaId);
    createdTareaId = null;
  });

});
