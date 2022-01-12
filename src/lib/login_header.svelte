<script>

	// either with async/await
    import { Auth0Client } from '@auth0/auth0-spa-js';

const auth0 = new Auth0Client({
  domain: 'dev-ggk93vhy.us.auth0.com',
  client_id: 'euhEPspBJreE2mcTuCujf9zuChOnngl1'
});

    async function login() {
        await auth0.loginWithRedirect({
            redirect_uri: window.location.origin
        });
    }

</script>

<div class="navbar-item navbar-end">
	<div class="buttons ">
		<a
			*ngIf="(auth.isAuthenticated$ | async) === false"
			class="button is-primary is-outlined"
			(click)="loginWithRedirect()"
		>
			Login
		</a>
		<a
			*ngIf="(auth.isAuthenticated$ | async) === false"
			class="button is-info is-outlined"
			(click)="signUpWithRedirect()"
		>
			Register
		</a>
		<a
			*ngIf="(auth.isAuthenticated$ | async)"
			class="button is-info is-outlined"
			(click)="logout()"
		>
			Logout
		</a>
	</div>
</div>
