<script>
    import {
        Alert,
        Button,
        Spinner,
        Card,
        Badge,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from 'flowbite-svelte';
    import {InfoCircleSolid, PlayOutline} from 'flowbite-svelte-icons';
    import {getPlaylistInfo, getTrackInfo, removeTrackFromPlaylist} from '$lib/backend.js';
    import {goto} from '$app/navigation'
    import {error} from '@sveltejs/kit';

    let pageInfo = window.location.pathname;
    let id = pageInfo.replace("/playlist/", "");
    id = id.replace("/", "");

    const playlistInfo = getPlaylistInfo(id);
    const userId = localStorage.getItem("userId")
</script>

{#await playlistInfo}
    <div class="text-center mt-16">
        <Spinner size={8} color="green"/>
    </div>
{:then playlist}
    {#if playlist == false}
        <Alert color="red" class="bg-gray-100 dark:bg-zinc-700">
            <div class="flex items-center gap-3">
                <InfoCircleSolid class="w-5 h-5"/>
                <span class="text-lg font-medium">ATTENZIONE</span>
            </div>
            <p class="mt-2 mb-4 text-sm">Per poter vedere la playlist devi essere loggato</p>
            <div class="flex gap-2 items-center">
                <Button href="/" color="red" size="xs" outline>Torna alla Home</Button>
            </div>
        </Alert>
    {:else}
        <div>
            <Card class="max-w-7xl m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{playlist.name}</h5>
                <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight place-self-end">
                    by {playlist.user}</p> <br>
            </Card>
            {#each playlist.tags as tag}
                <Badge rounded color="green" class="mx-2">#{tag}</Badge>
            {/each}
            <br><br>
        </div>
        <div>
            <!-- Possiamo mettere un filtro di ricerca già fatto qua -->
            <Table shadow hoverable>
                <TableHead class="bg-gray-100 dark:bg-zinc-700">
                    <TableHeadCell>Canzone</TableHeadCell>
                    <TableHeadCell>Artista</TableHeadCell>
                    <TableHeadCell>Album</TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                </TableHead>
                <TableBody tableBodyClass="divide-y">
                    {#each playlist.tracks as track}
                        {#await getTrackInfo(track)}
                            <p>...waiting</p>
                        {:then track}
                            <TableBodyRow class="bg-white dark:bg-zinc-800">
                                <TableBodyCell><Button on:click={() => goto(`/track/${track.id}`)}>{track.name}</Button></TableBodyCell>
                                <TableBodyCell>
                                    {#each track.artists as artist}
                                        {artist.name}
                                    {/each}
                                </TableBodyCell>
                                <TableBodyCell>{track.album.name}</TableBodyCell>
                                <TableBodyCell>
                                    {#if userId === playlist.user}
                                        <Button on:click={() => removeTrackFromPlaylist(track.id, playlist._id)}>Rimuovi</Button>
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