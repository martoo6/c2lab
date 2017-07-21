/**
 * Created by martin on 7/2/17.
 */

const SbtService = require('../services/sbt-service');
const sketchesShowcase = require('../services/sketches-showcase');
const dauria = require('dauria');

const SketchesHooksAfter = {
	create(hook) {
		console.log(hook);
		return SbtService.create(hook.result._id)
			.then(() => {
				//Compile in order to warm up, just that
				SbtService.compile(hook.result._id, '');
			})
			.then(() => hook);
	},

	update(hook) {
		return SbtService.compile(hook.result._id, '')
			.then(() => hook);
	},

	patch(hook) {
		return SbtService.compile(hook.result._id, '')
			.then(() => hook);
	},

	get(hook) {
		//Should be already compiled !!
		return SbtService.compile(hook.result._id, '')
			.then(() => hook);
	}
};

module.exports = SketchesHooksAfter;