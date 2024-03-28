const express = require('express');
const router = express.Router();

const subTaskController = require("../../../controllers/api/v1/sub_tasks_api");

router.post("/:task_id", subTaskController.create);
router.get("/all-sub-tasks", subTaskController.all_sub_tasks);
router.patch("/update/:sub_task_id", subTaskController.update);

module.exports = router;