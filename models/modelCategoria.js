// Conexion a la Db.
var conexion = require("./db");

async function categoriasList() {
  const respuesta = await conexion.query("SELECT * FROM categoria");
  return respuesta;
}

async function categoriasAdd(categoria) {
  const respuesta = await conexion.query(
    "INSERT INTO categoria (nombre) values (?)",
    [categoria.nombre]
  );
  return respuesta;
}

async function categoriasGet(id) {
  const respuesta = await conexion.query(
    "SELECT id, nombre FROM categoria WHERE id=?",
    [id]
  );
  return respuesta;
}

async function categoriasRemove(id) {
  const respuesta = await conexion.query("DELETE FROM categoria WHERE id=?", [
    id,
  ]);
  return respuesta;
}

// Categorias adicionales.

async function categoriaByNombre(nombre) {
  const respuesta = await conexion.query(
    "SELECT id FROM categoria WHERE nombre=?",
    [nombre]
  );
  return respuesta;
}

async function categoriaById(id) {
  const respuesta = await conexion.query(
    "SELECT COUNT(id) as idCount FROM categoria WHERE id=?",
    [id]
  );
  return respuesta;
}

module.exports = {
  categoriasList,
  categoriasGet,
  categoriasAdd,
  categoriasRemove,
  categoriaByNombre,
  categoriaById
};
