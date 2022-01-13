const client_id = process.env["CLIENT_ID"];
const baseURL = process.env["AUTH0_BASE_URL"];


export async function get({ url, headers }) {
	let my_url = new URL(url);
	let params = my_url.searchParams.get('screen_hint');
	console.log("login params: " + JSON.stringify(params, null, 2));

	let redirect_uri = url.origin.replace(/\/login$/, '') + '/callback/';
	let response_type = 'code';
	let scope = 'openid profile email';
	// let scope = '';
	let screen_hint = params == "signup" ? 'signup' : 'login';
	return {
		status: 301,
		headers: {
			location: `${baseURL}/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&screen_hint=${screen_hint}`
		}
	};
}
