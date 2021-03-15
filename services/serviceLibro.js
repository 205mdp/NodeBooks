const model = require("../models/modelLibro");

function librosList() {
  return model.librosList();
}

function librosGet(id) {
  return model.librosGet(id);
}

function librosAdd(libro) {
  return model.librosAdd(libro);
}

function librosUpdate(libro) {
  return model.librosUpdate(libro);
}

function librosRemove(id) {
  return model.librosRemove(id);
}
function librosPrestar(libro) {
  return model.librosPrestar(libro);
}

function librosContarCategoria(id_libro) {
  return model.libroCountCategoria(id_libro);
}

function libroFindNombre(nombre) {
  return model.libroFindNombre(nombre);
}

function libroPrestadoPorPersona(id_persona) {
  return model.libroPrestadoPorPersona(id_persona);
}
module.exports = {
  librosList,
  librosGet,
  librosAdd,
  librosUpdate,
  librosRemove,
  librosPrestar,
  librosContarCategoria,
  libroFindNombre,
  libroPrestadoPorPersona,
};
