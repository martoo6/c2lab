/**
 * Created by martin on 7/2/17.
 */

const SbtService = require('../services/sbt-service');
const sketchesShowcase = require('../services/sketches-showcase');
const dauria = require('dauria');
const Sketch = require('../models/sketch');
const Like = require('../models/like');
const uuidV4 = require('uuid/v4');
const Bluebird = require('bluebird');
const _ = require('lodash');

const SketchesHooksAfter = {
	create(hook) {
		SbtService.compile(hook.params.user._id, hook.result.code)
			.then((code) => sketchesShowcase.create({id: `${uuidV4()}.html`,  uri: dauria.getBase64DataURI(new Buffer(code), 'text/html')}))
			.then((showcase) =>  Sketch.update({_id: hook.result._id}, {$set: {published_id: showcase.id}}).exec());
		return Promise.resolve(hook);
	},

	update(hook) {
		SbtService.compile(hook.params.user._id, hook.result.code)
			.tap(() => sketchesShowcase.remove(hook.result.published_id))
			.then((code) => sketchesShowcase.create({id: hook.result.published_id,  uri: dauria.getBase64DataURI(new Buffer(code), 'text/html')}));
		return Promise.resolve(hook);
	},

	patch(hook) {
		//TODO: Check if code was mofified
		if (hook.data.code){
			SbtService.compile(hook.params.user._id, hook.result.code)
				.tap(() => sketchesShowcase.remove(hook.result.published_id))
				.then((code) => sketchesShowcase.create({id: hook.result.published_id,  uri: dauria.getBase64DataURI(new Buffer(code), 'text/html')}));
		}
		return Promise.resolve(hook);
	},

	remove(hook) {
		Bluebird.resolve(_.flatten([hook.result])).map((r) => {
			return Bluebird.all([
				Like.remove({sketch_id: r._id}).exec(),
				r.published_id && sketchesShowcase.remove(r.published_id)
			])
		}, {concurrency: 10});
		return Promise.resolve(hook);
	}
};

module.exports = SketchesHooksAfter;