<script>
    import { 
        Card,
        Span
    } from 'flowbite-svelte';
    import {fly} from 'svelte/transition';

    export let id;
    export let name;
    export let tracks;
    export let user;
    export let tags;
    export let i;
</script>

<div in:fly={{ delay: i * 250, y: 300, duration: 500 }}>
    <div class="space-y-4">
        <Card img="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/rap-cd-album-mixtape-cover-design-template-8e67148b45c3625087dc1cb15f1de8a8_screen.jpg" horizontal size="lg" href="/playlist/{id}" class="mx-auto bg-gray-100 dark:bg-zinc-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><Span class="uppercase">{name}</Span></h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"><b> {tracks.length} tracks</b> </p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">TAGS:
                {#each tags as tag}
                    #{tag}&nbsp;
                {/each}
            </p>
            <p class="mb-3 font-normal italic float-right text-gray-700 dark:text-gray-400 leading-tight">By: {user}</p>
        </Card>
    </div>
</div>