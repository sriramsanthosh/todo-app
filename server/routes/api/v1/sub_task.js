const express = require('express');
const router = express.Router();

const subTaskController = require("../../../controllers/api/v1/sub_tasks_api");

router.post("/:task_id", subTaskController.create);

module.exports = router;