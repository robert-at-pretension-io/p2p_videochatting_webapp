

<style global>
@import "../app.css";
</style>

<script>
    import LoginHeader from "$lib/login_header.svelte";
    
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

      <LoginHeader/>
    </div>
  </nav>

<slot></slot>