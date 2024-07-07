<script>
    import {Label, Input, Textarea, Toggle, Button, Spinner} from 'flowbite-svelte';
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


