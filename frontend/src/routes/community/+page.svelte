<script>
    import {
        Heading,
        Spinner
    } from 'flowbite-svelte';
    import {
        getMyCommunities
    } from '$lib/backend.js';

    let gruppi = getMyCommunities();
    
</script>

<Heading tag="h1" class="w-full mt-6 mb-4 text-center">I tuoi gruppi</Heading>

{#await gruppi}
<div class="text-center">
    <Spinner size={8} color="green"/>
</div>
{:then results}

    {JSON.stringify(results)}

{/await}