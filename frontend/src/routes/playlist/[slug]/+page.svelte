<script>
    import {getPlaylistInfo} from '$lib/backend.js';

    let pageInfo = window.location.pathname;
    let id = pageInfo.replace("/playlist/", "");

    console.log(id);

    const playlistInfo = getPlaylistInfo(id);

    console.log(playlistInfo);

</script>

    {#await playlistInfo}
        <p> waiting </p>
    {:then playlist}
        {playlist}
    {/await}
