var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
  id: String,
  entries: Array,
  title: String,
  timestamp: {type: Date, default: Date.now},
});

module.exports = mongoose.model('List', listSchema);
