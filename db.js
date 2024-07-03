const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("rides", "postgres", "123", {
  host: "localhost",
  dialect: "postgres",
});

sequelize
  .query("CREATE EXTENSION IF NOT EXISTS postgis;")
  .then(() => {
    console.log("PostGIS extension enabled");
  })
  .catch((error) => {
    console.error("Error enabling PostGIS extension:", error);
  });

module.exports = sequelize;
