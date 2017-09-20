require('dotenv').config();
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const commonHooks = require('feathers-hooks-common');
const authentication = require('feathers-authentication');
const authHooks = require('feathers-authentication-hooks');
const local = require('feathers-authentication-local');
const bodyParser = require('body-parser');
const handler = require('feathers-errors/handler');
const cors = require('cors');
const Bluebird = require('bluebird');
const path = require('path');
const fs = require('fs');
 const _ = require('lodash');
const jwt = require('feathers-authentication-jwt');
const mongoose = require('mongoose');
const MongoService = require('feathers-mongoose');
const SketchesHooksAfter = require('../controllers/SketchesHookAfter');
const Sketch = require('../models/sketch');
const Like = require('../models/like');
const Follower = require('../models/follower');
const User = require('../models/user');
const Payment = require('../models/payment');
const SbtService = require('../services/sbt-service');
const compression = require('compression');
const got = require('got');
// const ensimeClient = require('ensime-client');

const errorHandler = require('feathers-errors/handler');

//TODO: MOVE TO CONFIG, USE .ENV
mongoose.Promise = Bluebird;
mongoose.connect('mongodb://c2lab:e5GLCyghJCkpph2C@ds161495.mlab.com:61495/c2lab', {useMongoClient: true, promiseLibrary: Bluebird})
	//.then(({db: {databaseName}}) => console.log(`Connected to ${databaseName}`))
	.catch(err => console.error(err));



// A Feathers app is the same as an Express app
const app = feathers();

function shouldCompress (req, res) {
	if (res.notCompress) {
		console.log('not compress !!');
		return false;
	}
	// fallback to standard filter function
	return compression.filter(req, res)
}

app.use(compression({filter: shouldCompress}))
   .use(cors())
   .use(bodyParser.json({limit: '50mb'}))
   .use(bodyParser.urlencoded({limit: '50mb', extended: true }));

console.log(path.resolve('./c2lab.pem'));
// console.log(fs.readFile());

const jwtConfig = {
	//  // Validate the audience and the issuer
	audience: 'VUs3zBHunPr1YqUooaqN0D1g9IaACyoH',
	issuer: 'https://c2lab.auth0.com/',
	algorithms: ['RS256', 'HS256']
};

const secret = Buffer.from(fs.readFileSync(path.resolve('c2lab.pem'), 'utf8'));

app.configure(hooks())
   .configure(rest())
	 .configure(authentication({secret}))
	 .configure(jwt(jwtConfig))
   .use(handler())
   .use(errorHandler());

const authenticate = [authentication.hooks.authenticate('jwt'), (hook) => {hook.params.user._id = hook.params.payload.sub}];

const ejwt = require('express-jwt')({
	secret,
	audience: jwtConfig.audience,
	issuer: jwtConfig.issuer,
	algorithms: jwtConfig.algorithms,
	credentialsRequired: false
});

const zlib = require('zlib');
Bluebird.promisifyAll(zlib);

app.get('/sketches/showcase/:id', ejwt, (req, res, next) => {
	const conditions = [{is_public: true}];
	if (req.user) conditions.push({owner: req.user.sub});
	Sketch.findOne({_id: req.params.id, $or: conditions}, {showcase: 1}).lean().exec()
		.then((x) => {
			if (x === null) {
				res.status(403).send();
			} else {
				//TODO: do not decompress an re compress. Send gzipped
				// res.notCompress = true;
				// res.contentType('text/html');
				// res.set('Content-Encoding', 'gzip');
				// res.send(x.showcase.toString());
				return zlib.gunzipAsync(new Buffer(x.showcase, 'base64')).then((x) => res.send(x.toString()));
			}
		})
		.catch((e) => e.name === 'CastError' && res.status(400).send())
		.catch(next);
});

app.get('/healthcheck', (req, res) =>  res.send('OK'));

const paymentService = MongoService({Model: Payment, paginate: {default: 50, max: 100}});
const usersService = MongoService({Model: User, id: 'user_id', paginate: {default: 50, max: 100}});

app.post('/ipn', (req, res) => {
	const payment = req.body;
	Bluebird.resolve(got.post(process.env.IPN_URL + '?cmd=_notify-validate&', {
		form: true,
		headers: {
			'User-Agent': 'c2lab-IPN-Verification'
		},
		body: payment
	})).then((x) => {
		if (x.body === 'VERIFIED'){
			const userId = payment.custom;
			console.log(userId);

			if (userId && payment.payment_type === 'instant' && payment.txn_type === 'subscr_payment') {
				return Bluebird.all([paymentService.create(req.body), usersService.patch(userId, { user_type: 'PREM' }, {query : {}})]);
			}
		}
	}).tap(() => res.send(''))
		.catch((e) => {
			console.error(e);
			res.send('');
		});
});

let auth;

const credentials = () => {
	if (auth && auth.expiration > new Date().getTime()) {
		return Bluebird.resolve(auth.credentials);
	} else {
		return Bluebird.resolve(got.post(`https://api.sandbox.paypal.com/v1/oauth2/token`, {
			form: true,
			json: true,
			headers: {
				Authorization: 'Basic ' + new Buffer(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64')
			},
			body: {
				grant_type: 'client_credentials'
			}
		}))
			.tap((r) => {
			console.log(r.body);
				const t = new Date();
				t.setSeconds(t.getSeconds() + r.body.expires_in);
				auth = {
					credentials: r.body.access_token,
					expiration: t.getTime()
				}
			})
			.then((r) => r.body.access_token);
	}
};

app.use('/sketches/preview', {
		create(data, params) {
			return SbtService.compile(params.user._id, data.code).then((code) => ({ code }));
		}
	}
);

app.service('/sketches/preview').hooks({
	before: {
		create: authenticate
	}
});

const sketchesShownParams = (hook) => {
	hook.params.query.$select = [
		'title',
		'code',
		'tags',
		'owner',
		'thumbnails',
		'is_public',
		'created_at',
		'updated_at'
	];
};

//TODO: This configuration does not allow for generic sketch searches, any sketch should be avilable but the query should have extra restriction by public id
app.use('/sketches', MongoService({Model: Sketch, paginate: {default: 50, max: 100}}));
app.service('/sketches').hooks({
	before: {
		find: _.concat(authenticate, sketchesShownParams),
		get: _.concat(authenticate, sketchesShownParams),
		create: _.concat(authenticate, authHooks.associateCurrentUser({ as: 'owner' })),
		update: _.concat(authenticate, authHooks.restrictToOwner({ ownerField: 'owner' })),
		patch: _.concat(authenticate, authHooks.restrictToOwner({ ownerField: 'owner' }))
	},
	after: SketchesHooksAfter
});

//TODO: this does not allow to see likes in other sketches that are not mine
app.use('/likes', MongoService({Model: Like, paginate: {default: 50, max: 100}}));
app.service('/likes').hooks({
	before: {
		find: authenticate,
		get: authenticate,
		create: _.concat(authenticate, authHooks.associateCurrentUser({ as: 'liker_id' })),
		update: _.concat(authenticate, authHooks.restrictToOwner({ ownerField: 'liker_id' })),
		patch: _.concat(authenticate, authHooks.restrictToOwner({ ownerField: 'liker_id' }))
	}
});

//TODO: With this restrictoin i can not see things that do not belong to me.
app.use('/followers', MongoService({Model: Follower, paginate: {default: 50, max: 100}}));
app.service('/followers').hooks({
	before: {
		find: authenticate,
		get: authenticate,
		create: _.concat(authenticate, authHooks.associateCurrentUser({ as: 'follower_id' })),
		update: _.concat(authenticate, authHooks.restrictToOwner({ ownerField: 'follower_id' })),
		patch: _.concat(authenticate, authHooks.restrictToOwner({ ownerField: 'follower_id' }))
	}
});

const hide = (user, currentUser) => user.user_id === currentUser ? _.omit(user, '_id') : _.pick(user, ['user_id', 'nickname']);

const hideUsersData = (hook) => {
	console.log(hook.result);
	hook.result.data = hook.result.data.map((user) => hide(user, hook.params.user._id));
};

const hideUserData = (hook) => {
	hook.result = hide(hook.result, hook.params.user._id);
};

app.use('/users/me', {
	find(params){
		return User.findOne({user_id: params.user._id}).lean().exec().then((x) => _.omit(x, '_id'));
	}
});
app.service('/users/me').hooks({
	before: {
		find: authenticate
	}
});

//TODO: Should allow patch for nickname and profile picture change, get is not working yet (and the ID should be the user_id when searching)
app.use('/users', usersService);
app.service('/users').hooks({
	before: {
		find: authenticate,
		get: authenticate,
		create: [commonHooks.disallow()],
		update: [commonHooks.disallow()],
		patch: [commonHooks.disallow()]
	},
	after: {
		find: hideUsersData,
		get: hideUserData
	}
});

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
const server = app.listen(3000);

server.on('listening', () => {
	console.log(`Feathers application started on port 3000`);
});