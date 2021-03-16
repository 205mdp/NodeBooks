const model = require("../models/modelPersona");

function PersonaList() {
  return model.PersonaList();
}

function PersonaGet(id) {
  return model.PersonaGet(id);
}

function PersonaAdd(Persona) {
  return model.PersonaAdd(Persona);
}

function PersonaUpdate(Persona) {
  return model.PersonaUpdate(Persona);
}

function PersonaRemove(id) {
  return model.PersonaRemove(id);
}

function PersonaEmailExiste(email) {
  return model.PerosnaByEmail(email);
}

module.exports = {
  PersonaList,
  PersonaGet,
  PersonaAdd,
  PersonaUpdate,
  PersonaRemove,
  PersonaEmailExiste,
};
