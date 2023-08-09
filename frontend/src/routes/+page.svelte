<script>
    import { 
        Button, 
        Modal, 
        Container,
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardSubtitle,
        CardText,
        CardTitle } from 'sveltestrap';

    let isOpen = false;
    const toggle = () => (isOpen = !isOpen);

    let keyword = '';

    let songs = [
		{ id: '001', name: 'song1' },
		{ id: '002', name: 'song2' },
		{ id: '003', name: 'song3' }
	];
</script>

<Container fluid>
    <div class="center">

        <p>Searching playlist by {keyword || '...'}</p>

        <input bind:value={keyword} placeholder="enter keyword" />

    </div> 
</Container>

<Container fluid>
    <div class="display">

        {#each songs as { id, name }, i}
        <div class="fixed-width">
            <Card class="mb-3">
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
        {/each}

    </div>
</Container>

<style>
    .center {
        margin: 20px auto 20px auto;
        width: 50%;
        border: 3px solid green;
        padding: 10px;
        text-align: center;
    }
    .fixed-width{
        width: 200px;
        display: block;
    }
    .display {
        display: block;
    }
</style>