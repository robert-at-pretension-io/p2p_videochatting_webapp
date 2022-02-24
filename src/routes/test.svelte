<script>
    let request_url = 'https://serverless-auth.robert-admin.workers.dev/';

    async function getInfo() {
        // fetch with no-cors
        let response = await fetch(request_url, {
            method: 'GET',
            mode: 'no-cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let user = await response.json();
        return user;
    }

</script>


<button on:click={getInfo}>

        Click to try serverless login
    
</button>