const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userLikesSchema = new Schema({
	user_id: String,
	name: String
});

const sketchSchema = new Schema({
	title: { type: String, required: true },
	code: { type: String, default: "" },
	tags: { type: [String], default: [] },
	likes: { type: [userLikesSchema], default: [] },
	thumbnails: { type: [String], default: [] }
});

const Sketch = mongoose.model('Sketch', sketchSchema);

module.exports = Sketch;