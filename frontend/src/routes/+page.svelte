<script>
    import {
        Badge,
        Button,
        Checkbox,
        Dropdown,
        Heading,
        Img,
        Spinner,
        Table,
        TableBody,
        TableBodyRow,
        TableBodyCell
    } from 'flowbite-svelte';
    import {ChevronDownOutline, FilterOutline} from 'flowbite-svelte-icons';
    import {search, getPubPlaylist, getUser} from '$lib/backend.js';
    import Playlist from '$lib/components/playlist.svelte';
    import {goto} from "$app/navigation";

    let keyword = '';

    let searching = false;

    let filters = {
        playlist: true,
        track: true,
    }

    let searchResults;

    //REQUIRES: i filtri devono essere visibili al caricamento del documento
    async function searchForm() {
        searching = true;
        let filterStrings = []
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                filterStrings.push(key.toString())
            }
        }
        searchResults = search(keyword, filterStrings);
    }
</script>

<Img src="/SNMlogo.png" alignment="mx-auto" alt="SNM"/>

<form class="max-w-md mx-auto" on:submit={searchForm}>
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Cerca</label>
    <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input bind:value={keyword} type="search" id="default-search"
               class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
               placeholder="Parola chiave..." required/>
        <button type="submit" color="primary"
                class="text-white absolute end-2.5 bottom-2.5 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">
            Cerca
        </button>
    </div>
</form>
<br>

<div class="flex flex-col items-center">
    <Button color="primary" pill>
        <FilterOutline class="w-6 h-6 mr-2 text-white dark:text-white"/>
        Filtri
        <ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white"/>
    </Button>
    <Dropdown class="overflow-y-auto px-3 pb-3 text-sm">
        {#each Object.entries(filters) as [label, state]}
            <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                {#if state}
                    <Checkbox name="filter" value="{label}" checked
                              on:change={() => filters[label] = !filters[label]}>{label}</Checkbox>
                {:else}
                    <Checkbox name="filter" value="{label}"
                              on:change={() => filters[label] = !filters[label]}>{label}</Checkbox>
                {/if}
            </li>
        {/each}
    </Dropdown>
</div>
<br><br>

{#if !searching}
    {#await getPubPlaylist()}
        <div class="text-center">
            <Spinner size={8} color="green"/>
        </div>
    {:then playlist}
        {#each playlist as {_id, name, user, tracks, tags, thumbnail}, i}
            {#await getUser(user)}
                <div class="text-center">
                    <Spinner size={8} color="green"/>
                </div>
            {:then userFromBackend}
                <Playlist id={_id} name={name} user={userFromBackend.username} tracks={tracks} tags={tags}
                          thumbnail={thumbnail} i={i}/>
            {/await}
            <br><br>
        {/each}
    {/await}
{:else}
    {#await searchResults}
        <div class="text-center">
            <Spinner size={8} color="green"/>
        </div>
    {:then results}
        {#if filters.track}
            <Heading tag="h1" class="flex items-center" size="text-5xl">
                Risultati <Badge class="text-2xl font-semibold ms-2">Canzoni</Badge>
            </Heading>
            {#each results.tracks.items as track}
                <Table class="max-w-7xl w-11/12 m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700" shadow hoverable>
                    <TableBody tableBodyClass="divide-y">
                        <TableBodyRow on:click={() => goto("/track/" + track.id)} class="bg-white dark:bg-zinc-800 cursor-pointer">
                            <TableBodyCell>
                                {track.name}
                            </TableBodyCell>
                        </TableBodyRow>
                    </TableBody>
                </Table>
            {/each}
            <hr>
        {/if}
        {#if filters.playlist}
            <Heading tag="h1" class="flex items-center mt-4" size="text-5xl">
                Risultati <Badge class="text-2xl font-semibold ms-2">Plylists</Badge>
            </Heading>
            {#each results.playlists as playlist}
                <Table class="max-w-7xl w-11/12 m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700" shadow hoverable>
                    <TableBody tableBodyClass="divide-y">
                        <TableBodyRow on:click={() => goto("/playlist/" + playlist._id)} class="bg-white dark:bg-zinc-800 cursor-pointer">
                            <TableBodyCell>
                               {playlist.name}
                            </TableBodyCell>
                        </TableBodyRow>
                    </TableBody>
                </Table>
            {/each}
            <hr>
        {/if}
    {/await}
{/if}
