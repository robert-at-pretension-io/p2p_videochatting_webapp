// import fetch from 'node-fetch';

const baseURL = process.env["AUTH0_BASE_URL"];
const client_id = process.env['CLIENT_ID'];
const client_secret = process.env['CLIENT_SECRET'];

export async function get({params, url, locals}) {
    let my_url = new URL(url);
    let code = my_url.searchParams.get('code');
    let redirect_uri = url.origin.replace(/\/login$/, '');

    

    let response = await getToken(code, redirect_uri);
    let json = await response.json();
    let access_token = json.access_token;

    let user = await getUser(access_token);
    let user_json = await user.json();

    locals.user = user_json;

    console.log("In the callback enpoint: " + JSON.stringify(locals, null, 2));

    return {
        status: 301,
        headers: {
            location: '/'
        }

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
