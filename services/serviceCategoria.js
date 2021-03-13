const model = require("../models/modelCategoria");

function categoriasList() {
  return model.categoriasList();
}

function categoriasGet(id) {
  return model.categoriasGet(id);
}

function categoriasAdd(categoria) {
  return model.categoriasAdd(categoria);
}

function categoriasUpdate(categoria) {
  return model.categoriasUpdate(categoria);
}

function categoriasRemove(id) {
  return model.categoriasRemove(id);
}

module.exports = {
  categoriasList,
  categoriasGet,
  categoriasAdd,
  categoriasUpdate,
  categoriasRemove,
};
