var mongoose = require("mongoose");

var entrySchema = new mongoose.Schema({
  id: String,
  title: String,
  metadata: Object,
  score: Number,
  list_id: String,
});

module.exports = mongoose.model('Entry', entrySchema);
