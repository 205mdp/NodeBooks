const model = require("../models/modelLibro");

function librosList() {
  return model.librosList();
}

function librosGet(id) {
  return model.librosGet(id);
}

function librosAdd(categoria) {
  return model.librosAdd(categoria);
}

function librosUpdate(categoria) {
  return model.librosUpdate(categoria);
}

function librosRemove(id) {
  return model.librosRemove(id);
}

function librosConCategoria(id_categoria) {
  return model.libroCountCategoria(id_categoria);
}

module.exports = {
  librosConCategoria,
};
