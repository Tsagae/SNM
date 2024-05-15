<script>
    import {
        Card,
        CardBody,
        CardHeader,
        CardSubtitle,
        CardText
    } from 'sveltestrap';
    import {fly} from 'svelte/transition';

    export let id;
    export let name;
    export let tracks;
    export let user;
    export let i;
</script>

<div in:fly={{ delay: i * 250, y: 300, duration: 500 }}>
    <Card class="card_style">
        <CardHeader style="color:aliceblue; font-weight:800; font-size:40px">
            <a href="/playlist/{id}">{name}</a>
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

<style>
    :global(.card_style) {
        margin: 2rem;
        background-color: transparent;
        border-left: 5px solid #1db954;
    }
</style>