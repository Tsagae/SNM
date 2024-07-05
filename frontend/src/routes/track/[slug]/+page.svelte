<script>
    import {addTrackToPlaylist, getTrackInfo, myPlaylists} from '$lib/backend.js';
    import {Dropdown, Spinner, Button} from "flowbite-svelte";
    import {ChevronDownOutline, PlusOutline} from "flowbite-svelte-icons";

    let pageInfo = window.location.pathname;
    let trackId = pageInfo.replace("/track/", "");
    trackId = trackId.replace("/", "");
    let playlistsPromise = myPlaylists();
    //TODO: aggiungere feedback al completamento di addTrackToPlaylist
</script>


<h1>Track</h1>

{#await getTrackInfo(trackId)}
    <div class="text-center mt-16">
        <Spinner size={8} color="green"/>
    </div>
{:then track}
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
                    <h1>{JSON.stringify(playlist)}</h1>
                    <Button on:click={() => addTrackToPlaylist(trackId, playlist._id)}>{playlist.name}</Button>
                {/each}
            {/await}
        </Dropdown>
    </div>
{/await}