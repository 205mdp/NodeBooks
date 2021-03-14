const express = require("express");
const cors = require("cors");
const rutasCategorias = require("./controllers/rutasCategorias");
const rutasPersonas = require("./controllers/rutasPersonas");
const rutasLibros = require("./controllers/rutasLibros");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT ? process.env.PORT : 3000;

app.get("/", function (req, res) {
  try {
    res.send(
      "Este es un proyecto para el curso de la UTN por favor leer el Readmi."
    );
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

app.use("/api/categoria", rutasCategorias);
app.use("/api/persona", rutasPersonas);
app.use("/api/libro", rutasLibros);

app.listen(PORT, () => {
  console.log("la app esta corriendo en localhost:" + PORT);
});
