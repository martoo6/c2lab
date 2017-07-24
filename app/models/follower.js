const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
	follower_id: { type: String, required: true },
	following_id: { type: String, default: "" },
	timestamp: { type: [String], default: [] }
});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;