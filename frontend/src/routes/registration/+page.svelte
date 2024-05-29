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
		Register 
	} from "flowbite-svelte-blocks";
	import { 
		Checkbox, 
		Label, 
		Alert
	} from "flowbite-svelte";
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { passwordMatch, containNumbers, hasUppercase } from './customValidators';

	const form = useForm();

	const requiredMessage = 'Questo campo è necessario';

	let hasRes = false;
	let resOk;

	async function onSubmit() {
		console.log('form: ', $form);
		const data = {
			email: $form.email.value,
			username: $form.username.value,
			password: $form.password.value
		};
		console.log('data: ', JSON.stringify(data));
		await registerUser(data);
	}

	async function registerUser(user) {
		const res = await fetch('http://localhost:3000/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		});

		const json = await res.json();
		// let result = JSON.stringify(json);
		// console.log(result);

		hasRes = true;
		resOk = res.ok;
	}
</script>

<Section name="register">
	<Register>
		<svelte:fragment slot="top">
		<img class="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
		Social Network for Music
		</svelte:fragment>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8 bg-gray-100 dark:bg-zinc-900">

		<form class="flex flex-col space-y-6" use:form method="post">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Crea un account</h3>
			<Label class="space-y-2">
			<span>Email</span>
			<input class="block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg" placeholder="nome@esempio.com" type="email" name="email" use:validators={[required, email]} required />
			</Label>
			<HintGroup for="email">
			<Hint on="required">
				<Alert color="red" class="bg-white dark:bg-zinc-800">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					{requiredMessage}
				</Alert>
			</Hint>
			<Hint on="email" hideWhenRequired>
				<Alert color="red" class="bg-white dark:bg-zinc-800">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					Il formato della mail non è valido.
				</Alert>
			</Hint>
			</HintGroup>
			<Label class="space-y-2">
			<span>Nome</span>
			<input class="block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg" placeholder="nome" type="text" name="username" use:validators={[required]} required />
			</Label>
			<HintGroup for="username">
			<Hint on="required">
				<Alert color="red" class="bg-white dark:bg-zinc-800">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					{requiredMessage}
				</Alert>
			</Hint>
			</HintGroup>
			<Label class="space-y-2">
			<span>Password</span>
			<input class="block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg" placeholder="•••••" type="password" name="password" use:validators={[required, minLength(5), containNumbers(2), hasUppercase()]} required />
			</Label>
			<HintGroup for="password">
			<Hint on="required">
				<Alert color="red" class="bg-white dark:bg-zinc-800">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					{requiredMessage}
				</Alert>
			</Hint>
			<Hint on="minLength" hideWhenRequired let:value>
				<Alert color="red" class="bg-white dark:bg-zinc-800">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					Questo campo deve avere almeno {value} caratteri.
				</Alert>
			</Hint>
			<Hint on="containNumbers" hideWhen="minLength" let:value>
				<Alert color="red" class="bg-white dark:bg-zinc-800">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					Questo campo deve contenere almeno {value} numeri.
				</Alert>
			</Hint>
			<Hint on="hasUppercase">
				<Alert color="red" class="bg-white dark:bg-zinc-800">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					Questo campo deve contenere una lettera maiuscola.
				</Alert>
			</Hint>
			</HintGroup>
			<Label class="space-y-2">
			<span>Conferma password</span>
			<input class="block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg" placeholder="•••••" type="password" name="passwordConfirmation" use:validators={[required, passwordMatch]} required />
			</Label>
			<HintGroup for="passwordConfirmation">
			<Hint on="required">
				<Alert color="red" class="bg-white dark:bg-zinc-800">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					{requiredMessage}
				</Alert>
			</Hint>
			<Hint on="passwordMatch" hideWhenRequired>
				<Alert color="red" class="bg-white dark:bg-zinc-800">
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					Le password non corrispondono.
				</Alert>
			</Hint>
			</HintGroup>
			<div class="flex items-start">
			<Checkbox>Accetto i <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/"> &nbsp;Termini e Condizioni</a></Checkbox>
			</div>
			<button class="text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg w-full1" type="submit" disabled={!$form.valid} on:click|preventDefault={onSubmit}>Crea l'account</button>
			<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Hai già un account? <a href="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Accedi ora!</a>
			</div>
		</form>

		</div>
	</Register>
</Section>

{#if hasRes}
	{#if resOk}
		<Alert color="green" class="bg-white dark:bg-zinc-800">
			<InfoCircleSolid slot="icon" class="w-5 h-5" />
			Registration successful
		</Alert>         
	{:else}
		<Alert color="red" class="bg-white dark:bg-zinc-800">
			<InfoCircleSolid slot="icon" class="w-5 h-5" />
			Registration failed
		</Alert>
	{/if}
{/if}