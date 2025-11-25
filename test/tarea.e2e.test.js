const request = require("supertest");
const app = require("../app");
const supabaseService = require("../conexion");
const supabase = supabaseService.getClient();

let createdTareaId;

describe("E2E pruebas Tarea", () => {

  // Limpiar cualquier tarea de prueba antes de todo
  beforeAll(async () => {
    await supabase
      .from("tarea")
      .delete()
      .ilike("nombretarea", "E2ETarea%");
  });

  // Limpiar después de todos los tests
  afterAll(async () => {
    if (createdTareaId) {
      await supabase.from("tarea").delete().eq("idtarea", createdTareaId);
    }
  });

  test("Flujo completo: crear, listar, obtener, actualizar y eliminar tarea", async () => {
    let res = await request(app)
      .post("/tarea")
      .send({
        nombretarea: "E2ETarea1",
        descripcion: "Tarea E2E prueba",
        estadotarea: "pendiente",
        notatarea: 85,
        fechaasignacion: "2025-11-25",
        fechaentrega: "2025-11-30",
        idestudiante: 1,
        idmateria: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombretarea).toBe("E2ETarea1");
    createdTareaId = res.body.idtarea;

    res = await request(app).get("/tarea");
    expect(res.statusCode).toBe(200);
    const tareaList = res.body;
    expect(Array.isArray(tareaList)).toBe(true);
    const tareaCreada = tareaList.find(t => t.idtarea === createdTareaId);
    expect(tareaCreada).toBeDefined();
    res = await request(app).get(`/tarea/${createdTareaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idtarea).toBe(createdTareaId);
    res = await request(app)
      .put(`/tarea/${createdTareaId}`)
      .send({
        nombretarea: "E2ETareaActualizada",
        descripcion: "Actualizada E2E",
        estadotarea: "completada",
        notatarea: 100,
        fechaasignacion: "2025-11-25",
        fechaentrega: "2025-12-01",
        idestudiante: 1,
        idmateria: 1
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombretarea).toBe("E2ETareaActualizada");
    expect(res.body.estadotarea).toBe("completada");
    res = await request(app).get("/tarea/999999");
    expect(res.statusCode).toBe(404);
    res = await request(app)
      .post("/tarea")
      .send({ descripcion: "Sin nombre ni ids" });
    expect(res.statusCode).toBe(400);
    res = await request(app).delete(`/tarea/${createdTareaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.tarea.idtarea).toBe(createdTareaId);

    createdTareaId = null;
  });
});
