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

// A Feathers app is the same as an Express app
const app = feathers();

app.use(require('compression')());
// Parse HTTP JSON bodies
app.use(bodyParser.json());
// Parse URL-encoded params
app.use(bodyParser.urlencoded({ extended: true }));
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