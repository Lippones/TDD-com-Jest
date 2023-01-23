const mongoose = require('mongoose');
const connection = require('../database/connection')
connection()
const User = mongoose.model("User", {
    name: String,
    email: String,
    password: String
})
module.exports = User