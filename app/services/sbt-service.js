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
const processToSketchMap = {};
const availableSlots = [0,1,2,3,4,5,6,7,8,9];

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
	if (process.env.OPENSHIFT_DATA_DIR) {
		console.log(`Using openshift data dir: ${process.env.OPENSHIFT_DATA_DIR}`);
		params.push('-sbt-launch-dir');
		params.push(`${process.env.OPENSHIFT_DATA_DIR}.sbt/launchers`);
		params.push('-java-home');
		params.push(`${process.env.OPENSHIFT_DATA_DIR}jdk`);
		params.push('-ivy');
		params.push(`${process.env.OPENSHIFT_DATA_DIR}.ivy`);
		params.push('-sbt-boot');
		params.push(`${process.env.OPENSHIFT_DATA_DIR}.sbt/boot`);
		params.push('-sbt-dir');
		params.push(`${process.env.OPENSHIFT_DATA_DIR}.sbt/0.13.16`);

	}
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

class SbtService {
	static create(id){
		if (!_.isEmpty(availableSlots)) {
			//TODO: Change for LRU
			const slot = availableSlots.pop();
			processToSketchMap[id] = slot;
			return fs.copyAsync('sbt-projects/SketchTemplate', 'sbt-projects/sketch0' + slot, {overwrite: true})
				.then(() => slot);
		} else {
			return Bluebird.reject(new Error('No more slots available'));
		}
	}

	static compile(id, code){
		//TODO: redis check, in that case ask remote server to finish job, redirect or something
		return Bluebird.resolve(processToSketchMap[id] || SbtService.create(id)).then((slot) => {
			const sketchSlot = 'sketch0' + slot;
			return sketchTemplateP
				.then((codeTemplate) => codeTemplate.replace('[code]', code))
				.then((newCode) => fs.writeFileAsync(`sbt-projects/sketch0${slot}/src/main/scala/ThreeJSApp.scala`, newCode, 'utf8'))
				.then(() => {
					return Bluebird.resolve(queue.add(() => new Bluebird((resolve, reject) => {
						currentResolve = resolve;
						currentReject = reject;
						compilationResult = '';
						sbtProc.stdin.write(sketchSlot + '/fastOptJS\n');
					}))).then((res) => {
						console.log(res);
						return Bluebird.all([
							fs.readFileAsync('sbt-projects/index.html', 'utf8'),
							fs.readFileAsync('sbt-projects/lib/c2lab-opt.js', 'utf8'),
							fs.readFileAsync('sbt-projects/lib/jsdeps.min.js', 'utf8'),
							fs.readFileAsync(`sbt-projects/${sketchSlot}/target/scala-2.12/${sketchSlot}-fastopt.js`, 'utf8')
						]);
					}).spread((index, c2lab, jsdeps, sketch) => {
						return index.replace('c2lab', c2lab)
							.replace('jsdeps', jsdeps)
							.replace('fastopt', sketch);
					}) //Could upload to S3 or any static server service and return URL o return compiled code here
						.tap(() => console.log(`${id} was compiled succesfully !`));
				})
		});
	}
}

module.exports = SbtService;