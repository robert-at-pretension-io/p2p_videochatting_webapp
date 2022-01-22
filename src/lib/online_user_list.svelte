<script>
    export let user_list;
</script>
<section class="section">
    <h1 class="title">User List</h1>
    <div class="container">
        <table class="table is-hoverable">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Click to Videochat</th>
                </tr>
            </thead>
            {#each user_list as user}
            <tr>
                <td>{user.email}</td>
                <td>{user.state}</td>
                <td><a href="/videochat/{user.username}">Click</a></td>
            </tr>
            {/each}
        </table>
    </div>
</section>