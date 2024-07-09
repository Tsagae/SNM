<script>
    import {
        Alert,
        Button,
        Spinner,
        Card,
        Badge,
        Blockquote,
        Heading,
        P,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell, Toggle, Dropdown
    } from 'flowbite-svelte';
    import {
        InfoCircleSolid,
        PauseSolid,
        PlaySolid,
        HeartOutline,
        HeartSolid,
        ChevronDownOutline, 
        PlusOutline
    } from 'flowbite-svelte-icons';
    import {
        getPlaylistInfo,
        getTrackInfo,
        removeTrackFromPlaylist,
        getUser,
        deletePlaylist,
        editPlaylist,
        getMySavedPlaylists,
        removeSavedPlaylist,
        savePlaylist,
        sharePlaylist,
        getMyCommunities,
        addTrackToPlaylist
    } from '$lib/backend.js';
    import {goto} from '$app/navigation';
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
        playingState === 'paused' ? play() : pause()
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

    async function togglePublic(_id, isPublic) {
        await editPlaylist(_id, null, !isPublic, null, null, null);
        window.location.reload();
    }

    function containsPlaylistId(playlists, playlistId) {
        for (let playlist of playlists) {
            if (playlist._id === playlistId) {
                return true;
            }
        }
        return false;
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
                <InfoCircleSolid class="w-5 h-5"/>
                <span class="text-lg font-medium">ATTENZIONE</span>
            </div>
            <p class="mt-2 mb-4 text-sm">{playlist.error}</p>
            <div class="flex gap-2 items-center">
                <Button href="/" color="red" size="xs" outline>Torna alla Home</Button>
            </div>
        </Alert>
    {:else}
        <div>
            <Card class="max-w-7xl w-11/12 m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700"
                  style="background-image: linear-gradient(to left, rgba(255,0,0,0), rgba(63,63,70,1)),url('{playlist.thumbnail}'); background-repeat: no-repeat; background-position: right top; background-size: 50%;">
                <Heading tag="h1" customSize="text-6xl font-extrabold ">{playlist.name}</Heading>
                <div class="mt-6">
                    <Blockquote border bg class=" w-1/2 p-4 my-4 bg-gray-100 dark:bg-zinc-700">
                        <P size="xl" height="relaxed">{playlist.description}</P>
                    </Blockquote>
                    {#each playlist.tags as tag}
                        <Badge rounded color="green" class="mr-2">#{tag}</Badge>
                    {/each}
                </div>

                <br>

                <div class="flex">

                    {#await getUser(playlist.user)}
                        <div class="text-center mt-16">
                            <Spinner size={8} color="green"/>
                        </div>
                    {:then user}
                        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">by {user.username}</p>
                        <br>

                        {#if userId === playlist.user}
                            <Toggle checked={playlist.public} class="place-self-end"
                                    on:click={() => togglePublic(playlist._id, playlist.public)}> Pubblica
                            </Toggle>
                        {/if}
                    {/await}

                    {#await getMySavedPlaylists()}
                        <div class="text-center mt-16">
                            <Spinner size={8} color="green"/>
                        </div>
                    {:then savedPlaylists}
                        {#if containsPlaylistId(savedPlaylists, playlist._id)}
                            <Button class="mr-0 ml-auto" style="background: transparent; border:none;" on:click={async () => {
                                await removeSavedPlaylist(playlist._id);
                                window.location.reload();
                            }}>
                                <HeartSolid class="w-16 h-16 text-primary-500"/>
                            </Button>
                        {:else}
                            <Button class="mr-0 ml-auto" style="background: transparent; border:none;" on:click={async () => {
                                await savePlaylist(playlist._id);
                                window.location.reload();
                            }}>
                                <HeartOutline class="w-16 h-16 text-primary-500"/>
                            </Button>
                        {/if}
                    {/await}
                </div>

            </Card>
            <br>
            <div class="flex flex-col items-center ml-4">
                <Button color="primary" pill>
                    <PlusOutline class="w-6 h-6 mr-2 text-white dark:text-white"/>
                    Aggiungi a una playlist
                    <ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white"/>
                </Button>
                <Dropdown class="overflow-y-auto px-3 pb-3 text-sm">
                    {#await getMyCommunities()}
                        <div class="text-center mt-16">
                            <Spinner size={8} color="green"/>
                        </div>
                    {:then communities}
                        {#each communities as community}
                            <li class="rounded p-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600">
                                <Button on:click={async () => {await sharePlaylist(id, community._id); await goto(`/community/${community._id}`)}}
                                        class="w-full">{community.communityName}</Button>
                            </li>
                        {/each}
                    {/await}
                </Dropdown>
            </div>
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
                        {#await getTrackInfo(track.id)}
                            <!-- TODO: cambiare questo con getTracks per prenderle tutte in una volta sola (fare attenzione al max di 50) -->
                            <p>...waiting</p>
                        {:then track}
                            <TableBodyRow class="bg-white dark:bg-zinc-800">
                                <TableBodyCell>
                                    <a href="/track/{track.id}">{track.name}</a>
                                </TableBodyCell>
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
    {#if userId === playlist.user}
        <Button color="red" class="w-1/2 mx-auto mt-6" on:click={() => {deletePlaylist(playlist._id); goto("/")}}>
            Elimina playlist
        </Button>
    {/if}
{/await}