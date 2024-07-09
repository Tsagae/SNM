<script>
    import {
        Avatar,
        Button,
        Card,
        Heading,
        Spinner
    } from 'flowbite-svelte';
    import {PlusOutline, ArrowRightOutline} from "flowbite-svelte-icons";
    import {
        getMyCommunities,
        getUser
    } from '$lib/backend.js';
    import {goto} from '$app/navigation';

    let gruppi = getMyCommunities();
    
</script>

<Heading tag="h1" class="w-full mt-6 mb-4 text-center">I tuoi gruppi</Heading>

<Button class="w-64 mx-auto" on:click={() => goto(`/community/new`)}>
    <PlusOutline class="w-6 h-6 mr-2 text-white dark:text-white"/>
    Nuova community
</Button>

{#await gruppi}
    <div class="text-center">
        <Spinner size={8} color="green"/>
    </div>
{:then results}
    {#each results as comm}

        {#await getUser(comm.owner)}
            <div class="text-center">
                <Spinner size={8} color="green"/>
            </div>
        {:then creator}
            <Card size="lg" class="my-6 mx-auto bg-gray-100 dark:bg-zinc-700" >
                <div class="flex">
                    <h5 class="mb-2 mr-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{comm.communityName}</h5>
                    <Avatar src="{creator.avatar}" rounded border /> 
                    <div class="ml-4 font-medium dark:text-white">
                        <div class="text-sm text-gray-500 dark:text-gray-400">Creatore</div>
                        <div><a href="/profilo/{creator._id}">{creator.username}</a></div>
                    </div>
                </div>

                <div class="flex mb-5">
                    {#each comm.users as usr}
                        {#await getUser(usr)}
                            Ricerca...
                        {:then membro}
                                <Avatar src="{membro.avatar}" stacked />
                        {/await}
                    {/each}
                    <Avatar stacked />
                </div>
                <Button class="w-fit" on:click={() => goto(`/community/` + comm._id)}>
                Vai alla Community<ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
                </Button>
            </Card>
        {/await}
    {/each}
{/await}