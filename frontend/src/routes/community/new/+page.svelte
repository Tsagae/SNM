<script>
    import {
        Alert,
        Label, 
        Input, 
        Button, 
        Checkbox,
        Spinner,
        Heading
    } from 'flowbite-svelte';
    import {
        useForm,
		Hint,
		HintGroup,
		validators,
		required,
    } from 'svelte-use-form';
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    import {goto} from "$app/navigation";

    const form = useForm();
    const requiredMessage = 'Questo campo è necessario';
    const formValues = {
        "name": "",
    }

    let listaUtenti = [];
    let listaNomi = [];

    if (localStorage.getItem('authToken') === null) {
        alert("Non puoi visualizzare questa pagina");
        goto("/");
    }

    async function submitForm() {
        const res = await fetch('http://localhost:3000/createCommunity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            },
            body: JSON.stringify({ 
                users: listaUtenti,
                communityName: $form.name.value
             })
        });

        if(res.ok){
            window.location.reload();
        } else {
            alert("qualcosa è andato storto");
        }
        
    }

    let keywordUsr = '';
    let searchingUsr = false;

    let utentiRes;

    async function searchFormUtenti() {
        searchingUsr = true;
        const res = await fetch('http://localhost:3000/searchUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            },
            body: JSON.stringify({ username: keywordUsr }),
        });
        return res.json();
    }

    function startSearchUser() {
		utentiRes = searchFormUtenti();
	}

    function aggUtente(id, nome) {
        listaUtenti = [...listaUtenti, id];
        listaNomi = [...listaNomi, nome];
	}

    function togliUtente(id, nome) {
        listaUtenti.splice(listaUtenti.indexOf(id),1);
        listaUtenti = listaUtenti;
        listaNomi.splice(listaNomi.indexOf(nome),1);
        listaNomi = listaNomi;
	}
</script>

<Heading tag="h1" class="w-full mt-6 mb-4 text-center">Crea un nuovo gruppo!</Heading>


<form class="w-2/3 mx-auto" use:form method="post">
    <Label class="space-y-2">
        <span>Nome Gruppo</span>
        <input class="block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg" placeholder="Tokyo Drifter Gang" name="name" use:validators={[required]} required />
    </Label>
    <HintGroup for="name">
        <Hint on="required">
            <Alert color="red" class="bg-white dark:bg-zinc-800">
                <InfoCircleSolid slot="icon" class="w-5 h-5" />
                {requiredMessage}
            </Alert>
        </Hint>
    </HintGroup>
    <button class="text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg mt-6" type="submit" disabled={!$form.valid} on:click|preventDefault={submitForm}>Crea</button>
</form>
<br>

<div class="w-2/3 mx-auto">
    <form class="w-full" on:submit={startSearchUser}>
        <label for="default-search" class="mb-2 text-sm font-medium text-zinc-900 sr-only dark:text-white">Cerca Utenti</label>
        <div class="relative w-full">
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