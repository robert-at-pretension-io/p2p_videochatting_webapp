import cookie from 'cookie';

export async function handle({request, resolve}) {
    const cookies = cookie.parse(request.headers.cookie || '');

    //code here happens before enpoint or page is called

    const response = await resolve(request);

    //code here happens after endpoint or page is called

    response.headers['set-cookie'] = `user=${request.locals.user || ''}; Path=/; HttpOnly`;

    return response;

}