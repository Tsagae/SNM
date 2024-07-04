<script>
    import {
        Avatar,
        Badge,
        Card,
        Carousel,
        Spinner
    } from 'flowbite-svelte';
    import Playlist from '$lib/components/playlist.svelte';

    import {getPubPlaylist, getUser, getArtists} from '$lib/backend.js'; //temporary


    let imgAvatar = '';
    let index = 0;
    let image;

    let userInfoPromise = getUser("updatedUsername"); //TODO: hardcoded
    let userPlaylists = getUserPlaylists();

    async function getUserPlaylists() {
        const res = await getPubPlaylist();
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

    //get all user information wit async func...

    //get artist informations...

    //get user's playlist...the follow is temporary


</script>

<div class="space-y-4">

</div>
{#await userInfoPromise}
    <div class="text-center mt-16">
        <Spinner size={8} color="green"/>
    </div>
{:then userInfo}
    <Card img="https://ionicframework.com/docs/img/demos/avatar.svg"
          class="max-w-full m-auto mt-2 mb-2 bg-gray-100 dark:bg-zinc-700" horizontal>

        <h2 class="mb-1 text-3xl font-medium text-gray-900 dark:text-white">{userInfo.username}</h2>

        <p class="text-2xl dark:text-white">Preferenze</p>

        <div class="mt-4">
            {#each userInfo.genres as genre}
                <Badge rounded color="green" class="mx-2">#{genre}</Badge>
            {/each}
        </div>

        {#await getArtists(userInfo.artists)}
            <div class="text-center mt-16">
                <Spinner size={8} color="green"/>
            </div>
        {:then artistsRes}
            {#if artistsRes.error !== undefined}
                <p>{artistsRes.error}</p>
            {:else}
                <!--use artist image and other information-->
                <ul class="flex flex-wrap items-center justify-center mt-4 text-gray-900 dark:text-white">
                    {#each artistsRes.artists as artist}
                        <li class="mx-2">
                            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                <Avatar src="" href="" rounded/>
                                <div class="space-y-1 font-medium dark:text-white">
                                    <div>{artist.name}</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">Altre info artista?</div>
                                </div>
                            </div>
                        </li>
                    {/each}
                </ul>
            {/if}
        {/await}
    </Card>
{/await}

{#await userPlaylists}
    <div class="text-center mt-16">
        <Spinner size={8} color="green"/>
    </div>
{:then images}

    <div class="w-4/5 space-y-4 place-self-center">

        <h2 class="mb-1 text-3xl font-medium text-gray-900 dark:text-white text-center">Playlist pubbliche</h2>
        <Carousel {images} let:Indicators let:Controls on:change={({ detail }) => (image = detail)}>
            <Controls/>
            <Indicators/>
        </Carousel>

        <div class="rounded h-10 bg-gray-300 dark:bg-zinc-700 dark:text-white p-2 my-2 text-center">
            <a href="/playlist/{image?.title}">{image?.alt}</a>
        </div>
    </div>

{/await}



