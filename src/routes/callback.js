// import fetch from 'node-fetch';

const baseURL = process.env['AUTH0_BASE_URL'];
const client_id = process.env['CLIENT_ID'];
const client_secret = process.env['CLIENT_SECRET'];
const ably_admin_key = process.env['ABLY_ADMIN_KEY'];
const ably_subscribe_key = process.env['ABLY_SUBSCRIBE_KEY'];

import * as Ably from 'ably';

export async function get({ url, locals }) {
	let my_url = new URL(url);
	let code = my_url.searchParams.get('code');
	let redirect_uri = url.origin.replace(/\/login$/, '');

	let response = await getToken(code, redirect_uri);
	let json = await response.json();
	let access_token = json.access_token;

	let user = await getUser(access_token);
	let user_json = await user.json();

	locals.user = user_json;

	// let channel = await create_ably_channel(user_json.email);

	let token = await get_ably_user_using_api_key(user_json.email, url.origin);
	locals.ably_token = token;

	// let able_add_channel_url =
	// 	'https://make_ably_channel.robert-admin.workers.dev' + '/?user_identifier=' + user_json.email;

	// let ably_channel_add_response = await fetch(able_add_channel_url, {
	// 	method: 'GET'
	// });
    // console.log("ably_channel_add_response", ably_channel_add_response.status);
    // locals.ably_channel_add_response = await ably_channel_add_response.text();

    await create_ably_channel(user_json.email);


	console.log('In the callback endpoint: ' + JSON.stringify(locals, null, 2));

	return {
		status: 301,
		headers: {
			location: '/'
		}
	};
}

async function create_ably_channel(user_identifier) {

    const ably = new Ably.Realtime.Promise({key: ably_admin_key});

    let channel_name = `${user_identifier}`;
    let channel = await ably.channels.get(channel_name);
    await channel.publish('message', {
        text: `${user_identifier} has joined the server.`
    });
    return channel;
}


// TODO : Should probably use something other than the user's email as an identifier
async function get_ably_user_using_api_key(email, origin) {
	const ably = new Ably.Realtime.Promise({ key: ably_subscribe_key });
	var tokenParams = {
		ttl: 3600000,
		clientId: email,
		authUrl: `${origin}/ably_auth`,
        
	};

	return await ably.auth.authorize(tokenParams);
}

async function getToken(code, redirect_uri) {
	let grant_type = 'authorization_code';

	let tokenURL = `${baseURL}/oauth/token`;

	return await fetch(tokenURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`
	});
}

async function getUser(access_token) {
	let userURL = `${baseURL}/userinfo`;

	return await fetch(userURL, {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}
