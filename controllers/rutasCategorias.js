const express = require("express");
const service = require("../services/serviceCategoria");
const app = express.Router();

// Post Add Categoria. api/categoria
app.post("/", async (req, res) => {
  try {
    // TODO
  } catch (error) {
    console.log(error);
    // console.log(error);
    if (error.code == "ER_DUP_ENTRY") {
      res.status(413).send({ message: "Ese nombre de categoria ya existe" });
    }
    // TODO puede ser: "faltan datos", "ese nombre de categoria ya existe", "error inesperado"
    res.status(413).send({ message: error.message });
  }
});

// GET api/Categoria
app.get("/", async (req, res) => {
  try {
    // TODO
    // res.status(200).send("TODO Categoria"); //  [{id:numerico, nombre:string}]
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    //res.status(200).send(respuesta); //   {id: numerico, nombre:string}
  } catch (error) {
    // ser: "error inesperado", "categoria no encontrada"
    res.status(413).send({ message: error.message });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    //console.log(respuesta);
  } catch (error) {
    // er: "error inesperado", "categoria con libros asociados, no se puede eliminar", "no existe la categoria indicada"
    res.status(413).send({ message: error.message });
  }
});

module.exports = app;
