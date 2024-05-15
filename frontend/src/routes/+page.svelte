<script>
    import {
        Container,
        Form
    } from 'sveltestrap';
    import {fly} from 'svelte/transition';
    import {search, getPubPlaylist} from '../backend.js';
	import Playlist from '../components/playlist.svelte';

    let keyword = '';
    let visible = true;
    let pubPlaylist = [];

    pubPlaylist = getPubPlaylist();

    function toggleVisible() {
        visible = !visible;
    }

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

<Container fluid>
    <div class="center">

        <img class="resize" src="/SNMlogo.png" alt="SNM"/>
        <br><br>
        <Form on:submit={searchForm}>
            <input bind:value={keyword} placeholder="Search"/>
        </Form>

        Filters
        <button on:click={toggleVisible}>+</button>

        <br/>
        {#if visible}
            <div style="width: 100%; text-align:center;" in:fly={{ y: -50, duration: 1000 }} out:fly={{ y: -50, duration: 1000 }}>
                <input type="checkbox" name="filter" value="album" id="album" checked/><label for="album">Album</label>
                <input type="checkbox" name="filter" value="artist" id="artist" checked/><label for="artist">Artist</label>
                <input type="checkbox" name="filter" value="playlist" id="playlist" checked/><label for="playlist">Playlist</label>
                <input type="checkbox" name="filter" value="track" id="track" checked/><label for="track">Track</label>
            </div>
        {/if}
    </div>
</Container>

<Container fluid>
    {#await pubPlaylist}
        <p> waiting </p>
    {:then playlist}
        {#each playlist as {name, user, _id, tracks}, i}
            <Playlist id={_id} name={name} user={user} tracks={tracks} i={i}/>
        {/each}
    {/await}
</Container>

<style>
    .center {
        margin: 20px auto 20px auto;
        width: 50%;
        padding: 10px;
        text-align: center;
    }
    
    .resize {
        width: 100%;
        max-width: 500px;
        max-height: 300px;
    }

    input[type="checkbox"]{
        margin: 5px;
    }
</style>
