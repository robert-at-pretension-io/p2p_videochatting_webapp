import cookie from 'cookie';

export async function handle({ request, resolve }) {
	let cookies = cookie.parse(request.headers.cookie || '');

	if (request.url.pathname === '/logout') {
		cookies = null;
	}

	console.log('cookies before resolve function: ', JSON.stringify(cookies, null, 2));

	try {
	request.locals.user = JSON.parse(cookies.user);
	} catch (e) {
		console.log('error parsing cookie: ', e);
		request.locals.user = null;
	}

	console.log("before resolve function: " + JSON.stringify(request,null, 2));

	const response = await resolve(request);

	//code here happens after endpoint or page is called
	console.log("after resolve function: " + JSON.stringify(request,null, 2));

	response.headers['set-cookie'] = `user=${JSON.stringify(request.locals.user) || ''}; Path=/; HttpOnly`;

	return response;
}

export async function getSession(request) {

	console.log("getSession function: " + JSON.stringify(request,null, 2));

	return request.locals
		? {
				user: request.locals.user
		  }
		: {user : null};
}
