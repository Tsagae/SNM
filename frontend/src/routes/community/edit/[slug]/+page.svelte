<script>
    import {
        Label,
        Input,
        Button,
        Checkbox,
        Spinner
    } from 'flowbite-svelte';
    import {getCommunity, getUser, searchUser, editCommunity} from '$lib/backend.js';
    import {page} from "$app/stores";
    import LoginRequired from '$lib/components/loginrequired.svelte';

    const formValues = {
        "name": ""
    }
    const idComm = $page.params.slug;
    let listaUtenti = [];
    let listaNomi = [];

    async function fetchCommunityData() {
        const commInfo = await getCommunity(idComm);
        formValues.name = commInfo.communityName;
        if (commInfo.users !== undefined) {
            listaUtenti = commInfo.users;
        }
        for (let i in listaUtenti) {
            let membro = await getUser(listaUtenti[i]);
            listaNomi.push(membro.username);
        }
        return commInfo
    }

    async function submitForm() {
        await editCommunity(idComm, listaUtenti, formValues.name);
        window.location.reload();
    }

    let keywordUsr = '';
    let searchingUsr = false;

    let utentiRes;

    async function searchFormUtenti() {
        searchingUsr = true;
        return await searchUser(keywordUsr);
    }

    function startSearchUser() {
        utentiRes = searchFormUtenti();
    }

    function aggUtente(id, nome) {
        listaUtenti = [...listaUtenti, id];
        listaNomi = [...listaNomi, nome];
    }

    function togliUtente(id, nome) {
        listaUtenti.splice(listaUtenti.indexOf(id), 1);
        listaUtenti = listaUtenti;
        listaNomi.splice(listaNomi.indexOf(nome), 1);
        listaNomi = listaNomi;
    }
</script>

<LoginRequired>
    {#await fetchCommunityData()}
        <div class="text-center mt-16">
            <Spinner size={8} color="green"/>
        </div>
    {:then commData}
        <form on:submit={submitForm} class="w-1/2 mt-6 mx-auto">
            <div class="mb-6">
                <Label for="playlist-name" class="block mb-2">Nome</Label>
                <Input bind:value={formValues.name} class="bg-gray-100 dark:bg-zinc-700" id="playlist-name"
                       placeholder="..."/>
            </div>
            <div class="mb-6">
                <Button type="submit">Aggiorna</Button>
            </div>
        </form>
    {/await}

    <div class="w-2/3 mx-auto">
        <form class="w-full" on:submit={startSearchUser}>
            <label for="default-search" class="mb-2 text-sm font-medium text-zinc-900 sr-only dark:text-white">Cerca
                Utenti</label>
            <div class="relative w-full">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-zinc-500 dark:text-zinc-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input bind:value={keywordUsr} type="search" id="default-search"
                       class="block w-full p-4 ps-10 text-sm text-zinc-900 border border-zinc-300 rounded-lg bg-zinc-50 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                       placeholder="Cerca gli utenti da aggiungere al gruppo" required/>
                <button type="submit" color="primary"
                        class="text-white absolute end-2.5 bottom-2.5 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">
                    Cerca
                </button>
            </div>
        </form>

        <br>

        {#if searchingUsr}
            {#await utentiRes}
                <div class="text-center">
                    <Spinner size={8} color="green"/>
                </div>
            {:then results}
            <span class="mb-4 font-semibold text-zinc-900 dark:text-white">
                Lista utenti:
            </span>
                <span class="mb-4 text-zinc-900 dark:text-white">
                {#each listaNomi as usr}
                    {usr}, &nbsp;
                {/each}
            </span>
                <p class="mb-4 mt-4 font-semibold text-zinc-900 dark:text-white">Utenti trovati:</p>
                <ul class="w-48 mx-auto bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-600 divide-y divide-zinc-200 dark:divide-zinc-600">
                    {#each results as newUser, i}
                        <li>
                            {#if listaUtenti.includes(newUser._id)}
                                <Checkbox class="p-3" id="newUsr{i}" checked on:change={() => {
                            if(document.getElementById("newUsr" + i).checked){
                                aggUtente(newUser._id, newUser.username);
                            } else {
                                togliUtente(newUser._id, newUser.username);
                            }
                        }}>{newUser.username}</Checkbox>
                            {:else}
                                <Checkbox class="p-3" id="newUsr{i}" on:change={() => {
                            if(document.getElementById("newUsr" + i).checked){
                                aggUtente(newUser._id, newUser.username);
                            } else {
                                togliUtente(newUser._id, newUser.username);
                            }
                        }}>{newUser.username}</Checkbox>
                            {/if}
                        </li>
                    {/each}
                </ul>
            {/await}
        {/if}
    </div>
</LoginRequired>