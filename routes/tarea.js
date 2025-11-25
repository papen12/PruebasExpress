const express = require("express");
const supabaseService = require("../conexion");

const router = express.Router();
const supabase = supabaseService.getClient();

// GET todas las tareas
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("tarea").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET tarea por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("tarea")
    .select("*")
    .eq("idtarea", id);

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Tarea no encontrada" });

  res.json(data[0]);
});

// POST crear nueva tarea
router.post("/", async (req, res) => {
  const { nombretarea, descripcion, estadotarea, notatarea, fechaasignacion, fechaentrega, idestudiante, idmateria } = req.body;

  if (!nombretarea || !idestudiante || !idmateria)
    return res.status(400).json({ error: "Faltan datos obligatorios" });

  const { data, error } = await supabase
    .from("tarea")
    .insert([{
      nombretarea,
      descripcion,
      estadotarea,
      notatarea,
      fechaasignacion,
      fechaentrega,
      idestudiante,
      idmateria
    }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(500).json({ error: "No se pudo crear la tarea" });

  res.status(201).json(data[0]);
});

// PUT actualizar tarea por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombretarea, descripcion, estadotarea, notatarea, fechaasignacion, fechaentrega, idestudiante, idmateria } = req.body;

  if (!nombretarea || !idestudiante || !idmateria)
    return res.status(400).json({ error: "Faltan datos obligatorios" });

  const { data, error } = await supabase
    .from("tarea")
    .update({
      nombretarea,
      descripcion,
      estadotarea,
      notatarea,
      fechaasignacion,
      fechaentrega,
      idestudiante,
      idmateria
    })
    .eq("idtarea", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Tarea no encontrada" });

  res.json(data[0]);
});

// DELETE tarea por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("tarea")
    .delete()
    .eq("idtarea", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Tarea no encontrada" });

  res.json({ message: "Tarea eliminada", tarea: data[0] });
});

module.exports = router;
