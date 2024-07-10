<script>
    import {
        Alert,
        Button,
        Card,
        Dropdown,
        Heading,
        Rating,
        Spinner
    } from 'flowbite-svelte';
    import {addTrackToPlaylist, getTrackInfo, myPlaylists, isValidToken} from '$lib/backend.js';
    import {ChevronDownOutline, PlusOutline, UserCircleSolid, PauseSolid, PlaySolid, InfoCircleSolid} from "flowbite-svelte-icons";
    import {goto} from "$app/navigation";
	import Playlist from '$lib/components/playlist.svelte';
    import { page } from '$app/stores';

    let trackId = $page.params.slug;
    let trackAdded = false;

    let logged = false;
    let playlistsPromise;

    async function checkToken() {
		let res = await isValidToken();
		return await res;
	};

	checkToken().then((res) => {
		console.log("RES: ", res)
		if (res != false) {
			if (!res.error){
				logged = true;
                playlistsPromise = myPlaylists();
			}
		}
	});		
    
    let playingState = 'paused'
    let song = ''

    function loadSong() {
        song = new Audio(song)
        song.volume = 0.2
        song.play()
    }

    function play() {
        if (playingState === 'playing') {
            pause()
        }

        playingState = 'playing'
        loadSong()
    }

    function playSelectedSong(track) {
        if (playingState === 'playing') {
            return pause()
        }
        song = track
        play()
    }

    function pause() {
        playingState = 'paused'
        song.pause()
    }
</script>

{#await getTrackInfo(trackId)}
    <div class="text-center mt-16">
        <Spinner size={8} color="green"/>
    </div>
{:then track}
    <Card img={track.album.images[0].url} class="w-4/5 max-w-full m-auto mt-6 mb-2 bg-gray-100 dark:bg-zinc-700" horizontal>
        <p>Canzone</p>
        <br>
        <Heading tag="h1" class="mb-4" customSize="text-2xl font-extrabold md:text-5xl lg:text-6xl">{track.name}</Heading>
        <br><br>
        {#each track.artists as artist}
            {artist.name}&nbsp;
        {/each} - &nbsp;
        <b>{track.album.name}</b>, {track.album.release_date}
    </Card>
    
    <div class="w-4/5 max-w-full m-auto mt-6 mb-2 flex justify-center">

        <Rating id="example-1b" total={5} size={50} rating={(track.popularity*5)/100}> <p slot="text" class="ms-2 text-sm font-medium text-gray-500 dark:text-gray-400">Popolarità: {(track.popularity*5)/100} su 5</p> </Rating> 
    
    </div>

    <div class="w-4/5 max-w-full m-auto mt-6 mb-2 flex">

        <Button on:click={() => playSelectedSong(track.preview_url)} pill shadow>      
            {#if playingState == 'playing'}
                <PauseSolid class="mr-2"/> {Math.floor(track.duration_ms / 60000)}:{(((track.duration_ms % 60000) / 1000).toFixed(0)) < 10 ? '0' : ''}{((track.duration_ms % 60000) / 1000).toFixed(0)}
            {:else}
                <PlaySolid class="mr-2"/> {Math.floor(track.duration_ms / 60000)}:{(((track.duration_ms % 60000) / 1000).toFixed(0)) < 10 ? '0' : ''}{((track.duration_ms % 60000) / 1000).toFixed(0)}
            {/if}
        </Button> 
    
        {#if logged}
            <div class="flex flex-col items-center ml-4">
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
                            {#if !playlist.tracks.find(o => o.id === trackId)}
                                <li class="rounded p-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <Button on:click={() => {
                                        let res = addTrackToPlaylist(trackId, playlist._id);
                                        trackAdded = true;
                                        }} class="w-full">{playlist.name}</Button>
                                </li>
                            {/if}
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
        {/if}
    </div>
{/await}

{#if trackAdded}            
    <Alert color="green" class="bg-white dark:bg-zinc-800">
        <InfoCircleSolid slot="icon" class="w-5 h-5" />
        ATTENZIONE: Canzone inserita con successo!
    </Alert>
{/if}