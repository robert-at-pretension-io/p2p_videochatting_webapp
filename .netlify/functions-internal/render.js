const { init } = require('../handler.js');

exports.handler = init({
	appDir: "_app",
	assets: new Set(["favicon.png"]),
	_: {
		mime: {".png":"image/png"},
		entry: {"file":"start-e6529f45.js","js":["start-e6529f45.js","chunks/vendor-1860a60a.js","chunks/preload-helper-ec9aa979.js","chunks/singletons-a42a5e91.js"],"css":["assets/start-61d1577b.css"]},
		nodes: [
			() => Promise.resolve().then(() => require('../server/nodes/0.js')),
			() => Promise.resolve().then(() => require('../server/nodes/1.js')),
			() => Promise.resolve().then(() => require('../server/nodes/2.js')),
			() => Promise.resolve().then(() => require('../server/nodes/3.js'))
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				a: [0,2],
				b: [1]
			},
			{
				type: 'endpoint',
				pattern: /^\/ably_auth\/?$/,
				params: null,
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/ably_auth.js'))
			},
			{
				type: 'endpoint',
				pattern: /^\/callback\/?$/,
				params: null,
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/callback.js'))
			},
			{
				type: 'page',
				pattern: /^\/account\/?$/,
				params: null,
				path: "/account",
				a: [0,3],
				b: [1]
			},
			{
				type: 'endpoint',
				pattern: /^\/logout\/?$/,
				params: null,
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/logout.js'))
			},
			{
				type: 'endpoint',
				pattern: /^\/login\/?$/,
				params: null,
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/login.js'))
			}
		]
	}
});
