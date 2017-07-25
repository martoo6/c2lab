/**
 * Created by martin on 7/2/17.
 */

const SbtService = require('../services/sbt-service');
const sketchesShowcase = require('../services/sketches-showcase');
const dauria = require('dauria');

const SketchesHooksAfter = {
	create(hook) {
		//SbtService.compile(hook.result._id, '')
		//	.then(() => hook);
		return Promise.resolve(hook);
	},

	update(hook) {
		return SbtService.compile(hook.result._id, '')
			.then(() => hook);
	},

	patch(hook) {
		return SbtService.compile(hook.result._id, '')
			.then(() => hook);
	}
};

module.exports = SketchesHooksAfter;