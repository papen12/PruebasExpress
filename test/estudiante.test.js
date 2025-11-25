
const request = require("supertest");
const app = require("../app"); 

let createdStudentId;

describe("CRUD Estudiante", () => {

  // POST: Crear un estudiante
  it("Debe crear un estudiante", async () => {
    const res = await request(app)
      .post("/estudiante")
      .send({ nombre: "Juan", apep: "Perez", apem: "Lopez" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("idestudiante");
    expect(res.body.nombre).toBe("Juan");
    expect(res.body.apep).toBe("Perez");
    expect(res.body.apem).toBe("Lopez");

    createdStudentId = res.body.idestudiante;
  });

  // GET: Obtener todos los estudiantes
  it("Debe obtener todos los estudiantes", async () => {
    const res = await request(app).get("/estudiante");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET: Obtener estudiante por ID
  it("Debe obtener un estudiante por ID", async () => {
    const res = await request(app).get(`/estudiante/${createdStudentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idestudiante).toBe(createdStudentId);
    expect(res.body.nombre).toBe("Juan");
    expect(res.body.apep).toBe("Perez");
    expect(res.body.apem).toBe("Lopez");
  });

  // PUT: Actualizar estudiante
  it("Debe actualizar un estudiante", async () => {
    const res = await request(app)
      .put(`/estudiante/${createdStudentId}`)
      .send({ nombre: "Juan Actualizado", apep: "Perez", apem: "Lopez" });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Juan Actualizado");
    expect(res.body.apep).toBe("Perez");
    expect(res.body.apem).toBe("Lopez");
  });

  // DELETE: Eliminar estudiante
  it("Debe eliminar un estudiante", async () => {
    const res = await request(app).delete(`/estudiante/${createdStudentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Estudiante eliminado");
  });

  // GET: Verificar que ya no existe
  it("Debe devolver 404 al buscar estudiante eliminado", async () => {
    const res = await request(app).get(`/estudiante/${createdStudentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Estudiante no encontrado");
  });

});
