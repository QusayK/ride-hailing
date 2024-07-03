const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db");
const User = require("./user");
const Driver = require("./driver");

class RideRequest extends Model {}

RideRequest.init(
  {
    riderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Driver,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted"),
      defaultValue: "pending",
    },
    pickup: {
      type: DataTypes.GEOMETRY("POINT", 4326),
    },
    destination: {
      type: DataTypes.GEOMETRY("POINT", 4326),
    },
  },
  {
    sequelize,
    modelName: "RideRequest",
  }
);

module.exports = RideRequest;
