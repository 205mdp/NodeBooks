/*
 * TRABAJO PRACTIVO CURSO UTN 03/2021
 *
 * Profesores: Ing. Orlando F. Brea y Lorena R. Izzo
 * Alumnos:
 *   Maza Gabriel 
 *   Camean Fenoy Juan Pablo 
 *   Paak Jorge German
 *   Cammarota Federico 
 *   Casquero Ricardo 
 *   Damiani Juan 
 */
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

// Rutas Api.
app.use("/api/categoria", rutasCategorias);
app.use("/api/persona", rutasPersonas);
app.use("/api/libro", rutasLibros);

app.listen(PORT, () => {
  console.log("la app esta corriendo en localhost:" + PORT);
});
