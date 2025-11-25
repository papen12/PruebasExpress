const request = require("supertest");
const app = require("../app");

const mockData = {
  idestudiante: 1,
  nombre: "Juan",
  apep: "Perez",
  apem: "Lopez"
};

let createdStudentId;

// Mock de supabase
jest.mock("../conexion", () => {
  return {
    getClient: () => ({
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ data: [mockData], error: null }),
      select: jest.fn().mockResolvedValue({ data: [mockData], error: null }),
      eq: jest.fn().mockReturnThis(),
      update: jest.fn().mockResolvedValue({ data: [mockData], error: null }),
      delete: jest.fn().mockResolvedValue({ data: null, error: null }),
      single: jest.fn().mockResolvedValue({ data: mockData, error: null })
    })
  };
});

describe("CRUD Estudiante (Mockeado)", () => {

  it("Debe crear un estudiante", async () => {
    const res = await request(app)
      .post("/estudiante")
      .send({ nombre: "Juan", apep: "Perez", apem: "Lopez" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("idestudiante");
    expect(res.body.nombre).toBe("Juan");

    createdStudentId = res.body.idestudiante;
  });

  it("Debe obtener todos los estudiantes", async () => {
    const res = await request(app).get("/estudiante");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Debe obtener un estudiante por ID", async () => {
    const res = await request(app).get(`/estudiante/${createdStudentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idestudiante).toBe(createdStudentId);
  });

  it("Debe actualizar un estudiante", async () => {
    const res = await request(app)
      .put(`/estudiante/${createdStudentId}`)
      .send({ nombre: "Juan Actualizado", apep: "Perez", apem: "Lopez" });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Juan");
  });

  it("Debe eliminar un estudiante", async () => {
    const res = await request(app).delete(`/estudiante/${createdStudentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

});
