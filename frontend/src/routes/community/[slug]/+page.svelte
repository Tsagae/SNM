<script>
    import {
        Heading,
        Spinner
    } from 'flowbite-svelte';

    let pageInfo = window.location.pathname;
    let id = pageInfo.replace("/community/", "");
    id = id.replace("/", "");
    let groupInfoPromise = getGroup(id);


    
</script>

{#await groupInfoPromise}
    <div class="text-center">
        <Spinner size={8} color="green"/>
    </div>
{:then results}

    <Heading tag="h1" class="w-full mt-6 mb-4 text-center">Nome Gruppo</Heading>

    <div class="flex">
        
        <div class="w-2/3" style="background-color:red;">

            Playlist condivise
        
        </div>

        <div class="w-1/3" style="background-color:green;">

            Elenco utenti
        
        </div>

    </div>


{/await}