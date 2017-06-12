const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const hooks = require('feathers-hooks');
const memory = require('feathers-memory');
const authentication = require('feathers-authentication');
const local = require('feathers-authentication-local');
const jwt = require('feathers-authentication-jwt');
const bodyParser = require('body-parser');
const handler = require('feathers-errors/handler');
const ensimeClient = require('ensime-client');
const cors = require('cors');
const Bluebird = require('bluebird');
const uuidV4 = require('uuid/v4');

// A Feathers app is the same as an Express app
const app = feathers();

app.use(require('compression')())
	 //.options('*', cors())
	 //.use(cors)
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }));

// Register hooks module
app.configure(hooks());
// Add REST API support
app.configure(rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register our authentication plugin
app.configure(authentication({ idField: 'id', secret: 'supersecret' }));
// Register our local (username + password) authentication plugin
app.configure(local())
// Register our JWT authentication plugin
app.configure(jwt())
// Register our memory "users" service
app.use('/users', memory());
// Register a nicer error handler than the default Express one
app.use(handler());


class CleanUpFakeUI {

	constructor(projectPath) {
		this.projectPath = projectPath;
	}

	destroy() {
		//log.debug(`Cleaning ${this.projectPath} project`);
		//temp.cleanupSync();
	}
}

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
app.service('users').create({
	email: 'admin@feathersjs.com',
	password: 'admin'
});

// Start the server
app.listen(3000);