const { body, query, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const validateUserRegistration = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(["rider", "driver"])
    .withMessage("Role must be either rider or driver"),

  (req, res, next) => {
    validate(req, res, next);
  },
];

const validateDriverLocationUpdate = [
  body("driverId").isInt().withMessage("driverId must be an integer"),
  body("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a float between -90 and 90"),
  body("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a float between -180 and 180"),

  (req, res, next) => {
    validate(req, res, next);
  },
];

const validateRideRequest = [
  body("riderId").isInt().withMessage("riderId must be an integer"),
  body("pickupLat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("pickupLat must be a valid latitude"),
  body("pickupLng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("pickupLng must be a valid longitude"),
  body("destinationLat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("destinationLat must be a valid latitude"),
  body("destinationLng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("destinationLng must be a valid longitude"),

  (req, res, next) => {
    validate(req, res, next);
  },
];

const validateDriverIdQuery = [
  query("driverId").isInt().withMessage("driverId must be an integer"),

  (req, res, next) => {
    validate(req, res, next);
  },
];

const validateRideAcceptRequest = [
  body("rideRequestId").isInt().withMessage("rideRequestId must be an integer"),
  body("driverId").isInt().withMessage("driverId must be an integer"),

  (req, res, next) => {
    validate(req, res, next);
  },
];

module.exports = {
  validateUserRegistration,
  validateDriverLocationUpdate,
  validateRideRequest,
  validateDriverIdQuery,
  validateRideAcceptRequest,
};
