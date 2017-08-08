/**
 * Created by martin on 7/2/17.
 */
const Bluebird = require('bluebird');
const _ = require('lodash');
const fs = require('fs-extra');
const spawn = require('child_process').spawn;
const path = require('path');
const readline = require('readline');
const stripAnsi = require('strip-ansi');

let sbtProc;
const slots = [];
const maxSlots = 10;

let currentResolve;
let currentReject;
let compilationResult;

Bluebird.promisifyAll(fs);

const sketchTemplateP = fs.readFileAsync(`sbt-projects/SketchTemplate/src/main/scala/ThreeJSApp.scala`, 'utf8');
const PQueue = require('p-queue');
const queue = new PQueue({concurrency: 1});

function startSbt() {
	const cp = path.resolve(".");
	const params = ['-sbt-version', "0.13.16"];
	console.log(params);
	sbtProc = spawn(`${cp}/sbt`, params, {cwd: path.resolve('sbt-projects')});
	sbtProc.stdin.setEncoding('utf-8');

	readline.createInterface({
		input     : sbtProc.stdout,
		terminal  : false
	})
		.on('line', (data) => {
			console.log(`[SBT] - stdout: ${data}`);
			//CHECK FOR SUCCESS OR ERROR !
			//TODO: Awfull mutable state
			compilationResult+= data + '\n';
			if (stripAnsi(data).match(/\[success\] Total time: \d* s, completed/)) {
				currentResolve(compilationResult); //TODO: grab actual compilation result
			} else if (stripAnsi(data).match(/\[error\] Total time: \d* s, completed/)) {
				currentReject(compilationResult);  //TODO: Show actual failure
			}
		});

	readline.createInterface({
		input     : sbtProc.stderr,
		terminal  : false
	}).on('line', (data) => {
		console.log(`[SBT] - stderr: ${data}`);
	});
}

startSbt();

function pad(num, size) {
	let s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}

const getSlot = (id) => {
	const existingSlot = slots.find((s) => s.id === id);
	if (existingSlot) {
		return Bluebird.resolve(existingSlot);
	} else {
		if (slots.length < maxSlots){
			const slot = {id, number: pad(slots.length, 2), timestamp: new Date().getTime(), lock: true};
			slots.push(slot);
			return fs.copyAsync('sbt-projects/SketchTemplate', 'sbt-projects/sketch' + slot.number, {overwrite: true})
				.then(() => slot);
		} else {
			const unlockedSlots = slots.filter((s) => !s.lock);
			if (unlockedSlots.length === 0) {
				return Bluebird.reject(new Error('No more slots available'));
			} else {
				const slot = _.chain(slots).orderBy('timestamp', 'asc').head().value();
				slot.id = id;
				slot.timestamp = new Date().getTime();
				slot.lock = true;
				return fs.copyAsync('sbt-projects/SketchTemplate', 'sbt-projects/sketch' + slot.number, {overwrite: true})
					.then(() => slot);
			}
		}
	}
};

class SbtService {
	static compile(id, code, mode){
		//TODO: redis check, in that case ask remote server to finish job, redirect or something
		return getSlot(id).then((slot) => {
			const sketchSlot = 'sketch' + slot.number;
			return sketchTemplateP
				.then((codeTemplate) => codeTemplate.replace('[code]', code))
				.then((newCode) => fs.writeFileAsync(`sbt-projects/${sketchSlot}/src/main/scala/ThreeJSApp.scala`, newCode, 'utf8'))
				.then(() => {
					return Bluebird.resolve(queue.add(() => new Bluebird((resolve, reject) => {
						currentResolve = resolve;
						currentReject = reject;
						compilationResult = '';
						sbtProc.stdin.write(sketchSlot + `/${mode || 'fastOptJS'}\n`);
					}))).then(() => {
						return Bluebird.all([
							fs.readFileAsync('sbt-projects/index.html', 'utf8'),
							fs.readFileAsync('sbt-projects/lib/c2lab-opt.js', 'utf8'),
							fs.readFileAsync('sbt-projects/lib/jsdeps.min.js', 'utf8'),
							fs.readFileAsync(`sbt-projects/${sketchSlot}/target/scala-2.12/${sketchSlot}-${mode === 'fullOptJS' ? 'opt.js' : 'fastopt.js'}`, 'utf8')
						]);
					}).spread((index, c2lab, jsdeps, sketch) => {
						return index.replace('c2lab', c2lab)
							.replace('jsdeps', jsdeps)
							.replace('fastopt', sketch);
					}) //Could upload to S3 or any static server service and return URL o return compiled code here
						.tap(() => slot.lock = false)
						.tap(() => console.log(`${id} was compiled succesfully !`));
				})
		});
	}
}

SbtService.mode = {
	FULL: 'fullOptJS',
	FAST: 'fastOptJS'
};

module.exports = SbtService;