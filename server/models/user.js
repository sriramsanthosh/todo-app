const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    priority: {
        type: Number
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;