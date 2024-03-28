const express = require('express');
const router = express.Router();

const taskController = require("../../../controllers/api/v1/tasks_api");

router.post("/create", taskController.create);
router.get("/all-tasks", taskController.all_tasks);
router.patch("/update/:task_id", taskController.update);
router.patch("/delete/:task_id", taskController.softDelete);

module.exports = router;