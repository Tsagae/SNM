<script>
    import {
        Heading,
        Spinner
    } from 'flowbite-svelte';

    const userId = localStorage.getItem("userId");

    //cercare tutte le community dove è presente l´utente

    let gruppi;

    async function cercaGruppi(){

    }
    
</script>

<Heading tag="h1" class="w-full mt-6 mb-4 text-center">I tuoi gruppi</Heading>

{#await gruppi}
<div class="text-center">
    <Spinner size={8} color="green"/>
</div>
{:then results}

{/await}