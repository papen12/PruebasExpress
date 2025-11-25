const express = require("express");
const supabaseService = require("../conexion");

const router = express.Router();
const supabase = supabaseService.getClient();

// GET todos los materias
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("materia").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET materia por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("materia")
    .select("*")
    .eq("idmateria", id);

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Materia no encontrada" });

  res.json(data[0]);
});

// POST crear nueva materia
router.post("/", async (req, res) => {
  const { nombremateria, descripcion } = req.body;
  if (!nombremateria)
    return res.status(400).json({ error: "Faltan datos" });

  const { data, error } = await supabase
    .from("materia")
    .insert([{ nombremateria, descripcion }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(500).json({ error: "No se pudo crear la materia" });

  res.status(201).json(data[0]);
});

// PUT actualizar materia por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombremateria, descripcion } = req.body;
  if (!nombremateria)
    return res.status(400).json({ error: "Faltan datos" });

  const { data, error } = await supabase
    .from("materia")
    .update({ nombremateria, descripcion })
    .eq("idmateria", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Materia no encontrada" });

  res.json(data[0]);
});

// DELETE eliminar materia por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("materia")
    .delete()
    .eq("idmateria", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Materia no encontrada" });

  res.json({ message: "Materia eliminada", materia: data[0] });
});

module.exports = router;
