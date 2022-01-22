// In order for our ES6 shim to find the class, we must export it
// from the root of the CommonJS bundle
const UserList = require('./user_list.js')
exports.UserList = UserList;

exports.handlers = {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env)
    } catch (e) {
      return new Response(e.message)
    }
  },
}

async function handleRequest(request, env) {
  let id = env.USERLIST.idFromName('A')
  let obj = env.USERLIST.get(id)
  let resp = await obj.fetch(request)
  let user_list = await resp.json();

  return new Response(JSON.stringify(user_list),
  {
    headers: {
      'Content-Type': 'application/json'
    }
    });
}
