const express = require("express");
const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Servidor Express funcionando ");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
