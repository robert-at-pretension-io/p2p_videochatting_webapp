<script context="module">
	import { load_user_data } from '$lib/load_user_data';
	export async function load({ session }) {
		return load_user_data(session, '/account.svelte');
	}
</script>

<script>
	import UserCard from '$lib/user_card.svelte';
	export let user;
</script>

{#if user}
	<section class="hero is-small is-warning">
		<div class="hero-body">
			<p class="title">Account Info:</p>
			<UserCard {user} />
		</div>
	</section>
{/if}
<!-- 
<section class="section">
        <div class="column is-full">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Conversation History
                    </p>
                </header>
            </div>
        </div>
</section> -->
