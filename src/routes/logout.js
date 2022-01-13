export async function get({session, locals}) {
    session  = "";
    locals = "";
    return {
        status: 302,
        headers: {
            location: '/'
        }
    };

}