const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", function (req, res) {
  res.send("Holla Utn");
});

app.listen(3000, function () {
  console.log("la app esta corriendo en localhost:3000");
});
