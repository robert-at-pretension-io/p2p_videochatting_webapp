import cookie from 'cookie';

export async function handle({ request, resolve }) {
	var cookies = cookie.parse(request.headers.cookie || '');



	console.log('cookies before resolve function: ', JSON.stringify(cookies, null, 2));

	try {
		request.locals= JSON.parse(cookies.data);
	} catch (e) {
		console.log('error parsing cookie user');
		request.locals = {};
	}



	console.log('before resolve function: ' + JSON.stringify(request.locals, null, 2));

	const response = await resolve(request);


	if (request.url.pathname === '/logout') {
		console.log("attemtping to logout");
		cookies = {};
		request.locals = {};
	}

	//code here happens after endpoint or page is called
	console.log('after resolve function: ' + JSON.stringify(request.locals, null, 2));

	response.headers['set-cookie'] = `data=${
		JSON.stringify(request.locals) || ''
	}; Path=/; HttpOnly`;

	return response;
}

export async function getSession(request) {
	console.log('getSession function: ' + JSON.stringify(request, null, 2));

	return request.locals
		? {
				data: request.locals
		  }
		: { data : {} };
}
