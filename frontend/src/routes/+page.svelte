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
    import { fly } from 'svelte/transition';

    let isOpen = false;
    const toggle = () => (isOpen = !isOpen);

    let ready = false;
	onMount(() => ready = true);

    let keyword = '';

    let songs = [
		{ id: '001', name: 'song1' },
		{ id: '002', name: 'song2' },
		{ id: '003', name: 'song3' },
		{ id: '004', name: 'song4' },
		{ id: '005', name: 'song5' }
	];
</script>

<div class="bg_img">

    <img
    class="demo-bg"
    src="/logo.png"
    alt="">

<Container fluid>
    <div class="center">

        <p>Searching playlist by {keyword || '...'}</p>

        <input bind:value={keyword} placeholder="enter keyword" />

    </div> 
</Container>

<Container fluid>
        {#each songs as { id, name }, i}
        {#if ready}
        <div transition:fly={{ delay: i*250, y: 200, duration: 1500 }}>
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

</div>

<style>
    .center {
        margin: 20px auto 20px auto;
        width: 50%;
        border: 3px solid green;
        padding: 10px;
        text-align: center;
    }
    :global(.card_style){
        margin: 2rem;
    }
    :global(.bg_img){
        overflow: hidden;
        position: relative;
    }
    :global(.demo-bg) {
        opacity: 0.2;
        position: fixed;
        left: 20rem;
        top: 15rem;
        width: 50%;
    }
</style>