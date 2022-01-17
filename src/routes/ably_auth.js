import * as Ably from 'ably';
const ably_admin_key = process.env["ABLY_ADMIN_KEY"];
const ably_subscribe_key = process.env["ABLY_SUBSCRIBE_KEY"];



export async function get({url, params,locals}) {
    console.log("params", params);
    console.log("url", url);
    console.log("locals", locals);
    let my_url = new URL(url);
    let rnd = my_url.searchParams.get('rnd');
    let ably = new Ably.Rest.Promise(ably_subscribe_key);
    let tokenParams = {
        rnd: rnd,
        ttl: 3600000,
        capabilities: {
            subscribe: true,
        },

        
    };
    let token = await ably.auth.createTokenRequest(tokenParams);
    console.log("ASDFtoken", token);
    locals.ably_token = token;
    return {
        body: token,
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
