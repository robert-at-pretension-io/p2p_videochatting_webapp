
<script>
    export let user;
</script>

<div class="card">

    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src={user.picture} alt="This User's Avatar">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{user.name || user.email}</p>
          <p class="subtitle is-6">@{user.nickname || user.name}</p>
        </div>
      </div>

    </div>
  </div>