export function load_user_data(session, file_location) {
	console.log(`Loading session from ${file_location}: ` + JSON.stringify(session, null, 2));

	if (session !== undefined) {
		return {
			props: {
				user: session.user
			}
		};
	} else {
		return {
			props: {
				user: null
			}
		};
	}
}
