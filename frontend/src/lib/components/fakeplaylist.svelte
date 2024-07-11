<script>
    import {
        Card,
        Span
    } from 'flowbite-svelte';
    import {fly} from 'svelte/transition';

    export let message;
    export let i;
</script>

<div in:fly|global={{ delay: i * 250, y: 300, duration: 500 }}>
    <div class="space-y-4">
        <Card horizontal size="lg" class="mx-auto bg-gray-100 dark:bg-zinc-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><Span
                    class="uppercase">{message}</Span></h5>
        </Card>
    </div>
</div>