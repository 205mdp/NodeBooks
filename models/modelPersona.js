// Conexion a la Db.
var conexion = require("./db");

async function PersonaAdd(persona) {
  const respuesta = await conexion.query(
    "INSERT INTO persona (nombre, apellido, alias, email) values (?, ?, ?, ?)",
    [persona.nombre, persona.apellido, persona.alias, persona.email]
  );
  return respuesta;
}

async function PersonaList() {
  const respuesta = await conexion.query("SELECT * FROM persona");
  return respuesta;
}

async function PersonaGet(id) {
  console.log(id);
  const respuesta = await conexion.query("SELECT * FROM persona WHERE id=?", [
    id,
  ]);
  console.log(respuesta);
  return respuesta;
}

async function PersonaUpdate(persona) {
  const respuesta = await conexion.query(
    "UPDATE persona SET nombre=?, apellido=?, alias=? WHERE id=?",
    [persona.nombre, persona.apellido, persona.alias, persona.id]
  );
  console.log(respuesta);
  return respuesta;
}

async function PersonaRemove(id) {
  const respuesta = await conexion.query("DELETE FROM persona WHERE id=?", [
    id,
  ]);
  return respuesta;
}

module.exports = {
  PersonaAdd,
  PersonaList,
  PersonaGet,
  PersonaUpdate,
  PersonaRemove,
};
