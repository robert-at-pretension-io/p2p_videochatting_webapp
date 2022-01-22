
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request).catch
    (error => {
      console.log('error', error);
      return new Response(error, {
        status: 500,
        headers: { 'content-type': 'text/plain' },
      });
    }));
});



/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  console.log(request);
  let url = new URL(request.url);
  // let channel_name = url.searchParams.get('channel_name');
  // let user_identifier = url.searchParams.get('user_identifier');
  //base64 encoding of ABLY_ADMIN_KEY
   let encoded_key =  btoa(ABLY_ADMIN_KEY);

    //basic authorization header
    let auth_header = "Basic " + encoded_key;

    // get the payload from the request
  let req_json = await request.json();

    //ably message payload
    // let payload = {
    //   name: "new user",
    //   data : user_identifier,
    // };

    //post message to channel user_list
    let endpoint = `https://rest.ably.io/channels/${req_json.channel_name}/messages`;


    //fetch endpoint with payload and auth header
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth_header,
      },
      body: JSON.stringify(req_json.payload),
    });

    //return response
    let json = await response.json();

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });

}
