<script context="module">
	export async function load({ session, locals }) {

    console.log("Loading session from login_header.svelte: " + JSON.stringify(session, null, 2));

		if (session !== undefined) {
    return {
			props: {
				user: session.user
			}
		};
  }
  else {
    return {
      props: {
        user: null
      }
    };

  }
}
</script>

<script>
	export let user;
</script>

<div class="navbar-item navbar-end">
	<div class="buttons">
		{#if user}
			<a class="button is-light is-outlined is-fullwidth" rel="external" href="/logout">
				<span class="icon">
					<i class="fa fa-sign-out" />
				</span>
				<span>Logout</span>
			</a>
		{/if}

		{#if !user}
			<a class="button is-primary is-outlined" rel="external" href="/login">
				<span class="icon">
					<i class="fa fa-sign-in" />
				</span>
				<span>Login</span>
			</a>
			<a class="button is-warning is-outlined" rel="external" href="/login?screen_hint=signup">
				<span class="icon">
					<i class="fa fa-user-plus" />
				</span>
				<span>Register</span>
			</a>
		{/if}
	</div>
</div>
