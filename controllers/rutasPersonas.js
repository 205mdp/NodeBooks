const express = require("express");
const service = require("../services/servicePersona");
const app = express.Router();

// /api/persona
app.post("/", async (req, res) => {
    try {
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
      const respuesta = await service.Personalist();
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
      const respuesta = await service.PersonaGet(perosna_id);
      if (respuesta.lenght == 1) {
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
      var persona_id = req.params.id;
      const nombre = req.body.nombre.toUpperCase();
      const apellido = req.body.apellido.toUpperCase();
      const alias = req.body.alias.toUpperCase();
  
      if (isNaN(persona_id)) {
        throw new Error("Error inesperado el id no es un numero");
      }
      const respuesta = await service.PersonaUpdate(perosna);
      //recibe: {nombre: string, apellido: string, alias: string, email: string} el email no se puede modificar.
      const registroInertado = await conexion.query(
        "select * from persona where id=?",
        [req.params.id]
      );
      res.json(registroInertado[0]); //y el objeto modificado o
    } catch (error) {
      //"error inesperado", "no se encuentra esa persona"
      res.status(413).send({ message: error.message });
    }
  });
  
  app.delete("/:id", async (req, res) => {
    try {
      var persona_id = req.params.id;
      if (isNaN(persona_id)) {
        throw new Error("Error inesperado el id no es un numero");
      }
      const respuesta = await service.PersonaRemove(perosna_id);
      res.status(200).send({ messaje: "se borro correctamente" }); // retorna: 200 y {mensaje: "se borro correctamente"}
    } catch (error) {
      //"error inesperado", "no existe esa persona", "esa persona tiene libros asociados, no se puede eliminar"
      res.status(413).send({ message: error.message });
    }
  });
  
  