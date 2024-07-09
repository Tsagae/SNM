<script>
    import {
        Label, 
        Input, 
        Button, 
        Checkbox,
        Spinner,
        Heading,
		Mark
    } from 'flowbite-svelte';
    import {editUser, getMyInfo, getArtist} from '$lib/backend.js';
    import {goto} from "$app/navigation";
    import {InfoCircleSolid} from "flowbite-svelte-icons";

    let artistiPref = [];
    let generiPref = [];
	let username;
	let mail;

	async function fetchUserData() {
        const userInfo = await getMyInfo();
        username = userInfo.username;
        mail = userInfo.email;
        return userInfo
    }

    async function submitForm() {
        await editUser(username, mail, artistiPref, generiPref);
        window.location.reload();
    }

    let keywordArt = '';
    let searchingArt = false;

    let artistRes;

    async function searchFormArtists() {
        searchingArt = true;
        const res = await fetch('http://localhost:3000/searchArtist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ artistname: keywordArt }),
        });
        return res.json();
    }

    function startSearchArt() {
		artistRes = searchFormArtists();
	}

    let searchingGen = false;

    let genresRes;

    async function searchFormGenres() {
        searchingGen = true;
        const res = await fetch('http://localhost:3000/getGenres', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.json();
    }

    function startSearchGen() {
		genresRes = searchFormGenres();
	}

</script>

<Heading tag="h1" class="my-4 mx-auto w-auto">Raccontaci le tue <Mark class="bg-primary-500 dark:bg-primary-500">Preferenze</Mark> musicali</Heading>

<br><br>

<div class="flex">
    <div class="w-1/2 p-4">
        <form class="max-w-md mx-auto" on:submit={startSearchArt}>
            <label for="default-search" class="mb-2 text-sm font-medium text-zinc-900 sr-only dark:text-white">Cerca Artista</label>
            <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-zinc-500 dark:text-zinc-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input bind:value={keywordArt} type="search" id="default-search"
                       class="block w-full p-4 ps-10 text-sm text-zinc-900 border border-zinc-300 rounded-lg bg-zinc-50 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                       placeholder="Modifica Preferenze Artisti" required/>
                <button type="submit" color="primary"
                        class="text-white absolute end-2.5 bottom-2.5 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">
                    Cerca
                </button>
            </div>
        </form>
        
        <br>
    
        {#if searchingArt}
            {#await artistRes}
                <div class="text-center">
                    <Spinner size={8} color="green"/>
                </div>
            {:then results}
                <p class="mb-4 font-semibold text-zinc-900 dark:text-white">Artisti preferiti correnti:</p>
                <ul class="w-48 mb-4 mx-auto bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-600 divide-y divide-zinc-200 dark:divide-zinc-600">
                    {#each artistiPref as artista, i}
                        <li>
                            <Checkbox class="p-3" id="art{i}" checked on:change={() => {
                                if(document.getElementById("art" + i).checked){
                                    artistiPref.push(artista);
                                } else {
                                    artistiPref.splice(artistiPref.indexOf(artista),1);
                                }
                            }}>
                                {#await getArtist(artista)}
                                <div class="text-center">
                                    <Spinner size={8} color="green"/>
                                </div>
                                {:then res}
                                    {res.name}
                                {/await}
                            </Checkbox>
                        </li>
                    {/each}
                </ul>
        
                <p class="mb-4 font-semibold text-zinc-900 dark:text-white">Artisti trovati:</p>
                <ul class="w-48 mx-auto bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-600 divide-y divide-zinc-200 dark:divide-zinc-600">            
                    {#each results.artists.items as newArtista, i}
                        <li>
                            <Checkbox class="p-3" id="newArt{i}" on:change={() => {
                                if(document.getElementById("newArt" + i).checked){
                                    artistiPref.push(newArtista.id);
                                } else {
                                    artistiPref.splice(artistiPref.indexOf(newArtista.id),1);
                                }
                            }}>{newArtista.name}</Checkbox>
                        </li>
                    {/each}
                </ul>
            {/await}
        {/if}    
    </div>
    
    <div class="w-1/2 p-4">
        <Button class="ml-32 mb-6" on:click={() => {startSearchGen()}}>Cerca Generi</Button>        
        <br>
    
        {#if searchingGen}
            {#await genresRes}
                <div class="text-center">
                    <Spinner size={8} color="green"/>
                </div>
            {:then resultsGen}        
                <p class="mb-4 font-semibold text-zinc-900 dark:text-white">Generi disponibili:</p>
                <ul class="w-48 mx-auto bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-600 divide-y divide-zinc-200 dark:divide-zinc-600">            
                    {#each resultsGen.genres as genere, i}
                        {#if generiPref.includes(genere)}
                            <li>
                                <Checkbox class="p-3" id="newGen{i}" checked on:change={() => {
                                    if(document.getElementById("newGen" + i).checked){
                                        generiPref.push(genere);
                                    } else {
                                        generiPref.splice(generiPref.indexOf(genere),1);
                                    }
                                }}>{genere}</Checkbox>
                            </li>
                        {:else}
                            <li>
                                <Checkbox class="p-3" id="newGen{i}" on:change={() => {
                                    if(document.getElementById("newGen" + i).checked){
                                        generiPref.push(genere);
                                    } else {
                                        generiPref.splice(generiPref.indexOf(genere),1);
                                    }
                                }}>{genere}</Checkbox>
                            </li>
                        {/if}
                    {/each}
                </ul>
            {/await}
        {/if}    
    </div>
</div>

<div class="flex">
	{#await fetchUserData()}
		<div class="text-center mt-16">
			<Spinner size={8} color="green"/>
		</div>
	{:then userData}
		<form on:submit={submitForm}>
			<Button class="ml-6" type="submit">Aggiorna</Button>
		</form>
	{/await}

	<Button class="ml-6" on:click={() => {goto("/"); }}>
		Salta per ora
	</Button>

</div>