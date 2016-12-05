var mongoose = require("mongoose");

var matchupv2Schema = new mongoose.Schema({
  id: String,
  entries: Object,
  winner: String,
  loser: String,
  timestamp: {type: Date, default: Date.now},
  score_adjustment: Object,
});

module.exports = mongoose.model('Matchupv2', matchupv2Schema);
