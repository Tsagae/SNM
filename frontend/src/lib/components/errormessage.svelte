<script>
    import {
        Alert, Button,
    } from 'flowbite-svelte';
    import {InfoCircleSolid} from "flowbite-svelte-icons";

    export let message;

</script>

<Alert color="red" class="bg-gray-100 dark:bg-zinc-700">
    <div class="flex items-center gap-3">
        <InfoCircleSolid class="w-5 h-5"/>
        <span class="text-lg font-medium">ATTENZIONE</span>
    </div>
    <p class="mt-2 mb-4 text-sm">{message}</p>
    <div class="flex gap-2 items-center">
        <Button href="/" color="red" size="xs" outline>Torna alla Home</Button>
    </div>
</Alert>