<script>
    import {Label, Input, Textarea, Toggle, Button} from 'flowbite-svelte';
    import {createPlaylist} from '$lib/backend.js';
    import {goto} from "$app/navigation";

    const urlParams = new URLSearchParams(window.location.search);

    const textareaprops = {
        id: 'playlist-description',
        name: 'playlist-description',
        label: 'playlist-description',
        rows: 4,
        placeholder: 'Descrivi la playlist...'
    };


    const formValues = {
        "name": "",
        "isPublic": false,
        "tracks": [],
        "tags": [],
        "description": ""
    }
    if (urlParams.has('from')) {
        formValues.tracks.push(urlParams.get("from"));
    }

    let tagsString = "";

    async function submitForm() {
        if (tagsString.match(/^\s*$/) === null) {
            formValues.tags = tagsString.split(",");
        }
        console.log("tagsString:", tagsString);
        console.log(formValues);
        try {
            let res = await createPlaylist(formValues.name, formValues.isPublic, formValues.tracks, formValues.tags, formValues.description);
            await goto(`/playlist/${res.insertedId}`);
        } catch (e) {
            alert(e);
        }
    }
</script>


<form on:submit={submitForm} class="max-w-md mx-auto">
    <div class="mb-6">
        <Label for="playlist-name" class="block mb-2">Nome</Label>
        <Input bind:value={formValues.name} id="playlist-name" placeholder="Nome della playlist"/>
    </div>
    <div class="mb-6">
        <Label for="playlist-description" class="block mb-2">Descrizione</Label>
        <Textarea bind:value={formValues.description} for="playlist-description" {...textareaprops}/>
    </div>
    <div class="mb-6">
        <Toggle checked={formValues.isPublic} on:click={() => formValues.isPublic = !formValues.isPublic}>Pubblica
        </Toggle>
    </div>
    <div class="mb-6">
        <Label for="playlist-tags" class="block mb-2">Tags</Label>
        <Input bind:value={tagsString} id="playlist-tags" placeholder="Tag1,Tag2,Tag3"/>
    </div>
    <div class="mb-6">
        {#if urlParams.has('from')}
            <p>Stai creando una playlist con questa canzone: {urlParams.get("from")}</p>
        {:else}
            <p>Stai creando una playlist vuota</p>
        {/if}
    </div>
    <div class="mb-6">
        <Button type="submit">Crea</Button>
    </div>
</form>

