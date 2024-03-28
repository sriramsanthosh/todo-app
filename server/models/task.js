const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    due_date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "TODO"
    }, 
    priority: {
        type: Number
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;