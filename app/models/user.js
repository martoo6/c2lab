const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	nickname: { type: String },
	mail: { type: String },
	user_type: { type: String, enum: ['STD', 'PREM'] }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}});

const Follower = mongoose.model('User', userSchema);

module.exports = Follower;