const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');
const twilioController = require('../controllers/twillio_controller');

router.get("/", twilioController.make_a_call);
router.use("/api", require("./api/index"));

module.exports = router;
