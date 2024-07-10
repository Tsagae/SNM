<script>
    import {
        Avatar, 
        Button,
        Dropdown,
        DropdownItem,
        Heading,
        Span,
        Spinner
    } from 'flowbite-svelte';
    import {
        getCommunity,
        getUser,
        getPlaylistInfo
    } from '$lib/backend.js';
    import { DotsHorizontalOutline} from 'flowbite-svelte-icons';
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
    <div class="flex">
        <Heading tag="h1" class="w-full mt-6 mb-4 text-center"><Span gradient>{results.communityName}</Span></Heading>
        {#if results.owner === localStorage.getItem("userId")}
            <DotsHorizontalOutline class="dots-menu dark:text-white mt-4 mr-4"/>
            <Dropdown triggeredBy=".dots-menu" class="bg-gray-200 dark:bg-zinc-600">
                <DropdownItem href="/community/edit?from={id}">Modifica</DropdownItem>
            </Dropdown>
        {/if}
    </div>

    <div class="text-gray-500 dark:text-gray-400 flex w-full h-full flex-col md:flex-row mx-auto mt-6">

        <div class="w-full md:w-2/3 p-4">

            <Heading tag="h3" class="text-center mb-4">Playlist condivise</Heading>
            
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
                        {#await getUser(sharedPlaylist.user)}
                            <div class="text-center">
                                <Spinner size={8} color="green"/>
                            </div>
                        {:then sharingUser}
                            <p>Condivisa da: <strong> {sharingUser.username} </strong></p><br>
                        {/await}
                        <Playlist id={playlistInfo._id} name={playlistInfo.name} user={playlistCreator.username}
                                      tracks={playlistInfo.tracks} tags={playlistInfo.tags}
                                      thumbnail={playlistInfo.thumbnail} i={0} />
                        <br>
                    {/await}
                {/await}
            {/each}

        </div>

        <div class="w-full md:w-1/3" style="border-left: 1px solid grey;">

            <Heading tag="h3" class="text-center mb-4">Membri</Heading>

            <p class="ml-4 mb-2">Creatore</p>

            {#await getUser(results.owner)}
                <div class="text-center">
                    <Spinner size={8} color="green"/>
                </div>
            {:then owner}
                <div class="flex items-center space-x-4 rtl:space-x-reverse mb-4 ml-4">
                    <Avatar src="{owner.avatar}" rounded />
                    <div class="space-y-1 font-medium dark:text-white">
                    <div><a href="/profilo/{owner._id}">{owner.username}</a></div>
                    </div>
                </div>
            {/await}

            <p class="ml-4 mb-2">Partecipanti</p>

            {#each results.users as member}
                {#await getUser(member)}
                    <div class="text-center">
                        <Spinner size={8} color="green"/>
                    </div>
                {:then user}
                    <div class="flex items-center space-x-4 rtl:space-x-reverse mb-4 ml-4">
                        <Avatar src="{user.avatar}" rounded />
                        <div class="space-y-1 font-medium dark:text-white">
                        <div><a href="/profilo/{user._id}">{user.username}</a></div>
                        </div>
                    </div>
                {/await}
            {/each}

        </div>

    </div>

{/await}