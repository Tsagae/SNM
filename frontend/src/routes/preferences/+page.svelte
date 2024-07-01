<script>
	import {
		useForm,
		Hint,
		HintGroup,
		validators,
		required,
		minLength,
		email
	} from 'svelte-use-form';
	import { 
		Section, 
		Register,
		MultiSelect
	} from "flowbite-svelte-blocks";
	import { 
		Checkbox, 
		Label, 
		Alert
	} from "flowbite-svelte";
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	const form = useForm();

	let hasRes = false;
	let resOk;
	let datiUtente;

	async function getUserPreferences(utente) {
		const res = await fetch('http://localhost:3000/getUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body : JSON.stringify({id : utente})
		});

		datiUtente = await res.json();
	}

	// async function onSubmit() {
	// 	console.log('form: ', $form);
	// 	const data = {
	// 		email: $form.email.value,
	// 		username: $form.username.value,
	// 		password: $form.password.value
	// 	};
	// 	// console.log('data: ', JSON.stringify(data));
	// 	await savePreferences(data);
	// }

	// async function savePreferences(user) {
	// 	const res = await fetch('http://localhost:3000/register', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(user)
	// 	});

	// 	const json = await res.json();
	// 	// let result = JSON.stringify(json);
	// 	// console.log(result);

	// 	hasRes = true;
	// 	resOk = res.ok;

	// 	if (resOk) {
    //         window.location.replace("/");
    //     }
	// }
</script>

<Section name="preferences">
	<Register>
		<svelte:fragment slot="top">
		<img class="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
		Social Network for Music
		</svelte:fragment>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8 bg-gray-100 dark:bg-zinc-900">

		<form class="flex flex-col space-y-6" use:form method="post">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Imposta i tuoi gusti!</h3>
			<Label class="space-y-2">
			<span>Artisti</span>
			{#await getUserPreferences()}
				<p>...waiting</p>
			{:then track}
			
			{:catch error}
			<p style="color: red">{error.message}</p>
			{/await}
			<!-- <MultiSelect items={artists} bind:value={selected} /> -->
			<!-- <input class="block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg" placeholder="nome@esempio.com" type="email" name="email" use:validators={[required, email]} required /> -->
			</Label>

			<Label class="space-y-2">
			<span>Generi musicali</span>
			<input class="block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg" placeholder="nome" type="text" name="username" use:validators={[required]} required />
			</Label>

			<button class="text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg w-full1" type="submit" disabled={!$form.valid} on:click|preventDefault={onSubmit}>Salva prefereze</button>
		</form>

		</div>
	</Register>
</Section>

{#if hasRes}
	{#if !resOk}
		<Alert color="red" class="bg-white dark:bg-zinc-800">
			<InfoCircleSolid slot="icon" class="w-5 h-5" />
			Salvataggio non riuscito
		</Alert>
	{/if}
{/if}