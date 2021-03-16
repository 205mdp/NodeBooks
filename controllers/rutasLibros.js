const express = require("express");
const service = require("../services/serviceLibro");
const serviceCategoria = require("../services/serviceCategoria");
const servicePersona = require("../services/servicePersona");

const app = express.Router();

/*
 * POST /api/libro/
 *
 * @param {json} {nombre: string, descripcion: string, categoria_id: numerico, personas_id: numerico/null }
 * @return status: 200, {json} {id: numerico, nombre: string, descripcion: string, categoria_id: numerico, personas_id: numerico/null }
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "ese libro ya existe", "nombre y categoria son datos obligatorios", "no existe la categoria indicada", "no existe la persona indicada", "error inesperado"
 */
app.post("/", async function (req, res) {
  try {
    if (!req.body.nombre || !req.body.categoria_id) {
      throw new Error("Los campos nombre y categoria son obligarios.");
    }
  
    var libro = {
      nombre: req.body.nombre.toUpperCase(),
      descripcion: !req.body.descripcion
        ? null
        : req.body.descripcion.toUpperCase(),
      categoria_id: req.body.categoria_id,
      persona_id: !req.body.persona_id ? null : req.body.persona_id,
    };

    const libroOk = await service.libroFindNombre(libro.nombre);

    if (libroOk[0].idCount > 0) {
      throw new Error("El libro ya existe");
    }

    const cateok = await serviceCategoria.categoriaExisteById(
      libro.categoria_id
    );
    if (cateok[0].idCount == 0) {
      throw new Error("No existe la categoria indicada");
    }

    if (libro.persona_id != null) {
      const personaOk = await servicePersona.PersonaGet(libro.persona_id);
      if (personaOk.length == 0) {
        throw new Error("No existe la persona indicada.");
      }
    }

    const respuesta = await service.librosAdd(libro);
    if (respuesta.insertId > 0) {
      libro.id = respuesta.insertId;
      res.status(200).send(libro);
    } else {
      throw new Error("Error inesperado");
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * GET /api/libro
 *
 * @return status: 200, {json} [{id: numerico, nombre: string, descripcion: string, categoria_id: numerico, personas_id: numerico/null }]
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "error inesperado"
 *
 */
app.get("/", async function (req, res) {
  try {
    const respuesta = await service.librosList();
    res.status(200).send(respuesta);
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * GET /api/libro/:id
 *
 * @param {json} {id: numerico}
 * @return status: 200, {json} {id: numerico, nombre: string, descripcion: string, categoria_id: numerico, personas_id: numerico/null }
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "no se encuentra el libro", "error inesperado"
 */
app.get("/:id", async function (req, res) {
  try {

    var libro_id = req.params.id;
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }

    const respuesta = await service.librosGet(libro_id);
    if (respuesta.length == 1) {
      res.status(200).send(respuesta[0]);
    } else if (respuesta.length == 0) {
      throw new Error("El libro no existe.");
    } else {
      throw new Error("Error inesperado.");
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * PUT /api/libro/:id
 *
 * @param {json} {id: numerico}
 * @return status: 200, {json} {id: numerico, nombre: string, descripcion: string, categoria_id: numerico, personas_id: numerico/null }
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "solo se puede modificar la descripcion del libro", "error inesperado"
 */
app.put("/:id", async function (req, res) {
  try {
    const libro_id = req.params.id;
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    if (!req.body.descripcion) {
      throw new Error("Debe enviar la descripción");
    }
    const descripcion = req.body.descripcion;

    //if (Object.keys(req.body).length > 1) {
    //  throw new Error("Solo se puede modificar la descripcion del libro.");
    //}

    const libro = {
      id: libro_id,
      descripcion: descripcion,
    };
    const respuesta = await service.librosUpdate(libro);

    if (respuesta.affectedRows == 1) {
      const libro_data = await service.librosGet(libro.id);
      if (libro_data.length == 1) {
        res.status(200).send(libro_data[0]);
      } else {
        throw new Error("Error inesperado.");
      }
    } else {
      throw new Error("Error inesperado.");
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * PUT /api/libro/prestar/:id
 *
 * @param {json} {id: numerico, persona_id: numerico}
 * @return status: 200, {json} {mensaje: "se presto correctamente" }
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva", "no se encontro el libro",
 * "no se encontrola persona a la que se quiere prestar el libro", "error inesperado"
 */
app.put("/prestar/:id", async function (req, res) {
  try {
    const libro_id = req.params.id;
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    if (!req.body.persona_id) {
      throw new Error("Debe enviar a quien le presta el libro ");
    }
    const persona_id = req.body.persona_id;

    const libro_data = await service.librosGet(libro_id);

    if (libro_data.length == 1) {
      if (libro_data[0].persona_id != null) {
        throw new Error(
          "El libro ya esta prestado, no se puede prestar hasta que no se devuelva"
        );
      }
    } else {
      throw new Error("No se encontro el libro.");
    }

    const persona = await servicePersona.PersonaGet(persona_id);

    if (persona.length != 1) {
      throw new Error(
        "no se encontro la persona a la que se quiere prestar el libro"
      );
    } else {
      var libro = {
        persona_id: persona_id,
        id: libro_id,
      };
      const respuesta = await service.librosPrestar(libro);

      if (respuesta.affectedRows == 1) {
        res.status(200).send({ mensaje: "se presto correctamente" });
      } else {
        throw new Error("Error inesperado");
      }
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * PUT /api/libro/devolver/:id
 *
 * @param {json} {id: numerico}
 * @return status: 200, {json} {mensaje: "se realizo la devolucion correctamente" }
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "ese libro no esta prestado", "ese libro no existe", "error inesperado"
 */
app.put("/devolver/:id", async function (req, res) {
  try {
    const libro_id = req.params.id;
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }

    const libro_data = await service.librosGet(libro_id);

    if (libro_data.length == 1) {
      if (libro_data[0].persona_id == null) {
        throw new Error("El libro no estaba prestado");
      }
    } else {
      throw new Error("No se encontro el libro.");
    }

    var libro = {
      persona_id: null,
      id: libro_id,
    };
    const respuesta = await service.librosPrestar(libro);
    
    if (respuesta.affectedRows == 1) {
      res.status(200).send({ mensaje: "se devolvio correctamente" });
    } else {
      throw new Error("Error inesperado");
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * DELETE /api/libro/:id
 *
 * @param {json} {id: numerico}
 * @return status: 200, {json} {mensaje: "se borro correctamente" }
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "nose encuentra ese libro", "ese libro esta prestado no se puede borrar","error inesperado"
 */
app.delete("/:id", async function (req, res) {
  try {
    const libro_id = req.params.id;
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }

    const libro_data = await service.librosGet(libro_id);
    if (libro_data.length == 1) {
      if (libro_data[0].persona_id != null) {
        throw new Error("El libro esta prestado no se puede borrar");
      } else {
        const respuesta = await service.librosRemove(libro_id);
        if (respuesta.affectedRows == 1) {
          res.status(200).send({ mensaje: "Se borro correctamente el libro" });
        } else {
          throw new Error("Error inesperado.");
        }
      }
    } else {
      throw new Error("No se encontro ese libro.");
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

module.exports = app;
