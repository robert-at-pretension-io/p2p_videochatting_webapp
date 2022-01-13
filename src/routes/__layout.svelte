

<style global>
@import "../app.css";
</style>

<script context="module">
  import { load_user_data } from "$lib/load_user_data";
	export async function load({ session }) {
    return load_user_data(session, "__layout.svelte");
}
</script>

<script>
    import LoginHeader from "$lib/login_header.svelte";
    export let user;
    
</script>

<nav class="navbar is-light"  aria-label="main navigation">
    <div class="navbar-brand">
      <a href="/" class="icon is-large has-text-info">
        <i class="fas fa-2x fa-code-branch"></i>
      </a>
    </div>
  
    <div class="navbar-end">
      <div class="navbar-item">
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
      </div>
      <div class="navbar-item">
        <button
          class="button is-info is-fullwidth"
          href="/services"
        >
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-cogs"></i>
            </span>
            <span>Services</span>
          </span>
        </button>
      </div>
      <div class="navbar-item">
        <button
          class="button is-fullwidth"
          href="/account"
        >
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-user"></i>
            </span>
            <span>Account</span>
          </span>
        </button>
      </div>

      <LoginHeader {user}/>
    </div>
  </nav>

<slot></slot>