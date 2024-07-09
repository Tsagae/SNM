<script>
    import {
        Label, 
        Input, 
        Button, 
        Checkbox,
        Spinner,
        Heading
    } from 'flowbite-svelte';
    import {goto} from "$app/navigation";

    const formValues = {
        "name": "",
    }

    let listaUtenti = [];

    if (localStorage.getItem('authToken') === null) {
        alert("Non puoi visualizzare questa pagina");
        goto("/");
    }

    async function submitForm() {
        await createCommunity(localStorage.getItem("userId"), listaUtenti, formValues.name);
        window.location.reload();
    }

    let keywordUsr = '';
    let searchingUsr = false;

    let utentiRes;

    async function searchFormUtenti() {
        searchingArt = true;
        const res = await fetch('http://localhost:3000/QUALCOSA', {//!!!!!!!!!!!!!!!!!!
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userKey: keywordUsr }),
        });
        return res.json();
    }

    function startSearchUser() {
		artistRes = searchFormUtenti();
	}
</script>

<Heading tag="h1" class="w-full mt-6 mb-4 text-center">Crea un nuovo gruppo!</Heading>

<form on:submit={submitForm} class="w-1/2 mt-6 mx-auto">
    <div class="mb-6">
        <Label for="playlist-name" class="block mb-2">Nome gruppo</Label>
        <Input bind:value={formValues.name} id="playlist-name" class="bg-gray-100 dark:bg-zinc-700" placeholder="Tokyo Drifter Gang"/>
    </div>
    <div class="mb-6">
        <Button type="submit">Crea</Button>
    </div>
</form>

<br><br>

<div class="w-1/2 mx-auto p-4">
    <form class="max-w-md mx-auto" on:submit={startSearchUser}>
        <label for="default-search" class="mb-2 text-sm font-medium text-zinc-900 sr-only dark:text-white">Cerca Utenti</label>
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-zinc-500 dark:text-zinc-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
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
            <p class="mb-4 font-semibold text-zinc-900 dark:text-white">Utenti trovati:</p>
            <ul class="w-48 mx-auto bg-white rounded-lg border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-600 divide-y divide-zinc-200 dark:divide-zinc-600">            
                {#each results.users.items as newUser, i}
                    <li>
                        <Checkbox class="p-3" id="newUsr{i}" on:change={() => {
                            if(document.getElementById("newUsr" + i).checked){
                                listaUtenti.push(newUser.id);
                            } else {
                                listaUtenti.splice(listaUtenti.indexOf(newUser.id),1);
                            }
                        }}>{newUser.name}</Checkbox>
                    </li>
                {/each}
            </ul>
        {/await}
    {/if}    
</div>