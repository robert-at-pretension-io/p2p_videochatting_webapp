export async function get({ url, headers, locals}) {
    console.log("Logout Endpoint: " + JSON.stringify(url, null, 2));

    	//add user to user_list which will be used to send messages to the user
	let base_url = "https://user_list.robert-admin.workers.dev/";
	let user_list_url = `${base_url}/remove?user_id=${locals.user.email}`;
	let user_list = await fetch(user_list_url);
	locals.user_list = await user_list.json();

    return {
        status: 301,
        headers: {
            location: '/'
        }
    };
}