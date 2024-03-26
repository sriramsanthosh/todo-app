const express = require('express');
const router = express.Router();

router.get("/", (req, res)=>{
    res.status(200).send({
        message : "this is page of v1 api"
    });
})
router.use("/task", require("./task"));
router.use("/sub-task", require("./sub_task"));
router.use("/user", require("./user"));

module.exports = router;