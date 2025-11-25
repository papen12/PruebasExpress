const express = require("express");
const supabaseService = require("../conexion");

const router = express.Router();
const supabase = supabaseService.getClient();

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("estudiante").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("estudiante")
    .select("*")
    .eq("idestudiante", id);

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });

  res.json(data[0]);
});

router.post("/", async (req, res) => {
  const { nombre, apep, apem } = req.body;
  if (!nombre || !apep || !apem)
    return res.status(400).json({ error: "Faltan datos" });

  const { data, error } = await supabase
    .from("estudiante")
    .insert([{ nombre, apep, apem }])
    .select(); 

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0) return res.status(500).json({ error: "No se pudo crear el estudiante" });

  res.status(201).json(data[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apep, apem } = req.body;
  if (!nombre || !apep || !apem)
    return res.status(400).json({ error: "Faltan datos" });

  const { data, error } = await supabase
    .from("estudiante")
    .update({ nombre, apep, apem })
    .eq("idestudiante", id)
    .select(); 

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });

  res.json(data[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("estudiante")
    .delete()
    .eq("idestudiante", id)
    .select(); 

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });

  res.json({ message: "Estudiante eliminado", estudiante: data[0] });
});

module.exports = router;
