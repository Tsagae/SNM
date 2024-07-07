<script>
    import {
        Label, 
        Input, 
        Textarea, 
        Toggle, 
        Button, 
        Spinner,
        Heading,
        Table,
        TableBody,
        TableBodyRow,
        TableBodyCell
    } from 'flowbite-svelte';
    import {deleteUser, editUser, getMyInfo} from '$lib/backend.js';
    import {goto} from "$app/navigation";

    const formValues = {
        "username": "",
        "email": ""
    }

    if (localStorage.getItem('authToken') === null) {
        alert("Non puoi visualizzare questa pagina");
        goto("/");
    }

    async function fetchUserData() {
        const userInfo = await getMyInfo();
        formValues.username = userInfo.username;
        formValues.email = userInfo.email;
        return userInfo
    }

    async function submitForm() {
        await editUser(formValues.username, formValues.email, null, null);
        window.location.reload();
    }

    let keyword = '';
    let searchResults;

    async function searchFormArtists() {
        const res = await fetch('http://localhost:3000/searchArtist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ artistname: keyword }),
        });

        console.log( JSON.stringify(res))

        searchResults = JSON.stringify(res);
    }

</script>
{#await fetchUserData()}
    <div class="text-center mt-16">
        <Spinner size={8} color="green"/>
    </div>
{:then userData}
    <form on:submit={submitForm} class="max-w-md mx-auto">
        <div class="mb-6">
            <Label for="playlist-name" class="block mb-2">Username</Label>
            <Input bind:value={formValues.username} id="playlist-name" placeholder="..."/>
        </div>
        <div class="mb-6">
            <Label for="playlist-name" class="block mb-2">email</Label>
            <Input bind:value={formValues.email} id="playlist-name" placeholder="..."/>
        </div>
        <div class="mb-6">
            <Button type="submit">Aggiorna</Button>
        </div>
        <Button on:click={() => {deleteUser(); localStorage.removeItem('authToken'); goto("/"); }}>
            Cancella utente
        </Button>
    </form>
{/await}

<br><br>

<form class="max-w-md mx-auto" on:submit={searchFormArtists}>
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Cerca Artista</label>
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
               placeholder="Cerca Artista" required/>
        <button type="submit" color="primary"
                class="text-white absolute end-2.5 bottom-2.5 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">
            Cerca
        </button>
    </div>
</form>


{#await searchResults}
<div class="text-center">
    <Spinner size={8} color="green"/>
</div>
{:then results}
    <Heading tag="h1" class="flex items-center" size="text-5xl">
        Artisti trovati
    </Heading>
    {results}
    <!-- {#each results.tracks.items as track}
        <Table class="max-w-7xl w-11/12 m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700" shadow hoverable>
            <TableBody tableBodyClass="divide-y">
                <TableBodyRow class="bg-white dark:bg-zinc-800">
                    <TableBodyCell>
                        <a href="/track/{track.id}">{track.name}</a>
                    </TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>
    {/each} -->
{/await}