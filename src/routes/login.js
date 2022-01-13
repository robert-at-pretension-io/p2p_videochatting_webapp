const client_id = process.env["CLIENT_ID"];
const baseURL = process.env["AUTH0_BASE_URL"];


export async function get({ url, headers }) {


	let redirect_uri = url.origin.replace(/\/login$/, '') + '/callback/';
	let response_type = 'code';
	let scope = 'openid profile email';
	// let scope = '';
	return {
		status: 301,
		headers: {
			location: `${baseURL}/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`
		}
	};
}
