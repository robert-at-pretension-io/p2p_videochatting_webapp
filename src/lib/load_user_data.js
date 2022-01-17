export function load_user_data(session, file_location) {
	console.log(`Loading session from ${file_location}: ` + JSON.stringify(session, null, 2));

	if (session !== undefined) {
		return {
			props: {
				...session.data
			}
		};
	} else {
		return {
			props: {
				user: null,
                ably_token: null
			}
		};
	}
}
