import Ably from 'ably/browser/static/ably-webworker.min';
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
  let user_identifier = url.searchParams.get('user_identifier');
  var ably = Ably.Realtime({ key: ABLY_ADMIN_KEY });

  let channel = ably.channels.get('user_list');
  channel.publish('message', {
    text: `${user_identifier} has joined the server.`
  });
  

  // channel.publish('new_user', `${user_identifier}`,
  // function(err) {
  //   if (err) {
  //     console.log('Error: ' + err.message);
  //     return new Response('error' + err.message);
  //   } else {
  //     console.log('Success');
  //     return new Response('worked');
  //   }
  // }
  // );

  return new Response('worked');



}
