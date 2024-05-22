<script>
    import { 
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
    import {getPlaylistInfo} from '$lib/backend.js';

    let pageInfo = window.location.pathname;
    let id = pageInfo.replace("/playlist/", "");

    const playlistInfo = getPlaylistInfo(id);

</script>

    {#await playlistInfo}
        <div class="text-center"><Spinner size={8} color="green" /></div>
    {:then playlist}
        <div>
            <Card class="max-w-7xl m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{playlist.name}</h5>
                <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">by {playlist.user}</p> <br>
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
                  <TableHeadCell>Song</TableHeadCell>
                  <TableHeadCell>Artist</TableHeadCell>
                  <TableHeadCell>Album</TableHeadCell>
                  <TableHeadCell>Somewhat</TableHeadCell>
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
    {/await}
