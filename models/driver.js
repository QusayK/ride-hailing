const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db");
const User = require("./user");

class Driver extends Model {}

Driver.init(
  {
    location: {
      type: DataTypes.GEOMETRY("POINT", 4326),
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Driver",
  }
);

Driver.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Driver, { foreignKey: "userId", as: "driver" });

module.exports = Driver;
