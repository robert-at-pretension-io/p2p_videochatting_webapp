module.exports = class UserList {
  constructor(state, env) {
    this.state = state;
    // `blockConcurrencyWhile()` ensures no requests are delivered until
    // initialization completes.
    this.state.blockConcurrencyWhile(async () => {
      let stored_map = await this.state.storage.get("user_list");
      //user_list is a javascript map object
      this.user_list = stored_map || new Map();
    })
  }



  // Handle HTTP requests from clients.
  async fetch(request) {
    // get the query string
    const { searchParams } = new URL(request.url);

    // Apply requested action.
    let url = new URL(request.url);
    let currentValue = this.user_list;
    console.log(`Path value is ${url.pathname}`);
    console.log(`Current value is ${currentValue}`);
    // console.log(`The request is ${JSON.stringify(request)}`);

    let user_id = searchParams.get("user_id");


    switch (url.pathname) {

      case "/list":
        break;
      case "/add":

        console.log(`adding user_id ${user_id} to user_list`);
        this.user_list.set(user_id, { state: "active" });
        await this.state.storage.put("user_list", this.user_list);
        break;
      case "/remove":

        console.log(`changing user_id ${user_id} to inactive`);
        this.user_list.set(user_id, { state: "inactive" });
        await this.state.storage.put("user_list", this.user_list);
        break;
      case "/status":
        let status = searchParams.get("status");
        this.user_list.set(user_id, { state: status });
        await this.state.storage.put("user_list", this.user_list);
        break;
      case "/":
        // Just serve the current value. No storage calls needed!
        break;
      
      default:
        return new Response({"message": "not found"}, { status: 404 });
    }
    console.log(`at this point in time the user_list has the value ${JSON.stringify(this.user_list.get(user_id))} for user_id ${user_id}`);

    let response = JSON.stringify(Array.from(this.user_list));
    console.log(`response is ${response}`);

    return new Response(
      response

    );



  }
}


