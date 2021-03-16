const express = require("express");
const service = require("../services/servicePersona");
const serviceLibro = require("../services/serviceLibro");
const app = express.Router();

/*
 * POST /api/persona/
 *
 * @param {json} {nombre: string, apellido:string, alias: string, email: string}
 * @return status: 200, {json} {id: numerico, nombre: string, apellido:string, alias: string, email: string}
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "faltan datos", "el email ya se encutra registrado", "error inesperado"
 */
app.post("/", async (req, res) => {
  try {
    if (
      !req.body.nombre ||
      !req.body.apellido ||
      !req.body.alias ||
      !req.body.email
    ) {
      throw new Error("Faltan datos.");
    }
    //recibe: {nombre: string, apellido: string, alias: string, email: string} retorna:
    var persona = {
      nombre: req.body.nombre.toUpperCase(),
      apellido: req.body.apellido.toUpperCase(),
      alias: req.body.alias.toUpperCase(),
      email: req.body.email.toUpperCase(),
    };

    const emailExiste = await service.PersonaEmailExiste(persona.email);
    if (emailExiste.length > 0) {
      throw new Error("El email ya se encuentra registrado");
    }

    const respuesta = await service.PersonaAdd(persona);

    if (respuesta.insertId > 0) {
      persona.id = respuesta.insertId;
      res.status(200).send({ persona: persona });
    } else {
      throw new Error("No se pudo insertar");
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * GET /api/persona/
 *
 * @param nada.
 * @return status: 200, {json} [{id: numerico, nombre: string, apellido:string, alias: string, email: string}]
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes "error producido"
 */
app.get("/", async (req, res) => {
  try {
    const respuesta = await service.PersonaList();
    res.status(200).send(respuesta); // [{id: numerico, nombre: string, apellido: string, alias: string, email; string}]
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * GET /api/persona/:id
 *
 * @param {numero} :id
 * @return status: 200, {json} {id: numerico, nombre: string, apellido:string, alias: string, email: string}
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes : "error inesperado", "nose encuntra esa persona"
 */
app.get("/:id", async (req, res) => {
  try {
    var persona_id = req.params.id;
    if (isNaN(persona_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    const respuesta = await service.PersonaGet(persona_id);

    if (respuesta.length == 1) {
      res.status(200).send(respuesta[0]);
    } else if (respuesta.length == 0) {
      throw new Error("La persona no fue encontrada");
    }
    //  {id: numerico, nombre: string, apellido: string, alias: string, email; string}
  } catch (error) {
    // "error inesperado", "no se encuentra esa persona"
    res.status(413).send({ message: error.message });
  }
});

/*
 * PUT /api/persona/:id
 *
 * @param {json} {id: numerico}
 * @return status: 200, {json} {id: numerico ,nombre: string, apellido:string, alias: string, email: string}
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes :  "error inesperado", "no se encontro esa persona",
 */
app.put("/:id", async (req, res) => {
  try {
    var persona_id = req.params.id;
    if (isNaN(persona_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }

    if (!req.body.nombre || !req.body.apellido || !req.body.alias) {
      throw new Error("Faltan datos.");
    }
    if (req.body.email) {
      throw new Error("El email no se puede modificar.");
    }

    const persona = {
      nombre: req.body.nombre.toUpperCase(),
      apellido: req.body.apellido.toUpperCase(),
      alias: req.body.alias.toUpperCase(),
      id: persona_id,
    };

    const personaExiste = await service.PersonaGet(persona.id);

    if (personaExiste.length == 0) {
      throw new Error("No se encuentra esa persona");
    }

    const respuesta = await service.PersonaUpdate(persona);

    if (respuesta.affectedRows == 1) {
      var persona_updated = await service.PersonaGet(persona.id);
      res.status(200).send(persona_updated[0]);
    } else {
      throw new Error("Error inesperado");
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

/*
 * DELETE /api/persona/:id
 *
 * @param {numero} :id
 * @return status: 200, {json} { message: "se borro correctamente la persona"}
 * @return status: 413, {json} {mensaje: <descripcion del error>}
 * @mensajes :  "error inesperado", "no existe esa persona",
 *              "esa persona tiene libros asociados, no se puede eliminar"
 */
app.delete("/:id", async function (req, res) {
  try {
    var persona_id = req.params.id;
    if (isNaN(persona_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }

    const persona_data = await service.PersonaGet(persona_id);
    if (persona_data.length == 1) {
      const libroPrestad = await serviceLibro.libroPrestadoPorPersona(
        persona_id
      );
      if (libroPrestad.length != 0) {
        throw new Error(
          "Esa persona tiene libros asociados, no se puede eliminar"
        );
      } else {
        const respuesta = await service.PersonaRemove(persona_id);
        if (respuesta.affectedRows == 1) {
          res
            .status(200)
            .send({ mensaje: "Se borro correctamente la persona" });
        } else {
          throw new Error("Error inesperado.");
        }
      }
    } else {
      throw new Error("No existe esa persona.");
    }
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

module.exports = app;
