"use strict";
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const util = require("util");

const app = express();
// Test juan prueba
app.use(cors());
app.use(express.urlencoded({ extended: true }));

var conexion = require("./db");

app.get("/", function (req, res) {
  try {
    res.send("Hola UTN");
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

// Login /

// Categoria
// No se debe implementar el PUT
app.post("/categoria", async (req, res) => {
  try {
    const nombre = req.body.nombre; // Hacer verificacion de la categoria.

    const respuesta = await conexion.query(
      "INSERT INTO categoria (nombre) values (?)",
      [nombre]
    );
    if (respuesta.insertId > 0) {
      res
        .status(200)
        .send({ message: "Se inserto el id " + respuesta.insertId.toString() });
    } else {
      // TODO
    }
    // console.log(respuesta);
    // recibe: {nombre: string}
    // {id: numerico, nombre: string}
  } catch (error) {
    // console.log(error);
    if (error.code == "ER_DUP_ENTRY") {
      res.status(413).send({ message: "Ese nombre de categoria ya existe" });
    }
    // TODO puede ser: "faltan datos", "ese nombre de categoria ya existe", "error inesperado"
    res.status(413).send({ message: error.message });
  }
});

app.get("/categoria", async (req, res) => {
  try {
    // console.log("Categoria");
    const respuesta = await conexion.query("SELECT * FROM categoria");

    res.status(200).send(respuesta);

    // res.status(200).send("TODO Categoria"); //  [{id:numerico, nombre:string}]
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

app.get("/categoria/:id", async (req, res) => {
  try {
    // console.log("Catagoria por id" + req.params.id);
    var categoria_id = req.params.id;
    if (isNaN(categoria_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    const respuesta = await conexion.query(
      "SELECT id, nombre FROM categoria WHERE id=?",
      [categoria_id]
    );
    if (respuesta.length == 1) {
      res.status(200).send(respuesta[0]);
    } else if (respuesta.length == 0) {
      throw new Error("La categoria no fue encontrada");
    }
    //res.status(200).send(respuesta); //   {id: numerico, nombre:string}
  } catch (error) {
    // ser: "error inesperado", "categoria no encontrada"
    res.status(413).send({ message: error.message });
  }
});

app.delete("/categoria/:id", async (req, res) => {
  try {
    // console.log("Catagoria por id" + req.params.id);
    var categoria_id = req.params.id;
    if (isNaN(categoria_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    const respuesta = await conexion.query("DELETE FROM categoria WHERE id=?", [
      categoria_id,
    ]);
    if (respuesta.affectedRows == 1) {
      res.status(200).send({ message: "se borro el registro " + categoria_id }); //    {mensaje: "se borro correctamente"}
    }
    //console.log(respuesta);
  } catch (error) {
    // er: "error inesperado", "categoria con libros asociados, no se puede eliminar", "no existe la categoria indicada"
    res.status(413).send({ message: error.message });
  }
});

// Persona
app.post("/persona", async (req, res) => {
  try {
    //recibe: {nombre: string, apellido: string, alias: string, email: string} retorna:
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const alias = req.body.alias;
    const email = req.body.email;
    var persona = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      alias: req.body.alias,
      email: req.body.email,
    };
    const respuesta = await conexion.query(
      "INSERT INTO persona (nombre, apellido, alias, email) values (?, ?, ?, ?)",
      [nombre, apellido, alias, email]
    );
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

app.get("/persona", async (req, res) => {
  try {
    const respuesta = await conexion.query("SELECT * FROM persona");
    res.status(200).send(respuesta); // [{id: numerico, nombre: string, apellido: string, alias: string, email; string}]
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

app.get("/persona/:id", async (req, res) => {
  try {
    var persona_id = req.params.id;
    if (isNaN(persona_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    const respuesta = await conexion.query("SELECT * FROM persona WHERE id=?", 
      [persona_id,]
    );
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

app.put("/persona/:id", async (req, res) => {
  try {
    var persona_id = req.params.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const alias = req.body.alias;
    
    if (isNaN(persona_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }  
    const respuesta = await conexion.query(
      "UPDATE persona SET nombre=?, apellido=?, alias=? WHERE id=?", 
      [nombre, apellido, alias, persona_id]
    );
    //recibe: {nombre: string, apellido: string, alias: string, email: string} el email no se puede modificar.
    const registroInertado = await conexion.query('select * from persona where id=?', [req.params.id]);
    res.json(registroInertado[0]); //y el objeto modificado o
  } catch (error) {
    //"error inesperado", "no se encuentra esa persona"
    res.status(413).send({ message: error.message });
  }
});

app.delete("/persona/:id", async (req, res) => {
  try {
    var persona_id = req.params.id;
    if (isNaN(persona_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    const respuesta = await conexion.query(
      "DELETE FROM persona WHERE id=?",
      [persona_id]
    );
    res.status(200).send({messaje: "se borro correctamente"}); // retorna: 200 y {mensaje: "se borro correctamente"}
  } catch (error) {
    //"error inesperado", "no existe esa persona", "esa persona tiene libros asociados, no se puede eliminar"
    res.status(413).send({ message: error.message });
  }
});

// Libro

app.post("/libro", function (req, res) {
  try {
    //ecibe: {nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
    res.status(200).send({ message: error.message }); // {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
  } catch (error) {
    // "error inesperado", "ese libro ya existe", "nombre y categoria son datos obligatorios", "no existe la categoria indicada", "no existe la persona indicada"
    res.status(413).send({ message: error.message });
  }
});

app.get("/libro", function (req, res) {
  try {
    res.status(200).send("TODO"); //  [{id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}]
  } catch (error) {
    //  "error inesperado"
    res.status(413).send({ message: error.message });
  }
});

app.get("/libro/:id", function (req, res) {
  try {
    res.status(200).send("TODO"); // {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
  } catch (error) {
    // "error inesperado", "no se encuentra ese libro"
    res.status(413).send({ message: error.message });
  }
});

app.put("/libro/:id", function (req, res) {
  try {
    //  {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
    res.status(200).send("TODO"); //  {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
  } catch (error) {
    //  "solo se puede modificar la descripcion del libro
    res.status(413).send({ message: error.message });
  }
});

app.put("/libro/prestar/:id", function (req, res) {
  try {
    // {id:numero, persona_id:numero}
    res.status(200).send("TODO"); //  {mensaje: "se presto correctamente"}
  } catch (error) {
    "error inesperado",
      "el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva",
      "no se encontro el libro",
      "no se encontro la persona a la que se quiere prestar el libro";
    res.status(413).send({ message: error.message });
  }
});

app.put("/libro/devolver/:id", function (req, res) {
  try {
    res.status(200).send("TODO"); //{mensaje: "se realizo la devolucion correctamente"}
  } catch (error) {
    // "error inesperado", "ese libro no estaba prestado!", "ese libro no existe"
    res.status(413).send({ message: error.message });
  }
});

app.delete("/libro/:id", function (req, res) {
  try {
    res.status(200).send("TODO"); //  {mensaje: "se borro correctamente"}
  } catch (error) {
    "error inesperado",
      "no se encuentra ese libro",
      "ese libro esta prestado no se puede borrar";
    res.status(413).send({ message: error.message });
  }
});

app.listen(3000, function () {
  console.log("la app esta corriendo en localhost:3000");
});
