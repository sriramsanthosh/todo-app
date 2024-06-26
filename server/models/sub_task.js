const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
    status:{
        type: Boolean
    },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    },
    deletedAt:{
        type: Date
    }
});

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;