const express = require("express");
const service = require("../services/serviceCategoria");
const libroService = require("../services/serviceLibro");
const app = express.Router();

/*
 * POST /api/categoria/
 *
 * @param {json} {nombre: string}
 * @return status: 200, {json} {id: numerico, nombre: string}
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "faltan datos", "ese nombre de categoria ya existe", "error inesperado"
 */
app.post("/", async (req, res) => {
  try {
    // verificamos que envie nombre
    if (!req.body.nombre) {
      throw new Error("Faltan datos de la categoria.");
    }
    var categoria = {
      nombre: req.body.nombre.toUpperCase(),
    };
    // Tambien lo verifica con el duplicate de la DB.
    const categoriaExiste = await service.categoriaExiste(categoria.nombre);

    if (categoriaExiste.length > 0) {
      throw new Error("ese nombre de categoria ya existe");
    }
    const respuesta = await service.categoriasAdd(categoria);

    if (respuesta.insertId > 0) {
      categoria.id = respuesta.insertId;
      res.status(200).send(categoria);
    } else {
      throw new Error("Error inesperado.");
    }
  } catch (error) {
    // Verifica duplicado con la base de datos por posible error.
    if (error.code == "ER_DUP_ENTRY") {
      res.status(413).send({ message: "Ese nombre de categoria ya existe" });
    }
    res.status(413).send({ message: error.message });
  }
});

/*
 * GET /api/categoria/
 *
 * @param nada.
 * @return status: 200, {json} [{id:numerico, nombre:string}]
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "error producido"
 */
app.get("/", async (req, res) => {
  try {
    const respuesta = await service.categoriasList();
    res.status(200).send(respuesta);
  } catch (error) {
    res.status(413).send([]);
    // res.status(413).send({ message: error.message });
  }
});

/*
 * GET /api/categoria/:id
 *
 * @param {numero} :id
 * @return status: 200, {json} {id:numerico, nombre:string}
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes : "error inesperado", "categoria no encontrada"
 */
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
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * DELETE /api/categoria/:id
 *
 * @param {numero} :id
 * @return status: 200, {json} { message: "se borro el registro"}
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes :  "error inesperado", "categoria con libros asociados, no se puede eliminar",
 *              "no existe la categoria indicada"
 */
app.delete("/:id", async (req, res) => {
  try {
    var categoria_id = req.params.id;
    if (isNaN(categoria_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }

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
          .send({ message: "se borro el registro " + categoria_id });
      } else {
        throw new Error("Error inesperado");
      }
    } else {
      throw new Error("No existe la categoria indicada");
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

module.exports = app;
