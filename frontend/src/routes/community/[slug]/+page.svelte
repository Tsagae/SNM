<script>
    import {
        Avatar, Button,
        Heading,
        Spinner
    } from 'flowbite-svelte';
    import {
        getCommunity,
        getUser,
        getPlaylistInfo
    } from '$lib/backend.js';
    import Playlist from "$lib/components/playlist.svelte";

    let pageInfo = window.location.pathname;
    let id = pageInfo.replace("/community/", "");
    id = id.replace("/", "");

</script>

{#await getCommunity(id)}
    <div class="text-center">
        <Spinner size={8} color="green"/>
    </div>
{:then results}
    <Heading tag="h1" class="w-full mt-6 mb-4 text-center">{results.communityName}</Heading>

    <div class="flex">

        <div class="w-2/3" style="background-color:red;">

            Playlist condivise
            {#each results.sharedPlaylists as sharedPlaylist}
                {#await getPlaylistInfo(sharedPlaylist.playlist)}
                    <div class="text-center">
                        <Spinner size={8} color="green"/>
                    </div>
                {:then playlistInfo}
                    {#await getUser(playlistInfo.user)}
                        <div class="text-center">
                            <Spinner size={8} color="green"/>
                        </div>
                    {:then playlistCreator}
                        <div>
                            {#await getUser(sharedPlaylist.user)}
                                <div class="text-center">
                                    <Spinner size={8} color="green"/>
                                </div>
                            {:then sharingUser}
                                <b>Shared by: {sharingUser.username}</b>
                            {/await}
                            <Playlist id={playlistInfo._id} name={playlistInfo.name} user={playlistCreator.username}
                                      tracks={playlistInfo.tracks} tags={playlistInfo.tags}
                                      thumbnail={playlistInfo.thumbnail} i={0}/>
                        </div>
                    {/await}
                {/await}
            {/each}
        </div>

        <div class="w-1/3" style="background-color:green;">

            Elenco utenti

            {#each results.users as member}
                {#await getUser(member)}
                    <div class="text-center">
                        <Spinner size={8} color="green"/>
                    </div>
                {:then user}
                    <Avatar src="{user.avatar}" rounded/>
                    <div class="space-y-1 font-medium dark:text-white">
                        {user.username}
                    </div>
                {/await}
            {/each}

        </div>
    </div>

{/await}