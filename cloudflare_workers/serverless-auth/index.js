import cookie from 'cookie';
import { authorize, logout, handleRedirect } from './auth0'

addEventListener('fetch', event => event.respondWith(handleRequest(event)))

// see the readme for more info on what these config options do!
const config = {
  // opt into automatic authorization state hydration
  hydrateState: false,
  // return responses at the edge
  originless: false,
}

async function handleRequest(event) {
  try {
    let request = event.request;
    
    let origin = request.headers.get('origin');
    let referer;
    //check if referer cookie is set
    let cookieHeader = event.request.headers.get('Cookie')
    if (cookieHeader && cookieHeader.includes('referer')) {
      console.log("get referer from cookie");
      let cookies = cookie.parse(cookieHeader)
      referer = cookies.referer;
    } else {
      console.log("get referer from header");
      referer = request.headers.get('referer');
      cookieHeader = cookie.serialize('referer', referer, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'lax',
      });
    }
    console.log("REFERRER: ", referer);
    console.log("ORIGIN: ", origin);
    const [authorized, { authorization, redirectUrl }] = await authorize(event)
    if (authorized && authorization.accessToken) {
      console.log("authorized");
      request = new Request(request, {
        headers: {
          Authorization: `Bearer ${authorization.accessToken}`,
        },
      })
    }

    // let response = config.originless
    //   ? new Response(null)
    //   : await fetch(event.request)

    let response = await fetch(event.request);

    const url = new URL(event.request.url)
    if (url.pathname === '/auth') {
      console.log('/auth');
      const authorizedResponse = await handleRedirect(event)
      if (!authorizedResponse) {
        return new Response('Unauthorized', { status: 401 })
      }
      response = new Response(response.body, {
        response,
        ...authorizedResponse,
      })
      return response
    }

    if (!authorized) {
      console.log('not authorized');
      return Response.redirect(redirectUrl)
    }


    if (url.pathname === '/logout') {
      const { headers } = logout(event)
      return headers
        ? new Response(response.body, {
            ...response,
            headers: Object.assign({}, response.headers, headers),
          })
        : Response.redirect(url.origin)
    }

    // in the case that everything is authorized, we can go back to the referer
    if (authorized) {
      console.log("return encoded auth");
    return Response(JSON.stringify(authorization));
    }
    else {
      console.log("return response");
      return response
    }
  } catch (err) {
    return new Response(err.toString())
  }
}
