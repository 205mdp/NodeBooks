const model = require("../models/modelLibro");

function librosConCategoria(id_categoria) {
  return model.libroCountCategoria(id_categoria);
}

module.exports = {
  librosConCategoria,
};
