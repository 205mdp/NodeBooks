"use strict";
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const util = require("util");

const app = express();

app.use(cors());
app.use(express.urlencoded());

var conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "biblioteca",
});

conexion.connect(function (err) {
  if (err) {
    console.log(err.code);
    console.log(err.fatal);
  }
});
const query = util.promisify(conexion.query).bind(conexion);

app.get("/", function (req, res) {
  try {
    res.send("Holla Utn");
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

// Login

// Categoria
// No se debe implementar el PUT
app.post("/categoria", async (req, res) => {
  try {
    const nombre = req.body.nombre; // Hacer verificacion de la categoria.

    const respuesta = await query("INSERT INTO categoria (nombre) values (?)", [
      nombre,
    ]);
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
    const respuesta = await query("SELECT * FROM categoria");

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
    const respuesta = await query(
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
    const respuesta = await query("DELETE FROM categoria WHERE id=?", [
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
app.post("/persona", function (req, res) {
  try {
    //  recibe: {nombre: string, apellido: string, alias: string, email: string} retorna:
    res.status(200).send("TODO"); //  {id: numerico, nombre: string, apellido: string, alias: string, email: string}
  } catch (error) {
    // ser: "faltan datos", "el email ya se encuentra registrado", "error inesperado"
    res.status(413).send({ message: error.message });
  }
});

app.get("/persona", function (req, res) {
  try {
    res.status(200).send("TODO"); // [{id: numerico, nombre: string, apellido: string, alias: string, email; string}]
  } catch (error) {
    res.status(413).send({ message: error.message });
  }
});

app.get("/persona/:id", function (req, res) {
  try {
    res.status(200).send("TODO"); //  {id: numerico, nombre: string, apellido: string, alias: string, email; string}
  } catch (error) {
    // "error inesperado", "no se encuentra esa persona"
    res.status(413).send({ message: error.message });
  }
});

app.put("/persona/:id", function (req, res) {
  try {
    //recibe: {nombre: string, apellido: string, alias: string, email: string} el email no se puede modificar.
    res.status(200).send("TODO"); //y el objeto modificado o
  } catch (error) {
    //"error inesperado", "no se encuentra esa persona"
    res.status(413).send({ message: error.message });
  }
});

app.delete("/persona/:id", function (req, res) {
  try {
    res.status(200).send("TODO"); // retorna: 200 y {mensaje: "se borro correctamente"}
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
