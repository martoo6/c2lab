const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	user_id: { type: String, index: { unique: true } },
	nickname: { type: String },
	mail: { type: String },
	user_type: { type: String, enum: ['STD', 'PREM'], default: 'STD' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}});

const Follower = mongoose.model('User', userSchema);

module.exports = Follower;