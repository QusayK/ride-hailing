const express = require("express");
const sequelize = require("../db");
const RideRequest = require("../models/rideRequest");
const Driver = require("../models/driver");
const User = require("../models/user");
const {
  validateRideRequest,
  validateDriverIdQuery,
  validateRideAcceptRequest,
} = require("../validation");
const router = express.Router();

router.post("/request", validateRideRequest, async (req, res) => {
  const { riderId, pickupLat, pickupLng, destinationLat, destinationLng } =
    req.body;

  try {
    const nearestDriver = await Driver.findOne({
      where:
        sequelize.literal(`"availability" = true AND "location" IS NOT NULL AND ST_DWithin(
        "location",
        ST_SetSRID(ST_MakePoint(${pickupLng}, ${pickupLat}), 4326),
        5000
      )`),
      order: sequelize.literal(`ST_Distance(
        "location",
        ST_SetSRID(ST_MakePoint(${pickupLng}, ${pickupLat}), 4326)
      )`),
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      limit: 1,
      raw: true,
    });

    if (!nearestDriver) {
      return res.status(404).json({ error: "No available drivers" });
    }

    const rideRequest = await RideRequest.create({
      riderId,
      driverId: nearestDriver.id,
      pickup: { type: "Point", coordinates: [pickupLng, pickupLat] },
      destination: {
        type: "Point",
        coordinates: [destinationLng, destinationLat],
      },
    });
    res.status(201).json(rideRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/requests", validateDriverIdQuery, async (req, res) => {
  const { driverId } = req.query;

  try {
    const rideRequests = await RideRequest.findAll({
      where: {
        driverId,
        status: "pending",
      },
    });
    res.status(200).json(rideRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/accept", validateRideAcceptRequest, async (req, res) => {
  const { rideRequestId, driverId } = req.body;

  try {
    const driver = await Driver.findOne({
      where: {
        id: driverId,
      },
    });

    if (!driver) return res.status(404).json({ error: "Driver not found" });

    const rideRequest = await RideRequest.findOne({
      where: {
        id: rideRequestId,
        driverId,
        status: "pending",
      },
    });

    if (!rideRequest) {
      return res
        .status(404)
        .json({ error: "Ride request not found or already accepted" });
    }

    rideRequest.status = "accepted";
    await rideRequest.save();

    driver.availability = false;
    await driver.save();

    res.status(200).json(rideRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
