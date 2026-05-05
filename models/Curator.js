const mongoose = require("mongoose");

const curatorSchema = new mongoose.Schema({

},{timestamps: true})

module.exports = mongoose.models.Curator || mongoose.model("Curator", curatorSchema)