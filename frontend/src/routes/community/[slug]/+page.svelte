<script>
    import {
        Avatar,
        Heading,
        Spinner
    } from 'flowbite-svelte';
    import {
        getCommunity,
        getUser
    } from '$lib/backend.js';

    let pageInfo = window.location.pathname;
    let id = pageInfo.replace("/community/", "");
    id = id.replace("/", "");

</script>

{#await getCommunity(id)}
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

            {#each results.users as member}
                {#await getUser(member)}
                    <div class="text-center">
                        <Spinner size={8} color="green"/>
                    </div>
                {:then user}
                    <Avatar src="{user.avatar}" rounded/>
                    <div class="space-y-1 font-medium dark:text-white">
                        {user.username}
                    </div>
                {/await}
            {/each}

        </div>
    </div>

{/await}