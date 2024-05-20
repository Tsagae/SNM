<script>
    import {
        Container,
        Form
    } from 'sveltestrap';
    import {getPlaylistInfo} from '../../../backend.js';

    let pageInfo = window.location.pathname;
    let id = pageInfo.replace("/playlist/", "");

    console.log(id);

    const playlistInfo = getPlaylistInfo(id);

    console.log(playlistInfo);

</script>

<Container fluid>
    {#await playlistInfo}
        <p> waiting </p>
    {:then playlist}
        {playlist}
    {/await}
</Container>