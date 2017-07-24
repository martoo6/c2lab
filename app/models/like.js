const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const likeSchema = new Schema({
	sketch_id: { type: ObjectId, required: true },
	liker_id: { type: String, required: true },
	timestamp: { type: [String], default: [] }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;