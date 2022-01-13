import cookie from 'cookie';

export async function handle({ request, resolve }) {
	if (request.header !== undefined) {
		const cookies = cookie.parse(request.headers.cookie || '');

		//code here happens before enpoint or page is called

		if (cookies.user) {
			request.locals.user = cookies.user;
		}
	}
	const response = await resolve(request);

	//code here happens after endpoint or page is called

	response.headers['set-cookie'] = `user=${request.locals.user || ''}; Path=/; HttpOnly`;

	return response;
}

export async function getSession(request) {
	return;
	request.locals.user
		? {
				user: request.locals.user
		  }
		: {};
}
