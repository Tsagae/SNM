<script>
    import {
        Button,
        Heading,
        Spinner
    } from 'flowbite-svelte';
    import {PlusOutline} from "flowbite-svelte-icons";
    import {
        getMyCommunities
    } from '$lib/backend.js';
    import {goto} from '$app/navigation'

    let gruppi = getMyCommunities();
    
</script>

<Heading tag="h1" class="w-full mt-6 mb-4 text-center">I tuoi gruppi</Heading>

<Button on:click={() => goto(`/community/new`)}>
    <PlusOutline class="w-6 h-6 mr-2 text-white dark:text-white"/>
    Nuova community
</Button>

{#await gruppi}
<div class="text-center">
    <Spinner size={8} color="green"/>
</div>
{:then results}

    {JSON.stringify(results)}

{/await}