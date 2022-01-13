<script context="module">
	export async function load({ session }) {
		return {
			props: {
				user: session.user
			}
		};
	}
</script>

<script>
	export let user = undefined;
</script>

<div class="navbar-item navbar-end">
	<div class="buttons">
		{#if user}
			<a class="button is-info is-outlined" href="/logout">
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
			<a class="button is-info is-outlined" href="/register">
				<span class="icon">
					<i class="fa fa-user-plus" />
				</span>
				<span>Register</span>
			</a>
		{/if}
	</div>
</div>
