var conexion = require("./db");

// Cuenta la cantidad de libros con categoria.
async function libroCountCategoria(categoria_id) {
  const respuesta = await conexion.query(
    "SELECT COUNT(id) as cantidad FROM libro WHERE categoria_id=?",
    [categoria_id]
  );
  return respuesta;
}

module.exports = {
  libroCountCategoria,
};
