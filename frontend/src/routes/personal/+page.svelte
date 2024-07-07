<script>
    import {
        Heading,
        Spinner,
        Span
    } from 'flowbite-svelte';
    import {ChevronDownOutline, FilterOutline} from 'flowbite-svelte-icons';
    import {myPlaylists} from '$lib/backend.js';
    import Playlist from '$lib/components/playlist.svelte';
    import {goto} from "$app/navigation";

    let myName = localStorage.getItem('username');

</script>

<div class="container">

    <Heading tag="h2" class="flex items-center m-4" size="text-5xl">
        <Span gradient>Playlist</Span> Create
    </Heading>

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

    <Heading tag="h2" class="flex items-center m-4" size="text-5xl">
        <Span gradient>Playlist</Span> Salvate
    </Heading>

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

</div>
