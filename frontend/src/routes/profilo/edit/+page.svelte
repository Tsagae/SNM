<script>
    import {
        Alert,
        Label,
        Input,
        Textarea,
        Toggle,
        Button,
        Checkbox,
        Spinner,
        Heading
    } from 'flowbite-svelte';
    import {deleteUser, editUser, getMyInfo, getArtist, searchArtist, getGenres} from '$lib/backend.js';
    import {goto} from "$app/navigation";
    import {useForm, Hint, HintGroup, minLength, required, validators} from "svelte-use-form";
    import {containNumbers, hasUppercase} from "../../registration/customValidators.js";
    import {InfoCircleSolid} from "flowbite-svelte-icons";

    const requiredMessage = 'Questo campo è necessario';

    const formValues = {
        "username": "",
        "email": ""
    }

    let artistiPref = [];
    let generiPref = [];
    let newPassword = "";

    async function submitChangePassword() {
        /*await changePassword(newPassword);
        localStorage.removeItem('authToken');
        window.location.reload();
         */
    }

    if (localStorage.getItem('authToken') === null) {
        alert("Non puoi visualizzare questa pagina");
        goto("/");
    }

    async function fetchUserData() {
        const userInfo = await getMyInfo();
        formValues.username = userInfo.username;
        formValues.email = userInfo.email;
        if (userInfo.artists !== undefined) {
            artistiPref = userInfo.artists;
        }
        if (userInfo.genres !== undefined) {
            generiPref = userInfo.genres;
        }
        return userInfo
    }

    async function submitForm() {
        await editUser(formValues.username, formValues.email, artistiPref, generiPref);
        window.location.reload();
    }

    let keywordArt = '';
    let searchingArt = false;

    let artistRes;

    async function searchFormArtists() {
        searchingArt = true;
        return await searchArtist(keywordArt);
    }

    function startSearchArt() {
        artistRes = searchFormArtists();
    }

    let searchingGen = false;

    let genresRes;

    async function searchFormGenres() {
        searchingGen = true;
        return getGenres();
    }

    function startSearchGen() {
        genresRes = searchFormGenres();
    }

</script>

{#await fetchUserData()}
    <div class="text-center mt-16">
        <Spinner size={8} color="green"/>
    </div>
{:then userData}
    <form on:submit={submitForm} class="w-1/2 mt-6 mx-auto">
        <div class="mb-6">
            <Label for="playlist-name" class="block mb-2">Username</Label>
            <Input bind:value={formValues.username} class="bg-gray-100 dark:bg-zinc-700" id="playlist-name"
                   placeholder="..."/>
        </div>
        <div class="mb-6">
            <Label for="playlist-name" class="block mb-2">email</Label>
            <Input bind:value={formValues.email} class="bg-gray-100 dark:bg-zinc-700" id="playlist-name"
                   placeholder="..."/>
        </div>
        <div class="mb-6">
            <Button type="submit">Aggiorna</Button>
        </div>
    </form>

    <form on:submit={submitChangePassword}>
        <div class="mb-6">
            <Label for="password" class="block mb-2">Password</Label>
            <input bind:value={newPassword} class="bg-gray-100 dark:bg-zinc-700" id="password" name="password"
                   placeholder="NewPassword123!"
                   use:validators={[required, minLength(8), containNumbers(2), hasUppercase()]} required/>

        </div>
        <Button type="submit">Cambia password</Button>
    </form>
{/await}

<br><br>

<div class="flex">
    <div class="w-1/2 p-4">
        <form class="max-w-md mx-auto" on:submit={startSearchArt}>
            <label for="default-search" class="mb-2 text-sm font-medium text-zinc-900 sr-only dark:text-white">Cerca
                Artista</label>
            <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-zinc-500 dark:text-zinc-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
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
        <Button class="mb-6" on:click={() => {startSearchGen()}}>Cerca Generi</Button>
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

<hr>
<br>

<Button color="red" class="w-3/4 mx-auto"
        on:click={async () => {await deleteUser(); localStorage.removeItem('authToken'); await goto("/"); }}>
    Cancella utente
</Button>
