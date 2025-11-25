const request = require("supertest");
const app = require("../app");
const supabaseService = require("../conexion");
const supabase = supabaseService.getClient();

let createdTareaId;

// Limpiar datos de prueba antes de iniciar
beforeAll(async () => {
  await supabase
    .from("tarea")
    .delete()
    .ilike("nombretarea", "TestTarea%");
});

describe("CRUD Tarea", () => {

  it("POST /tarea - debe crear una tarea", async () => {
    const res = await request(app)
      .post("/tarea")
      .send({
        nombretarea: "TestTarea1",
        descripcion: "Tarea de prueba",
        estadotarea: "pendiente",
        notatarea: 95,
        fechaasignacion: "2025-11-25",
        fechaentrega: "2025-11-30",
        idestudiante: 1,
        idmateria: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombretarea).toBe("TestTarea1");
    createdTareaId = res.body.idtarea;
  });

  it("GET /tarea - debe retornar todas las tareas", async () => {
    const res = await request(app).get("/tarea");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const tarea = res.body.find(t => t.idtarea === createdTareaId);
    expect(tarea).toBeDefined();
  });

  it("GET /tarea/:id - debe retornar la tarea creada", async () => {
    const res = await request(app).get(`/tarea/${createdTareaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idtarea).toBe(createdTareaId);
  });

  it("PUT /tarea/:id - debe actualizar la tarea", async () => {
    const res = await request(app)
      .put(`/tarea/${createdTareaId}`)
      .send({
        nombretarea: "TestTareaActualizada",
        descripcion: "Descripcion actualizada",
        estadotarea: "completada",
        notatarea: 100,
        fechaasignacion: "2025-11-25",
        fechaentrega: "2025-12-01",
        idestudiante: 1,
        idmateria: 1
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombretarea).toBe("TestTareaActualizada");
    expect(res.body.estadotarea).toBe("completada");
  });

  it("DELETE /tarea/:id - debe eliminar la tarea", async () => {
    const res = await request(app).delete(`/tarea/${createdTareaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.tarea.idtarea).toBe(createdTareaId);
  });

});
 
