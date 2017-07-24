const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const hooks = require('feathers-hooks');
const memory = require('feathers-memory');
const authentication = require('feathers-authentication');
const local = require('feathers-authentication-local');
const bodyParser = require('body-parser');
const handler = require('feathers-errors/handler');
const ensimeClient = require('ensime-client');
const cors = require('cors');
const Bluebird = require('bluebird');
const uuidV4 = require('uuid/v4');
const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');
const dauria = require('dauria');
const _ = require('lodash');
const mongoose = require('mongoose');
const MongoService = require('feathers-mongoose');
const SketchesHooksAfter = require('../controllers/SketchesHookAfter');
const Sketch = require('../models/sketch');
const SbtService = require('../services/sbt-service');
const sketchesShowcase = require('../services/sketches-showcase');

const errorHandler = require('feathers-errors/handler');
//const wrench = require('wrench');

//TODO: MOVE TO CONFIG, USE .ENV
mongoose.Promise = Bluebird;
mongoose.connect('mongodb://c2lab:e5GLCyghJCkpph2C@ds161495.mlab.com:61495/c2lab', {promiseLibrary: Bluebird});



// A Feathers app is the same as an Express app
const app = feathers();

app.use(require('compression')())
	 .options('*', cors())
	 .use(cors)
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }));

app.configure(hooks())
   .configure(rest())
   .use(handler())
   .use(errorHandler());

//TODO: falta autenticacion y verificar solo privado, whitelist, etc.
//app.use('/sketches/showcase', feathers.static(path.join(__dirname, '../../sketches-showcase')));
app.use('/sketches/:id/preview', {
		create(data, params) {
			return SbtService.compile(params.id, data.code)
			.then((x) => ({ code: x }));
			//.then((code) => sketchesShowcase.create({uri: dauria.getBase64DataURI(new Buffer(code), 'text/html')}));
		}
	}
);

//app.use('/sketches', MongoService({Model: Sketch}));

//app.service('/sketches').hooks({
//	after: SketchesHooksAfter
//});

/*
app.use('/ensime', {
	serverInstances: {
		amount: 0
	},
	create(data) {
		console.log("Post to ensime path");


		require('loglevel').getLogger('ensime.startup').enableAll();

		return Bluebird.resolve(ensimeClient.dotEnsimeUtils.parseDotEnsime(`./${data.path}/.ensime`)).then((dotEnsime) => {
			const starter = (project) => ensimeClient.startServerFromAssemblyJar('./ensime_2.12-2.0.0-M1-assembly.jar', project, '2.0.0-SNAPSHOT');
			return (ensimeClient.clientStarterFromServerStarter(starter)(dotEnsime, '2.0.0-SNAPSHOT', (msg) => {
				console.log(msg);
			})).then((x) => [x, dotEnsime]);
		}).spread((connection, dotEnsime) => {
			const instance = ensimeClient.makeInstanceOf(dotEnsime, connection , new CleanUpFakeUI(`./${data.path}/`));
			if (this.serverInstances.amount <= 4){
				const id = uuidV4();
				instance.api.typecheckAll();
				Bluebird.resolve(instance.api.getDocUriAtPoint(`./${data.path}/src/main/scala/ThreeJSApp.scala`, {from: 0, to: 20}))
					.tap(console.log)
					.catch(console.log);
				return Bluebird.resolve(instance.api.getSymbolAtPoint(`./${data.path}/src/main/scala/ThreeJSApp.scala`, 10))
					.tap(console.log)
					.catch(console.log);

				this.serverInstances[id] = connection;
				this.serverInstances.amount+=1;
				return id;
			} else {
				return Bluebird.reject('Run out of ensime instances, try again later');
			}
		}).catch(console.log);
	}
});
*/


// app.service('authentication').hooks({
// 	before: {
// 		create: [
// 			// You can chain multiple strategies
// 			authentication.hooks.authenticate(['jwt', 'local'])
// 		],
// 		remove: [
// 			authentication.hooks.authenticate('jwt')
// 		]
// 	}
// });

// app.service('users').hooks({
// 	before: {
// 		find: [
// 			// authenticate with JWT strategy before GET /users
// 			authentication.hooks.authenticate('jwt')
// 		],
// 		create: [
// 			local.hooks.hashPassword({ passwordField: 'password' })
// 		]
// 	}
// });

// Create a test user
// app.service('users').create({
// 	email: 'admin@feathersjs.com',
// 	password: 'admin'
// });

// Start the server
app.listen(3000);