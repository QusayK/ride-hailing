const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Driver = require("../models/driver");
const {
  validateUserRegistration,
  validateDriverLocationUpdate,
} = require("../validation");
const router = express.Router();

router.post("/register", validateUserRegistration, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (role === "driver") {
      await Driver.create({ userId: user.id });
    }

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/update-location",
  validateDriverLocationUpdate,
  async (req, res) => {
    const { driverId, lat, lng } = req.body;

    try {
      await Driver.update(
        { location: { type: "Point", coordinates: [lng, lat] } },
        {
          where: { userId: driverId },
        }
      );

      res.status(200).json({ message: "Location updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
