export function get({ url, headers }) {
    console.log("Logout Endpoint: " + JSON.stringify(url, null, 2));
    return {
        status: 301,
        headers: {
            location: '/'
        }
    };
}