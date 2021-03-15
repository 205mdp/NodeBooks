const express = require("express");
const service = require("../services/serviceCategoria");
const libroService = require("../services/serviceLibro");
const app = express.Router();

// Post Add Categoria. api/categoria
app.post("/", async (req, res) => {
  try {
    console.log(req.body.nombre);
    if (!req.body.nombre) {
      throw new Error("Faltan datos de la categoria.");
    }
    var categoria = {
      nombre: req.body.nombre.toUpperCase(),
    };
    const respuesta = await service.categoriasAdd(categoria);

    if (respuesta.insertId > 0) {
      categoria.id = respuesta.insertId;
      // res.status(200).send({ id: respuesta.insertId, nombre: categoria.nombre });
      res.status(200).send(categoria);
    } else {
      throw new Error("Error inesperado.");
    }
  } catch (error) {
    // console.log(error);
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
    const respuesta = await service.categoriasList();

    res.status(200).send(respuesta);

    // res.status(200).send("TODO Categoria"); //  [{id:numerico, nombre:string}]
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    var categoria_id = req.params.id;
    if (isNaN(categoria_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    const respuesta = await service.categoriasGet(categoria_id);
    if (respuesta.length == 1) {
      res.status(200).send(respuesta[0]);
    } else if (respuesta.length == 0) {
      throw new Error("La categoria no fue encontrada");
    } else {
      throw new Error("Error inesperado");
    }
    //res.status(200).send(respuesta); //   {id: numerico, nombre:string}
  } catch (error) {
    // ser: "error inesperado", "categoria no encontrada"
    res.status(413).send({ message: error.message });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    // console.log("Catagoria por id" + req.params.id);
    var categoria_id = req.params.id;
    if (isNaN(categoria_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }

    // const librosCategoria = await libroService.librosConCategoria(categoria_id);
    const librosCategoria = await libroService.librosContarCategoria(
      categoria_id
    );
    if (librosCategoria[0].cantidad > 0) {
      throw new Error(
        `Categoria con ${librosCategoria[0].cantidad} libros asociados, no se puede eliminar`
      );
    }

    var catExiste = await service.categoriasGet(categoria_id);

    if (catExiste.length != 0) {
      const respuesta = await service.categoriasRemove(categoria_id);
      if (respuesta.affectedRows == 1) {
        res
          .status(200)
          .send({ message: "se borro el registro " + categoria_id }); //    {mensaje: "se borro correctamente"}
      } else {
        throw new Error("Error inesperado");
      }
    } else {
      throw new Error("No existe la categoria indicada");
    }
    //console.log(respuesta);
  } catch (error) {
    // er: "error inesperado", "categoria con libros asociados, no se puede eliminar", "no existe la categoria indicada"
    res.status(413).send({ message: error.message });
  }
});

module.exports = app;
