const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
	follower_id: { type: String },
	following_id: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;