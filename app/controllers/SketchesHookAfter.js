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
const zlib = require('zlib');
Bluebird.promisifyAll(zlib);

const compress = (data) => zlib.gzipAsync(data).then((res) => res.toString('base64'));

const SketchesHooksAfter = {
	create(hook) {
		SbtService.compile(hook.params.user._id, hook.result.code, SbtService.mode.FULL)
			.then(compress)
			.then((showcase) =>  Sketch.update({_id: hook.result._id}, {$set: {showcase}}).exec());
		return Promise.resolve(hook);
	},

	//Would fail on multiple update ?
	update(hook) {
		SbtService.compile(hook.params.user._id, hook.result.code, SbtService.mode.FULL)
			.then(compress)
			.then((showcase) =>  Sketch.update({_id: hook.result._id}, {$set: {showcase}}).exec());
		return Promise.resolve(hook);
	},

	//Would fail on multiple update ?
	patch(hook) {
		if (hook.data.code){
			SbtService.compile(hook.params.user._id, hook.result.code, SbtService.mode.FULL)
				.then(compress)
				.then((showcase) => Sketch.update({_id: hook.result._id}, {$set: {showcase}}).exec());
		}
		return Promise.resolve(hook);
	},

	remove(hook) {
		Bluebird.resolve(_.flatten([hook.result])).map((r) => Like.remove({sketch_id: r._id}).exec(), {concurrency: 50});
		return Promise.resolve(hook);
	}
};

module.exports = SketchesHooksAfter;