<script>
    import { 
    Alert,
    Button,
    Spinner,
    Card,
    Badge,
    Heading, 
    Table, 
    TableBody, 
    TableBodyCell, 
    TableBodyRow, 
    TableHead, 
    TableHeadCell
    } from 'flowbite-svelte';
    import {InfoCircleSolid, PauseSolid, PlaySolid} from 'flowbite-svelte-icons';
    import {getPlaylistInfo, getTrackInfo, removeTrackFromPlaylist} from '$lib/backend.js';
    import {goto} from '$app/navigation'
    import {error} from '@sveltejs/kit';

    let pageInfo = window.location.pathname;
    let id = pageInfo.replace("/playlist/", "");
    id = id.replace("/", "");

    const playlistInfo = getPlaylistInfo(id);
    const userId = localStorage.getItem("userId");

    let playingState = 'paused'
	let songPlaying = ''
	let song = ''

	function togglePlaying() {
		playingState === 'paused'? play() : pause()
	}

	function loadSong() {
		song = new Audio(songPlaying)
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
        console.log("PLAY ", songPlaying);

		if (track == songPlaying) {
			songPlaying = ''
			return pause()
		}

		songPlaying = track
		play()
	}

	function pause() {
		playingState = 'paused'
		song.pause()
	}
</script>
    
    {#await playlistInfo}
        <div class="text-center mt-16">
            <Spinner size={8} color="green"/>
        </div>
    {:then playlist}
        {#if playlist.error !== undefined}
            <Alert color="red" class="bg-gray-100 dark:bg-zinc-700">
                <div class="flex items-center gap-3">
                    <InfoCircleSolid class="w-5 h-5" />
                    <span class="text-lg font-medium">ATTENZIONE</span>
                </div>
                <p class="mt-2 mb-4 text-sm">{playlist.error}</p>
                <div class="flex gap-2 items-center">
                    <Button href="/" color= "red" size="xs" outline>Torna alla Home</Button>
                </div>
            </Alert>
        {:else}
            <div>
                <Card class="max-w-7xl w-11/12 m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700" style="background-image: linear-gradient(to left, rgba(255,0,0,0), rgba(63,63,70,1)),url('{playlist.thumbnail}'); background-repeat: no-repeat; background-position: right top; background-size: 50%;">
                    <Heading tag="h1" customSize="text-6xl font-extrabold ">{playlist.name}</Heading>
                    <div class="mt-6">
                        {#each playlist.tags as tag}
                            <Badge rounded color="green" class="mx-1">#{tag}</Badge> 
                        {/each}
                    </div>
                    <br>
                    <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">by {playlist.user}</p> <br>
                </Card>
                <br>
            </div>
            <div>
                <Table class="max-w-7xl w-11/12 m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700" shadow hoverable>
                    <TableHead class="bg-gray-100 dark:bg-zinc-700">
                        <TableHeadCell>Canzone</TableHeadCell>
                        <TableHeadCell>Artista</TableHeadCell>
                        <TableHeadCell>Album</TableHeadCell>
                        <TableHeadCell>Anteprima</TableHeadCell>
                        {#if userId === playlist.user}
                            <TableHeadCell>Modifiche</TableHeadCell>
                        {/if}
                    </TableHead>
                <TableBody tableBodyClass="divide-y">
                    {#each playlist.tracks as track}
                        {#await getTrackInfo(track)}
                            <!-- TODO: cambiare questo con getTracks per prenderle tutte in una volta sola (fare attenzione al max di 50) -->
                            <p>...waiting</p>
                        {:then track}
                            <TableBodyRow class="bg-white dark:bg-zinc-800" >
                                <TableBodyCell class="cursor-pointer" on:click={() => goto(`/track/${track.id}`)}>{track.name}</TableBodyCell>
                                <TableBodyCell>
                                    {#each track.artists as artist}
                                        {artist.name}
                                    {/each}
                                </TableBodyCell>
                                <TableBodyCell>{track.album.name}</TableBodyCell>
                                <TableBodyCell>
                                    <Button on:click={() => playSelectedSong(track.preview_url)} pill shadow>
                                        {#if playingState === 'playing' && track.preview_url === songPlaying}
                                        <PauseSolid/>
                                        {:else}
                                        <PlaySolid/>
                                        {/if}
                                    </Button>
                                </TableBodyCell>
                                <TableBodyCell>
                                    {#if userId === playlist.user}
                                        <Button on:click={() => removeTrackFromPlaylist(track.id, playlist._id)}>
                                            Rimuovi
                                        </Button>
                                    {/if}
                                </TableBodyCell>
                            </TableBodyRow>
                        {:catch error}
                            <p style="color: red">{error.message}</p>
                        {/await}
                    {/each}
                </TableBody>
            </Table>
        </div>
    {/if}
{/await}