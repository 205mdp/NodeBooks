const express = require("express");
const { PersonaAdd, PersonaList } = require("../models/modelPersona");
const service = require("../services/servicePersona");
const serviceLibro = require("../services/serviceLibro");
const app = express.Router();

// /api/persona
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

    const respuesta = await service.PersonaAdd(persona);
    console.log(respuesta);
    if (respuesta.insertId > 0) {
      persona.id = respuesta.insertId;
      console.log(persona);
      res.status(200).send({ persona: persona }); //    {mensaje: "se borro correctamente"}
    } else {
      throw new Error("No se pudo insertar");
    }
    console.log(persona);
    //res.status(200).send({ persona });
  } catch (error) {
    // ser: "faltan datos", "el email ya se encuentra registrado", "error inesperado"
    res.status(413).send({ message: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const respuesta = await service.PersonaList();
    res.status(200).send(respuesta); // [{id: numerico, nombre: string, apellido: string, alias: string, email; string}]
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    var persona_id = req.params.id;
    if (isNaN(persona_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    console.log("aca llegue " + persona_id);
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

app.put("/:id", async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.apellido || !req.body.alias) {
      throw new Error("Faltan datos.");
    }
    if (req.body.email) {
      throw new Error("El email no se puede modificar.");
    }
    var persona_id = req.params.id;
    const persona = {
      nombre: req.body.nombre.toUpperCase(),
      apellido: req.body.apellido.toUpperCase(),
      alias: req.body.alias.toUpperCase(),
      id: persona_id,
    };
    // TODO verificar si la persona existe.

    // TODO
    if (isNaN(persona_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    const respuesta = await service.PersonaUpdate(persona);
    console.log(respuesta);
    //recibe: {nombre: string, apellido: string, alias: string, email: string} el email no se puede modificar.
    if (respuesta.affectedRows == 1) {
      var persona_updated = await service.PersonaGet(persona.id);

      res.status(200).send(persona_updated[0]);
    } else {
      throw new Error("Error inesperado");
    }
    //y el objeto modificado o
  } catch (error) {
    //"error inesperado", "no se encuentra esa persona"
    res.status(413).send({ message: error.message });
  }
});

app.delete("/:id", async function (req, res) {
  try {
    var persona_id = req.params.id;
    if (isNaN(persona_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    
      const persona_data = await service.PersonaGet(persona_id); 
      if (persona_data.length == 1 ) {
        const libroprestado = await serviceLibro.libroPrestadoPorPersona(persona_id);
        if ( libroprestado.affectedRows == 1){
          throw new Error("El libro esta prestado no se puede borrar");
        } else {
          //const respuesta = await service.PersonaRemove(persona_id);
          if (respuesta.affectedRows == 1) {
            res.status(200).send({ mensaje: "Se borro correctamente la persona" });
          } else {
            throw new Error("Error inesperado.");
          }
        }
      } else {
        throw new Error("No se encontro la persona.");
      }
      //  {mensaje: "se borro correctamente"}
    } catch (error) {
      res.status(413).send({ message: error.message });
    }
  });
     

module.exports = app;
