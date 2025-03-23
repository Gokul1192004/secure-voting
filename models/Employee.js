const mongoose = require('mongoose')
const Employeeschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    voterId: String  // Added voter ID field
})

const EmployeeModel = mongoose.model("employees", Employeeschema)
module.exports = EmployeeModel