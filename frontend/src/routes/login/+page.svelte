<script>
    import {
        useForm
    } from 'svelte-use-form';
    import { 
        Section, 
        Register 
    } from "flowbite-svelte-blocks";
    import { 
        Label, 
        Input,
        Alert
    } from "flowbite-svelte";
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    import Cookies from 'js-cookie';

    const form = useForm();

    let hasRes = false;
    let resOk;

    async function onSubmit() {
        console.log('form: ', $form);
        const data = {
            username: $form.username.value,
            password: $form.password.value
        };
        console.log('data: ', JSON.stringify(data));
        await login(data);
    }

    async function login(user) {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const json = await res.json();
        // let result = JSON.stringify(json);

        hasRes = true;
        resOk = res.ok;

        if (resOk) {
            Cookies.set('authToken', json.accessToken);
        }
    }
</script>

<main>

    <Section name="login">
        <Register>
        <svelte:fragment slot="top">
            <img class="w-8 h-8 mr-2" src="./logo.png" alt="logo" />
            Social Network for Music
        </svelte:fragment>
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8 bg-gray-100 dark:bg-zinc-900">

            <form class="flex flex-col space-y-6" use:form method="post">
            <Label class="space-y-2">
                <span>Nome Account</span>
                <Input type="text" name="username" placeholder="nome" required />
            </Label>
            <Label for="password" class="space-y-2">
                <span>Password</span>
                <Input type="password" name="password" placeholder="•••••" required />
            </Label>
            <div class="flex items-start">
                <a href="/" class="mr-auto text-sm text-primary-600 hover:underline dark:text-primary-500">Password dimenticata?</a>
            </div>
            <button class="text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg w-full1" type="submit" disabled={!$form.valid} on:click|preventDefault={onSubmit}>Accedi</button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Non hai ancora un account? <a href="/registration" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Registrati</a>
            </p>
            </form>

        </div>
        </Register>
    </Section>

    {#if hasRes}
        {#if resOk}            
            <h1>Login successful</h1>
        {:else}
            <Alert color="red" class="bg-white dark:bg-zinc-800">
                <InfoCircleSolid slot="icon" class="w-5 h-5" />
                ATTENZIONE: nome o password sono scorretti.
            </Alert>
        {/if}
    {/if}

</main>