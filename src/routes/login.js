export async function get({ params, request, response }) {
    // If a user is logged in, redirect to the homepage
    if (request.session.user) {
        return {
            status: 302,
            location: '/'
        };
    }
    
    // If the user is not logged in, render the login page
    else {
        return {
            status: 302,
            location: "https://dev-ggk93vhy.us.auth0.com/authorize?response_type=code|token&            client_id=euhEPspBJreE2mcTuCujf9zuChOnngl1&connection=CONNECTION&redirect_uri=http://localhost:3000/&      state=STATE"
        };
    }   
    }