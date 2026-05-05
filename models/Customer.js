const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

},{timestamps: true})

module.exports = mongoose.models.Customer || mongoose.model("Customer", customerSchema)