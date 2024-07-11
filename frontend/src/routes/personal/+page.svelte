<script>
    import {
        Button,
        Heading,
        Spinner,
        Span
    } from 'flowbite-svelte';
    import {ChevronDownOutline, FilterOutline, PlusOutline} from 'flowbite-svelte-icons';
    import {myPlaylists, getMySavedPlaylists, getUser} from '$lib/backend.js';
    import Playlist from '$lib/components/playlist.svelte';
    import {goto} from "$app/navigation";
    import LoginRequired from '$lib/components/loginrequired.svelte';

    let myName = localStorage.getItem('username');

</script>
<LoginRequired>
    <div class="container p-4">

        <Heading tag="h2" class="flex items-center mb-4" size="text-5xl">
            <Span gradient>Playlist</Span> Create
        </Heading>

        <div class="w-full flex mb-6">
            <Button class="mx-auto" on:click={() => goto(`/playlist/new`)}>
                <PlusOutline class="w-6 h-6 mr-2 text-white dark:text-white"/>
                Nuova playlist
            </Button>
        </div>

        {#await myPlaylists()}
            <div class="text-center">
                <Spinner size={8} color="green"/>
            </div>
        {:then playlist}
            {#each playlist as {_id, name, user, tracks, tags, thumbnail}, i}
                <Playlist id={_id} name={name} user={myName} tracks={tracks} tags={tags} thumbnail={thumbnail} i={i}/>
                <br><br>
            {/each}
        {/await}

        <Heading tag="h2" class="flex items-center mb-4" size="text-5xl">
            <Span gradient>Playlist</Span> Salvate
        </Heading>

        {#await getMySavedPlaylists()}
            <div class="text-center">
                <Spinner size={8} color="green"/>
            </div>
        {:then playlist}
            {#each playlist as {_id, name, user, tracks, tags, thumbnail}, i}
                {#await getUser(user)}
                    <div class="text-center">
                        <Spinner size={8} color="green"/>
                    </div>
                {:then proprietario}
                    <Playlist id={_id} name={name} user={proprietario.username} tracks={tracks} tags={tags}
                              thumbnail={thumbnail} i={i}/>
                {/await}
                <br><br>
            {/each}
        {/await}

    </div>
</LoginRequired>