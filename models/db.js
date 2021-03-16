var mysql = require("mysql");
var util = require("util");
// test
var db;

/*
 * Conceccion con la base de datos. 
 *
 * @return conector de db.
 * @mensajes consola "Ya estas conectado a la base de datos!", "Error conectando con la base de datos!"
 */
function connectDatabase() {
  if (!db) {
    // test
    //console.log(settings.database);
    db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "rootroot",
      database: "biblioteca",
    });

    db.connect(function (err) {
      if (!err) {
        console.log("Ya estas conectado a la base de datos!");
      } else {
        console.log("Error conectando con la base de datos!");
      }
    });
  }
  db.query = util.promisify(db.query);
  return db;
}

module.exports = connectDatabase();
