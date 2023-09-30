<script>
    import { 
        Button, 
        Container,
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardSubtitle,
        CardText,
        CardTitle } from 'sveltestrap';
    import { onMount } from 'svelte';
    import { fly, slide } from 'svelte/transition';

    let ready = false;
	onMount(() => ready = true);

    let keyword = '';
    let visible = false;

    function toggleVisible() {
        visible = !visible
    }

    // array di canzoni di prova, da sostituire con i risultati da spotify
    let songs = [
		{ id: '001', name: 'song1' },
		{ id: '002', name: 'song2' },
		{ id: '003', name: 'song3' },
		{ id: '004', name: 'song4' },
		{ id: '005', name: 'song5' }
	];
</script>

<!-- <img class="demo-bg" src="/logo.png" alt="logoBG"> -->

<Container fluid>
    <div class="center">

        <img class="resize" src="/SNMlogo.png" alt="SNM">
        <p>Searching playlist by {keyword || '...'}</p>

        <input bind:value={keyword} placeholder="enter keyword" />
        <br><br>
        Filters
        {#if visible}
            <img class="buttImgRev" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Green_Arrow_Down.svg/2048px-Green_Arrow_Down.svg.png" on:click={toggleVisible} alt="showFilters">
        {:else}
            <img class="buttImg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Green_Arrow_Down.svg/2048px-Green_Arrow_Down.svg.png" on:click={toggleVisible} alt="showFilters">
        {/if}
        
        <br><br>
        {#if visible}
            <div style="width: 100%; text-align:center;" in:fly={{ y: -50, duration: 1000 }} out:fly={{ y: -50, duration: 1000 }}>
                <input type="checkbox" id="album" name="album" checked /><label for="album">Album</label>
                <input type="checkbox" id="artist" name="artist" checked /><label for="artist">Artist</label>
                <input type="checkbox" id="playlist" name="playlist" checked /><label for="playlist">Playlist</label>
                <input type="checkbox" id="track" name="track" checked /><label for="track">Track</label>
            </div>
        {/if}

    </div> 
</Container>

<Container fluid>
        {#each songs as { id, name }, i}
        {#if ready}
        <div in:fly={{ delay: i*250, y: 200, duration: 1500 }}>
            <Card class="card_style">
                <CardHeader>
                <CardTitle>{name}</CardTitle>
                </CardHeader>
                <CardBody>
                <CardSubtitle>Card {id}</CardSubtitle>
                <CardText>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                </CardText>
                <Button>Button</Button>
                </CardBody>
                <CardFooter>Footer</CardFooter>
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
    :global(.card_style){
        margin: 2rem;
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
    .buttImgRev{
        width:20px; 
        transform:rotate(180deg);
    }
    .buttImgRev:hover{
        filter: drop-shadow(3px 3px 2px #ffffff);
    }
    .buttImg{
        width:20px; 
    }
    .buttImg:hover{
        filter: drop-shadow(3px 3px 2px #ffffff);
    }
</style>