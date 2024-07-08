<script>
    import {
        Heading,
        Spinner
    } from 'flowbite-svelte';


    async function cercaGruppi(){
        const res = await fetch('http://localhost:3000/getCommunity', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body : JSON.stringify({id : localStorage.getItem("userId")})
		});

		return await res.json();
    }
    
</script>

<Heading tag="h1" class="w-full mt-6 mb-4 text-center">I tuoi gruppi</Heading>

{#await cercaGruppi()}
<div class="text-center">
    <Spinner size={8} color="green"/>
</div>
{:then results}

    {results.communityName}

{/await}