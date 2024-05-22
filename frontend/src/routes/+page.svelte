<script>
    import {
        Button,
        Checkbox,
        Dropdown, 
        Img,
        Spinner
    } from 'flowbite-svelte';
    import {ChevronDownOutline, FilterOutline} from 'flowbite-svelte-icons';
    import {search, getPubPlaylist} from '$lib/backend.js';
	import Playlist from '$lib/components/playlist.svelte';

    let keyword = '';
    let pubPlaylist = [];

    pubPlaylist = getPubPlaylist();

    let results = {};

    //REQUIRES: i filtri devono essere visibili al caricamento del documento
    async function searchForm() {
        let checkboxes= document.querySelectorAll('input[name="filter"]:checked');
        let filters= [];
        checkboxes.forEach((checkbox) => {
            filters.push(checkbox.value);
        });
        results = await search(keyword, filters); 
        //songs = results;
        console.log(results);
    }
</script>

<Img src="/SNMlogo.png" alignment="mx-auto" alt="SNM" />

<form class="max-w-md mx-auto" on:submit={searchForm}>   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input bind:value={keyword} type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500" placeholder="Keyword" required />
        <button type="submit" color="primary" class="text-white absolute end-2.5 bottom-2.5 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">Search</button>
    </div>
</form>
<br>

<div class="flex flex-col items-center">
    <Button color="primary" pill><FilterOutline class="w-6 h-6 mr-2 text-white dark:text-white"/>Filters<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
    <Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-40">
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
            <Checkbox name="filter" value="album" id="album" checked>Album</Checkbox>
        </li>
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
            <Checkbox name="filter" value="artist" id="artist" checked>Artist</Checkbox>
        </li>
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
            <Checkbox name="filter" value="playlist" id="playlist" checked>Playlist</Checkbox>
        </li>
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
            <Checkbox name="filter" value="track" id="track" checked>Track</Checkbox>
        </li>
    </Dropdown>
</div>
<br><br>

{#await pubPlaylist}
    <div class="text-center"><Spinner size={8} color="green" /></div>
{:then playlist}
    {#each playlist as { _id, name, user, tracks, tags}, i}
        <Playlist id={_id} name={name} user={user} tracks={tracks} tags={tags} i={i}/>
        <br><br>
    {/each}
{/await}


