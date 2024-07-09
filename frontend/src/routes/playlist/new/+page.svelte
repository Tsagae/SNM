<script>
    import {
        Label,
        Heading,
        Input,
        Textarea,
        Toggle,
        Button,
        Spinner,
        Span
    } from 'flowbite-svelte';
    import {createPlaylist, getTrackInfo, addTrackToPlaylist} from '$lib/backend.js';
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

    let tagsString = "";

    async function submitForm() {
        if (tagsString.match(/^\s*$/) === null) {
            formValues.tags = tagsString.split(",");
        }
        try {
            let res = await createPlaylist(formValues.name, formValues.isPublic, formValues.tracks, formValues.tags, formValues.description);
            if (urlParams.has('from')) {
                await addTrackToPlaylist(urlParams.get("from"), res.insertedId);
            }
            await goto(`/playlist/${res.insertedId}`);
        } catch (e) {
            alert(e);
        }
    }
</script>

<div class="mb-6">
    {#if urlParams.has('from')}
        <Heading tag="h3" class="w-full text-center mt-6">Stai creando una playlist con questa canzone:
            {#await getTrackInfo(urlParams.get("from"))}
                <div class="text-center mt-16">
                    <Spinner size={8} color="green"/>
                </div>
            {:then track}
                <Span gradient>{track.name}</Span>
            {/await}
        </Heading>
    {:else}
        <Heading tag="h3">Stai creando una playlist vuota</Heading>
    {/if}
</div>

<form on:submit={submitForm} class="w-2/3 mx-auto">
    <div class="mb-6">
        <Label for="playlist-name" class="block mb-2">Nome</Label>
        <Input bind:value={formValues.name} id="playlist-name" placeholder="Nome della playlist"
               class="block w-full text-sm text-zinc-900 border border-zinc-300 rounded-lg bg-zinc-50 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"/>
    </div>
    <div class="mb-6">
        <Label for="playlist-description" class="block mb-2">Descrizione</Label>
        <Textarea bind:value={formValues.description} for="playlist-description" {...textareaprops}
                  class="block w-full text-sm text-zinc-900 border border-zinc-300 rounded-lg bg-zinc-50 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"/>
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

