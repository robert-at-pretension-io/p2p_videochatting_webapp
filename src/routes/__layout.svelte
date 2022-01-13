<script context="module">
	import { load_user_data } from '$lib/load_user_data';
	export async function load({ session }) {
		return load_user_data(session, '__layout.svelte');
	}
</script>

<script>
   import { goto } from '$app/navigation';
    import LoginHeader from "$lib/login_header.svelte";
    export let user;

</script>

<nav class="navbar is-info" aria-label="main navigation">
	<div class="navbar-brand">
		<a href="/" class="icon is-large has-text-primary">
			<i class="fas fa-2x fa-code-branch" />
		</a>
	</div>

	<div class="navbar-end">
		<!-- <div class="navbar-item">
         <button
          class="button is-primary is-fullwidth"
          href="/home"

        >
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
            <span> Home </span>
          </span>
        </button> 
      </div>-->

		<!-- <div class="navbar-item">
			<button class="button is-info is-fullwidth" href="/services">
				<span class="icon-text">
					<span class="icon">
						<i class="fas fa-cogs" />
					</span>
					<span>Services</span>
				</span>
			</button>
		</div> -->
    {#if user}
		<div class="navbar-item">
			<button class="button is-warning is-fullwidth is-outlined" href="/account" on:click={async () => {await goto('/account')} }>
				<span class="icon-text">
					<span class="icon">
						<i class="fas fa-user" />
					</span>
					<span>Account</span>
				</span>
			</button>
		</div>
    {/if}
		<LoginHeader {user} />
	</div>
</nav>

<slot/>

<style global>
	@import '../app.css';
</style>
