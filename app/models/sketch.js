const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sketchSchema = new Schema({
	title: { type: String, required: true },
	code: { type: String, default: '' },
	tags: { type: [String], default: [] },
	owner: { type: String, required: true },
	thumbnails: { type: [String], default: [] },
	is_public: { type: [String], default: true },
	published_url: { type: [String] }
});

const Sketch = mongoose.model('Sketch', sketchSchema);

module.exports = Sketch;