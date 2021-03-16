var conexion = require("./db");

async function librosList() {
  const respuesta = await conexion.query("SELECT * FROM libro");
  return respuesta;
}

async function librosAdd(libro) {
  const respuesta = await conexion.query(
    "INSERT INTO libro (nombre, descripcion, categoria_id, persona_id) values (?, ?, ?, ?)",
    [libro.nombre, libro.descripcion, libro.categoria_id, libro.persona_id]
  );
  return respuesta;
}

async function librosGet(id) {
  const respuesta = await conexion.query("SELECT * FROM libro WHERE id=?", [
    id,
  ]);
  return respuesta;
}
async function librosUpdate(libro) {
  const respuesta = await conexion.query(
    "UPDATE libro SET descripcion=? WHERE id=?",
    [libro.descripcion, libro.id]
  );
  return respuesta;
}
async function librosRemove(id) {
  const respuesta = await conexion.query("DELETE FROM libro WHERE id=?", [id]);
  return respuesta;
}

async function librosPrestar(libro) {
  const respuesta = await conexion.query(
    "UPDATE libro SET persona_id=? WHERE id=?",
    [libro.persona_id, libro.id]
  );
  return respuesta;
}

// libros adicionales.

async function categoriaByNombre(nombre) {
  const respuesta = await conexion.query(
    "SELECT id FROM categoria WHERE nombre=?",
    [nombre]
  );
  return respuesta;
}

// Cuenta la cantidad de libros con categoria.
async function libroCountCategoria(categoria_id) {
  const respuesta = await conexion.query(
    "SELECT COUNT(id) as cantidad FROM libro WHERE categoria_id=?",
    [categoria_id]
  );
  return respuesta;
}

// Cuenta la cantidad de libros con categoria.
async function libroFindNombre(nombre) {
  const respuesta = await conexion.query(
    "SELECT COUNT(id) as idCount FROM libro WHERE nombre=?",
    [nombre]
  );
  return respuesta;
}

async function libroPrestadoPorPersona(id_persona) {
  const respuesta = await conexion.query(
    "SELECT id FROM libro WHERE persona_id=?",
    [id_persona]
  );
  return respuesta;
}

module.exports = {
  librosList,
  librosGet,
  librosAdd,
  librosRemove,
  categoriaByNombre,
  libroCountCategoria,
  libroFindNombre,
  librosPrestar,
  librosUpdate,
  libroPrestadoPorPersona,
};
