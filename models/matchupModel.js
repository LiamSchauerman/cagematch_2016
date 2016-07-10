import mongoose from "mongoose";

const matchupSchema = new mongoose.Schema({
	actorId : String,
	winnerScorePre : Number,
	winnerScorePost : Number,
	loserScorePre : Number,
	loserScorePost : Number,
	winner : String,
	loser: String,
	timestamp: { type : Date, default: Date.now },
});

export default mongoose.model('Matchup', matchupSchema);