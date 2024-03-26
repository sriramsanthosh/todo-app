const express = require('express');
const router = express.Router();

const taskController = require("../../../controllers/api/v1/tasks_api");

router.post("/create", taskController.create);

module.exports = router;