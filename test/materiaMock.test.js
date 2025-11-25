const request = require("supertest");
const app = require("../app");

const mockMateria = {
  idmateria: 1,
  nombremateria: "TestMateria",
  descripcion: "Materia de prueba"
};

let createdMateriaId;

// Mock de Supabase
jest.mock("../conexion", () => {
  return {
    getClient: () => ({
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ data: [mockMateria], error: null }),
      select: jest.fn().mockResolvedValue({ data: [mockMateria], error: null }),
      eq: jest.fn().mockReturnThis(),
      update: jest.fn().mockResolvedValue({ data: [mockMateria], error: null }),
      delete: jest.fn().mockResolvedValue({ data: [mockMateria], error: null }),
      single: jest.fn().mockResolvedValue({ data: mockMateria, error: null }),
      ilike: jest.fn().mockReturnThis()
    })
  };
});

describe("CRUD Materia (Mockeado)", () => {

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

  it("GET /materia - debe retornar todas las materias", async () => {
    const res = await request(app).get("/materia");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /materia/:id - debe retornar la materia creada", async () => {
    const res = await request(app).get(`/materia/${createdMateriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idmateria).toBe(createdMateriaId);
  });

  it("PUT /materia/:id - debe actualizar la materia", async () => {
    const res = await request(app)
      .put(`/materia/${createdMateriaId}`)
      .send({
        nombremateria: "TestMateriaActualizada",
        descripcion: "Descripcion actualizada"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombremateria).toBe("TestMateria");
  });

  it("DELETE /materia/:id - debe eliminar la materia", async () => {
    const res = await request(app).delete(`/materia/${createdMateriaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.materia.idmateria).toBe(createdMateriaId);
  });

});
