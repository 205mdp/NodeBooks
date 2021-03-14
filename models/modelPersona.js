// Conexion a la Db.
var conexion = require("./db");

async function PersonaAdd(persona) {
    const respuesta = await conexion.query(
    "INSERT INTO persona (nombre, apellido, alias, email) values (?, ?, ?, ?)",
    [nombre, apellido, alias, email]
  );
    return respuesta;
  }
  
async function PersonaList() {
  const respuesta = await conexion.query("SELECT * FROM persona");
  return respuesta;
  }

async function PersonaGet (id){
  const respuesta = await conexion.query("SELECT * FROM persona WHERE id=?", [
    persona_id,
  ]);
  return respuesta;
}

async function PersonaUpdate (perosna){
    const respuesta = await conexion.query(
        "UPDATE persona SET nombre=?, apellido=?, alias=? WHERE id=?",
        [nombre, apellido, alias, persona_id]
      );
  return respuesta;
}

async function PersonaRemove(id){
    const respuesta = await conexion.query("DELETE FROM persona WHERE id=?", [
        persona_id,
      ]);
      return respuesta;
}

module.exports = {
    PersonaAdd,
    PersonaList,
    PersonaGet,
    PersonaUpdate,
    PersonaRemove,
}