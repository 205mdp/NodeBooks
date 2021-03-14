const express = require("express");
const service = require("../services/serviceLibro");
// const libroService = require("../services/serviceLibro");
const app = express.Router();

// Inserta un libro en la DB
app.post("/libro", async function (req, res) {
  try {
    //ecibe: {nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
    // Verificamos que los campos tengan los datos requeridos
    if (!req.body.nombre || !req.body.descripcion || !req.body.categoria_id) {
      // TODO sacar descripcion y modificar la DB para que sea nullable.
      throw new Error("Los campos nombre y categoria son obligarios.");
    }
    // creamos el libro que vamos a insertar y devolver.
    var libro = {
      nombre: req.body.nombre.toUpperCase(),
      descripcion: req.body.descripcion.toUpperCase(),
      categoria_id: req.body.categoria_id,
      persona_id: !req.body.persona_id ? null : req.body.persona_id,
    };
    // Verificamos si el libro existe, lo podriamos hacer manejando el error de SQL
    // pero es un curso de web no de sql.
    const libroOk = await conexion.query(
      "SELECT COUNT(id) as idCount FROM libro WHERE nombre=?",
      [libro.nombre]
    );
    // Si el libro existe da error, si no sigue.
    if (libroOk[0].idCount > 0) {
      throw new Error("El libro ya existe");
    }
    // verificamos si la categoria existe.
    const cateok = await conexion.query(
      "SELECT COUNT(id) as idCount FROM categoria WHERE id=?",
      [libro.categoria_id]
    );
    // Si la categoria no existe da error.
    if (cateok[0].idCount == 0) {
      throw new Error("No existe la categoria indicada");
    }

    // Verificamos si la persona fue enviada.
    if (libro.persona_id != null) {
      // Verificamos si la persona existe.
      const personaOk = await conexion.query(
        "SELECT COUNT(id) as idCount FROM persona WHERE id=?",
        [libro.persona_id]
      );
      if (personaOk[0].idCount == 0) {
        throw new Error("No existe la persona indicada.");
      }
    }
    // Insertamos el libro.
    const respuesta = await conexion.query(
      "INSERT INTO libro (nombre, descripcion, categoria_id, persona_id) values (?, ?, ?, ?)",
      [libro.nombre, libro.descripcion, libro.categoria_id, libro.persona_id]
    );
    // Verificamos si nos devulve el id insertado.
    if (respuesta.insertId > 0) {
      libro.id = respuesta.insertId;
      res.status(200).send(libro);
    } else {
      throw new Error("Error inesperado");
    }
    //ecibe: {nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
    //res.status(200).send({ message: error.message }); // {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
  } catch (error) {
    // "error inesperado", "ese libro ya existe", "nombre y categoria son datos obligatorios", "no existe la categoria indicada", "no existe la persona indicada"
    res.status(413).send({ message: error.message });
  }
});

app.get("/libro", async function (req, res) {
  try {
    // buscamos los libros en la db
    const respuesta = await conexion.query("SELECT * FROM libro");
    res.status(200).send(respuesta);

    //  [{id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}]
  } catch (error) {
    //  "error inesperado"
    res.status(413).send({ message: error.message });
  }
});

app.get("/libro/:id", async function (req, res) {
  try {
    var libro_id = req.params.id;
    // verificamos que el id sea un numero.
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    // consultamos el libro en la db.
    const respuesta = await conexion.query("SELECT * FROM libro WHERE id=?", [
      libro_id,
    ]);

    if (respuesta.length == 1) {
      res.status(200).send(respuesta[0]);
    } else if (respuesta.length == 0) {
      throw new Error("El libro no existe.");
    } else {
      throw new Error("Error inesperado.");
    }

    // {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
  } catch (error) {
    // "error inesperado", "no se encuentra ese libro"
    res.status(413).send({ message: error.message });
  }
});

app.put("/libro/:id", async function (req, res) {
  try {
    const libro_id = req.params.id;
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    if (!req.body.descripcion) {
      throw new Error("Debe enviar la descripción");
    }
    const descripcion = req.body.descripcion;
    // Verificamos si manda mas parametros aparte de la descripcion.
    if (Object.keys(req.body).length > 1) {
      throw new Error("Solo se puede modificar la descripcion del libro.");
    }

    const respuesta = await conexion.query(
      "UPDATE libro SET descripcion=? WHERE id=?",
      [descripcion, libro_id]
    );
    if (respuesta.affectedRows == 1) {
      const libro_data = await conexion.query(
        "SELECT * FROM libro WHERE id=?",
        [libro_id]
      );
      if (libro_data.length == 1) {
        res.status(200).send(libro_data[0]);
      } else {
        throw new Error("Error inesperado.");
      }
    } else {
      throw new Error("Error inesperado.");
    }

    //  {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
    //  {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
  } catch (error) {
    //  "solo se puede modificar la descripcion del libro
    res.status(413).send({ message: error.message });
  }
});

app.put("/libro/prestar/:id", async function (req, res) {
  try {
    const libro_id = req.params.id;
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }
    if (!req.body.persona_id) {
      throw new Error("Debe enviar a quien le presta el libro ");
    }
    const persona_id = req.body.persona_id;

    // ver si el libro esta prestado
    console.log("por sele");
    const libro_data = await conexion.query("SELECT * FROM libro WHERE id=?", [
      libro_id,
    ]);
    console.log("pase liv");
    if (libro_data.length == 1) {
      if (libro_data[0].persona_id != null) {
        throw new Error(
          "El libro ya esta prestado, no se puede prestar hasta que no se devuelva"
        );
      }
    } else {
      throw new Error("No se encontro el libro.");
    }

    const persona = await conexion.query("SELECT id FROM persona WHERE id=?", [
      persona_id,
    ]);

    if (persona.length != 1) {
      throw new Error(
        "no se encontro la persona a la que se quiere prestar el libro"
      );
    } else {
      console.log("por update");
      const respuesta = await conexion.query(
        "UPDATE libro SET persona_id=? WHERE id=?",
        [persona_id, libro_id]
      );
      if (respuesta.affectedRows == 1) {
        res.status(200).send({ mensaje: "se presto correctamente" });
      } else {
        throw new Error("Error inesperado");
      }
    }

    // {id:numero, persona_id:numero}
    //  {mensaje: "se presto correctamente"}
  } catch (error) {
    "error inesperado",
      "el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva",
      "no se encontro el libro",
      "no se encontro la persona a la que se quiere prestar el libro";
    res.status(413).send({ message: error.message });
  }
});

app.put("/libro/devolver/:id", async function (req, res) {
  try {
    const libro_id = req.params.id;
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }

    // ver si el libro esta prestado
    const libro_data = await conexion.query("SELECT * FROM libro WHERE id=?", [
      libro_id,
    ]);
    if (libro_data.length == 1) {
      if (libro_data[0].persona_id == null) {
        throw new Error("El libro no estaba prestado");
      }
    } else {
      throw new Error("No se encontro el libro.");
    }

    const respuesta = await conexion.query(
      "UPDATE libro SET persona_id=? WHERE id=?",
      [null, libro_id]
    );
    if (respuesta.affectedRows == 1) {
      res.status(200).send({ mensaje: "se devolvio correctamente" });
    } else {
      throw new Error("Error inesperado");
    }
  } catch (error) {
    // "error inesperado", "ese libro no estaba prestado!", "ese libro no existe"
    res.status(413).send({ message: error.message });
  }
});

app.delete("/libro/:id", async function (req, res) {
  try {
    const libro_id = req.params.id;
    if (isNaN(libro_id)) {
      throw new Error("Error inesperado el id no es un numero");
    }

    // ver si el libro esta prestado
    const libro_data = await conexion.query(
      "SELECT persona_id FROM libro WHERE id=?",
      [libro_id]
    );
    if (libro_data.length == 1) {
      if (libro_data[0].persona_id != null) {
        throw new Error("El libro esta prestado no se puede borrar");
      } else {
        const respuesta = await conexion.query("DELETE FROM libro WHERE id=?", [
          libro_id,
        ]);
        if (respuesta.affectedRows == 1) {
          res.status(200).send({ mensaje: "Se borro correctamente el libro" });
        } else {
          throw new Error("Error inesperado.");
        }
      }
    } else {
      throw new Error("No se encontro ese libro.");
    }
    //  {mensaje: "se borro correctamente"}
  } catch (error) {
    "error inesperado",
      "no se encuentra ese libro",
      "ese libro esta prestado no se puede borrar";
    res.status(413).send({ message: error.message });
  }
});



module.exports = app;