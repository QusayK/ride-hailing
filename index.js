const express = require("express");
const sequelize = require("./db");
const userRoutes = require("./routes/users");
const rideRoutes = require("./routes/rides");

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/rides", rideRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
