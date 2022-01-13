export async function get({ url, headers }) {


	let redirect_uri = url.origin.replace(/\/login$/, '') + '/callback/';
	let response_type = 'code';
	let scope = 'openid profile email';
	return {
		status: 301,
		headers: {
			location: `https://dev-ggk93vhy.us.auth0.com/authorize?response_type=${response_type}&client_id=euhEPspBJreE2mcTuCujf9zuChOnngl1&redirect_uri=${redirect_uri}&scope=${scope}`
		}
	};
}
