<script>
    import {
        Avatar,
        Button,
        Card,
        Dropdown,
        Spinner
    } from 'flowbite-svelte';
    import {addTrackToPlaylist, getTrackInfo, myPlaylists} from '$lib/backend.js';
    import {ChevronDownOutline, PlusOutline, UserCircleSolid} from "flowbite-svelte-icons";
    import {goto} from "$app/navigation";

    let pageInfo = window.location.pathname;
    let trackId = pageInfo.replace("/track/", "");
    trackId = trackId.replace("/", "");
    let playlistsPromise = myPlaylists();
    //TODO: aggiungere feedback al completamento di addTrackToPlaylist
</script>

{#await getTrackInfo(trackId)}
    <div class="text-center mt-16">
        <Spinner size={8} color="green"/>
    </div>
{:then track}
    <Card img={track.album.images[0].url} class="w-4/5 max-w-full m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700" horizontal>
        <p>Canzone</p>
        <h2 class="mb-1 text-3xl font-medium text-gray-900 dark:text-white">{track.name}</h2>
        <p>
        {#each track.artists as artist}
            <UserCircleSolid class="w-6 h-6 mr-2 flex"/> {artist.name}
        {/each} -
        <b>{track.album.name}</b>
        </p>
    </Card>




    <h1>{track.name}</h1>
    <div>
        <span>By</span>
        {#each track.artists as artist}
            <span>{artist.name}</span>
        {/each}
    </div>
    <h1>Album: {track.album.name}</h1>
    <div class="flex flex-col items-center">
        <Button color="primary" pill>
            <PlusOutline class="w-6 h-6 mr-2 text-white dark:text-white"/>
            Aggiungi a una playlist
            <ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white"/>
        </Button>
        <Dropdown class="overflow-y-auto px-3 pb-3 text-sm">
            {#await playlistsPromise}
                <div class="text-center mt-16">
                    <Spinner size={8} color="green"/>
                </div>
            {:then playlists}
                {#each playlists as playlist}
                    <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <Button on:click={() => addTrackToPlaylist(trackId, playlist._id)}>{playlist.name}</Button>
                    </li>
                {/each}
                <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <Button on:click={() => goto(`/playlist/new?from=${track.id}`)}>
                        <PlusOutline class="w-6 h-6 mr-2 text-white dark:text-white"/>
                        Nuova playlist
                    </Button>
                </li>
            {/await}
        </Dropdown>
    </div>
{/await}