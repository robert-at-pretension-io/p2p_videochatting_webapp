import fetch from 'node-fetch';

const baseURL = 'https://dev-ggk93vhy.us.auth0.com';

let client_id = process.env['CLIENT_ID'];
let client_secret = process.env['CLIENT_SECRET'];

export async function get({params, url}) {
    let my_url = new URL(url);
    let code = my_url.searchParams.get('code');
    let redirect_uri = url.origin.replace(/\/login$/, '');

    let response = await getToken(code, redirect_uri);
    let json = await response.json();
    let access_token = json.access_token;

    let user = await getUser(access_token);
    let user_json = await user.json();

    return {
        body: user_json
    };

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
            'Authorization': `Bearer ${access_token}`
        }
    });
}
