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
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    import {getPlaylistInfo} from '$lib/backend.js';
	import { error } from '@sveltejs/kit';
	import Playlist from '$lib/components/playlist.svelte';

    let pageInfo = window.location.pathname;
    let id = pageInfo.replace("/playlist/", "");
    id = id.replace("/", "");

    const playlistInfo = getPlaylistInfo(id);

</script>

    {#await playlistInfo}
        <div class="text-center mt-16"><Spinner size={8} color="green" /></div>
    {:then playlist}
        {#if playlist == false}
            <Alert color="red" class="bg-gray-100 dark:bg-zinc-700">
                <div class="flex items-center gap-3">
                    <InfoCircleSolid class="w-5 h-5" />
                    <span class="text-lg font-medium">ATTENZIONE</span>
                </div>
                <p class="mt-2 mb-4 text-sm">Per poter vedere la playlist devi essere loggato</p>
                <div class="flex gap-2 items-center">
                    <Button href="/" color= "red" size="xs" outline>Torna alla Home</Button>
                </div>
            </Alert>
        {:else}
            <div>
                <Card class="max-w-7xl m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{playlist.name}</h5>
                    <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight place-self-end">by {playlist.user}</p> <br>
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
                    <TableHeadCell>Altro...</TableHeadCell>
                    </TableHead>
                    <TableBody tableBodyClass="divide-y">
                        {#each playlist.tracks as track}
                        <TableBodyRow class="bg-white dark:bg-zinc-800">
                            <TableBodyCell>{track}</TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>2</TableBodyCell>
                            <TableBodyCell>3</TableBodyCell>
                        </TableBodyRow>
                        {/each}
                    </TableBody>
                </Table>
            </div>
        {/if}
    {/await}
