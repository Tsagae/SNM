<script>
    import {
        Container,
        Card,
        CardBody,
        CardHeader,
        CardSubtitle,
        CardText,
        Form
    } from 'sveltestrap';
    import {onMount} from 'svelte';
    import {fly} from 'svelte/transition';
    import {search} from '../backend.js';

    let ready = false;
    onMount(() => (ready = true));

    let keyword = '';
    let visible = true;

    function toggleVisible() {
        visible = !visible;
    }

    // array di canzoni di prova, da sostituire con i risultati da spotify
    let songs = [
        {name: "playlist1", pub: false, tracks: ["7ouMYWpwJ422jRcDASZB7P", "4VqPOruhp5EdPBeR92t6lQ"], user: "test1"},
        {name: "playlist2", pub: true, tracks: ["7ouMYWpwJ422jRcDASZB7P", "4VqPOruhp5EdPBeR92t6lQ"], user: "test2"},
        {name: "playlist3", pub: true, tracks: ["7ouMYWpwJ422jRcDASZB7P", "4VqPOruhp5EdPBeR92t6lQ"], user: "test3"}
    ];

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

<!-- <img class="demo-bg" src="/logo.png" alt="logoBG"> -->

<Container fluid>
    <div class="center">

        <img class="resize" src="/SNMlogo.png" alt="SNM"/>
        <br><br>
        <Form on:submit={searchForm}>
            <input bind:value={keyword} placeholder="Search"/>
        </Form>

        Filters
        {#if visible}
            <img
                    class="buttImgRev"
                    src="/Green_Arrow_Down.png"
                    on:click={toggleVisible}
                    alt="showFilters"
            />
        {:else}
            <img
                    class="buttImg"
                    src="/Green_Arrow_Down.png"
                    on:click={toggleVisible}
                    alt="showFilters"
            />
        {/if}

        <br/>
        {#if visible}
            <div
                    style="width: 100%; text-align:center;"
                    in:fly={{ y: -50, duration: 1000 }}
                    out:fly={{ y: -50, duration: 1000 }}
            >
                <input type="checkbox" name="filter" value="album" id="album" checked/><label for="album">Album</label>
                <input type="checkbox" name="filter" value="artist" id="artist" checked/><label for="artist">Artist</label>
                <input type="checkbox" name="filter" value="playlist" id="playlist" checked/><label for="playlist">Playlist</label>
                <input type="checkbox" name="filter" value="track" id="track" checked/><label for="track">Track</label>
            </div>
        {/if}
    </div>
</Container>

<Container fluid>
    {#each songs as {name, pub, tracks, user}, i}
        {#if ready && pub}
            <div in:fly={{ delay: i * 250, y: 300, duration: 500 }}>
                <Card class="card_style">
                    <CardHeader style="color:aliceblue; font-weight:800; font-size:40px">
                        {name}
                    </CardHeader>
                    <CardBody>
                        <img 
                            src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/rap-cd-album-mixtape-cover-design-template-8e67148b45c3625087dc1cb15f1de8a8_screen.jpg" 
                            width="200" 
                            style="float:left; margin-right: 20px;" 
                            alt="cover preview"
                        >
                        <CardSubtitle>Qui ci andranno i tag ed eventuali descrizioni della playlist</CardSubtitle>
                        <br>
                        <CardText>
                            <p><b>Tracks:</b> {tracks}</p>
                            <p style="text-align:right;"><i>By {user}</i></p>
                        </CardText>
                    </CardBody>
                </Card>
            </div>
        {/if}
    {/each}
</Container>

<style>
    .center {
        margin: 20px auto 20px auto;
        width: 50%;
        padding: 10px;
        text-align: center;
    }

    :global(.card_style) {
        margin: 2rem;
        background-color: transparent;
        border-left: 5px solid #1db954;
    }

    :global(.demo-bg) {
        opacity: 0.2;
        position: fixed;
        left: 5rem;
        top: 8rem;
        width: 30%;
        z-index: -1;
    }

    .resize {
        width: 100%;
        max-width: 500px;
        max-height: 300px;
    }

    .buttImgRev {
        width: 15px;
        transform: rotate(180deg);
    }

    .buttImgRev:hover {
        filter: drop-shadow(3px 3px 2px #758777);
    }

    .buttImg {
        width: 15px;
    }

    .buttImg:hover {
        filter: drop-shadow(3px 3px 2px #758777);
    }

    input[type="checkbox"]{
        margin: 5px;
    }
</style>
