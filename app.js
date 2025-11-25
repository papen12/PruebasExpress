const express = require("express");
const estudianteRouter = require("./routes/estudiante");
const materiaRouter=require('./routes/materias')
const tareaRouter=require('./routes/tarea')

const app = express();
app.use(express.json());
app.use("/estudiante", estudianteRouter);
app.use("/materia",materiaRouter)
app.use("/tarea",tareaRouter)

app.get("/", (req, res) => res.send("Servidor Express funcionando"));

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));

module.exports = app;
