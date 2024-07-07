<script>
    import {
        Avatar,
        Badge,
        Button,
        Card,
        Carousel,
        Dropdown,
        DropdownItem,
        Heading,
        Spinner
    } from 'flowbite-svelte';
    import {DotsHorizontalOutline} from 'flowbite-svelte-icons';
    import Playlist from '$lib/components/playlist.svelte';
    import {myPlaylists, getUser, getArtists, getMySavedPlaylists} from '$lib/backend.js'; //temporary

    let pageInfo = window.location.pathname;
    let idUser = pageInfo.replace("/profilo/", "");
    idUser = idUser.replace("/", "");

    let imgAvatar = '';
    let index = 0;
    let image;

    let isMyProfile = false;
    if (localStorage.getItem('authToken') !== null) {
        isMyProfile = idUser === localStorage.getItem('userId')
    }

    let userInfoPromise = getUser(idUser);
    let userPlaylists = getUserPlaylists();

    async function getUserPlaylists() {
        const res = await myPlaylists();
        let previews = [];

        for (var i = 0; i < res.length; i++) {
            previews.push(
                {
                    alt: res[i].name,
                    src: res[i].thumbnail,
                    title: res[i]._id
                }
            );
        }

        return previews;
    }

</script>

{#await userInfoPromise}
    <div class="text-center mt-16">
        <Spinner size={8} color="green"/>
    </div>
{:then userInfo}
    {#if userInfo.avatar}
        <Card img={userInfo.avatar} class="w-4/5 max-w-full m-auto mt-2 mb-6 bg-gray-100 dark:bg-zinc-700" horizontal>
            <div class="flex">
                <DotsHorizontalOutline class="dots-menu place-self-end dark:text-white"/>
                <Dropdown triggeredBy=".dots-menu">
                    <DropdownItem href="/profilo/edit">Modifica</DropdownItem>
                </Dropdown>
                <Heading tag="h1" class="mb-4"
                         customSize="text-2xl font-extrabold md:text-5xl lg:text-6xl">{userInfo.username}</Heading>
            </div>
            <p class="text-2xl dark:text-white">Preferenze</p>
            <div class="mt-2">
                {#if userInfo.genres}
                    {#each userInfo.genres as genre}
                        <Badge rounded color="green" class="mx-1">#{genre}</Badge>
                    {/each}
                {/if}
            </div>
            {#if userInfo.artists}
                {#await getArtists(userInfo.artists)}
                    <div class="text-center mt-16">
                        <Spinner size={8} color="green"/>
                    </div>
                {:then artistsRes}
                    {#if artistsRes.error !== undefined}
                        <p>{artistsRes.error}</p>
                    {:else}
                        <ul class="flex flex-wrap mt-4 text-gray-900 dark:text-white">
                            {#each artistsRes.artists as artist}
                                <li class="mx-2">
                                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                        <Avatar src="{artist.images[0].url}" rounded/>
                                        <div class="space-y-1 font-medium dark:text-white">
                                            <div>{artist.name}</div>
                                        </div>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                {/await}
            {/if}
        </Card>
    {:else}
        <Card class="w-4/5 max-w-full m-auto mt-2 mb-6 bg-gray-100 dark:bg-zinc-700">
            <div class="flex">
                <Heading tag="h1" class="mb-4 flex"
                         customSize="text-2xl font-extrabold md:text-5xl lg:text-6xl">{userInfo.username}</Heading>
                <DotsHorizontalOutline class="dots-menu dark:text-white"/>
                <Dropdown triggeredBy=".dots-menu" class="bg-gray-200 dark:bg-zinc-600">
                    <DropdownItem href="/profilo/edit">Modifica</DropdownItem>
                </Dropdown>
            </div>
            <p class="text-2xl dark:text-white">Preferenze</p>
            <div class="mt-2">
                {#if userInfo.genres}
                    {#each userInfo.genres as genre}
                        <Badge rounded color="green" class="mx-1">#{genre}</Badge>
                    {/each}
                {/if}
            </div>
            {#if userInfo.artists}
                {#await getArtists(userInfo.artists)}
                    <div class="text-center mt-16">
                        <Spinner size={8} color="green"/>
                    </div>
                {:then artistsRes}
                    {#if artistsRes.error !== undefined}
                        <p>{artistsRes.error}</p>
                    {:else}
                        <ul class="flex flex-wrap mt-4 text-gray-900 dark:text-white">
                            {#each artistsRes.artists as artist}
                                <li class="mx-2">
                                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                        <Avatar src="{artist.images[0].url}" rounded/>
                                        <div class="space-y-1 font-medium dark:text-white">
                                            <div>{artist.name}</div>
                                        </div>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                {/await}
            {/if}
        </Card>
    {/if}
{/await}
{#if isMyProfile}
    <h1>Playlist salvate</h1>
    {#await getMySavedPlaylists()}
        <div class="text-center mt-16">
            <Spinner size={8} color="green"/>
        </div>
    {:then savedPlaylists}
        {#each savedPlaylists as playlist}
            <li>{JSON.stringify(playlist)}</li>
        {/each}
    {/await}

    <h1>Le mie playlist</h1>
    {#await myPlaylists()}
        <div class="text-center mt-16">
            <Spinner size={8} color="green"/>
        </div>
    {:then savedPlaylists}
        {#each savedPlaylists as playlist}
            <li>{JSON.stringify(playlist)}</li>
        {/each}
    {/await}
{:else}
    {#await userPlaylists}
        <div class="text-center mt-16">
            <Spinner size={8} color="green"/>
        </div>
    {:then images}

        <div class="w-4/5 space-y-4 place-self-center">

            <h2 class="mb-6 text-3xl font-medium text-gray-900 dark:text-white text-center">Playlist pubbliche</h2>
            <Carousel {images} let:Indicators let:Controls on:change={({ detail }) => (image = detail)}>
                <Controls/>
                <Indicators/>
            </Carousel>

            <div class="rounded h-10 bg-gray-300 dark:bg-zinc-700 dark:text-white p-2 my-2 text-center">
                <a href="/playlist/{image?.title}">{image?.alt}</a>
            </div>
        </div>

    {/await}
{/if}




