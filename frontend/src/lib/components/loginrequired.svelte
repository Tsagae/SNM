<script>
    import ErrorMessage from '$lib/components/errormessage.svelte'
    import {checkLogin} from '$lib/auth.js'
    import {Spinner} from "flowbite-svelte";
</script>

{#await checkLogin()}
    <div class="text-center">
        <Spinner size={8} color="green"/>
    </div>
{:then isLoggedIn}
    {#if isLoggedIn}
        <slot></slot>
    {:else}
        <ErrorMessage message={"Effettua il login per visualizzare questa pagina"}></ErrorMessage>
    {/if}
{/await}
