const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');
const twilioController = require('../controllers/twillio_controller');

router.get("/", homeController.home);
router.use("/api", require("./api/index"));
router.get("/make-calls", twilioController.make_a_call);

module.exports = router;
