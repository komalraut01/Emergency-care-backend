const mongoose = require('mongoose');
const doctorsSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    specilist : String,
    address : String,
    working_time : String
});

module.exports = mongoose.model('Doctors', doctorsSchema);
