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
	import { passwordMatch, containNumbers } from './customValidators';
	import Cookies from 'js-cookie';

	const form = useForm();

	const requiredMessage = 'This field is required';

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
		let result = JSON.stringify(json);
		//console.log(result);

		hasRes = true;
		resOk = res.ok;

		if (resOk) {
			Cookies.set('authToken', json.accessToken);
		}
	}

	async function testToken() {
		const res = await fetch('http://localhost:3000/authToken', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + Cookies.get('authToken')
			}
		});

		const json = await res.json();
		console.log(json);
	}
</script>

<main>
	<form use:form method="post">
		<h1>Login</h1>

		<input type="text" name="username" />
		<label for="Username">Username</label>

		<input
			type="password"
			name="password"
			use:validators={[required, minLength(5), containNumbers(2)]}
		/>		
		<label for="password">Password</label>
		<HintGroup for="password">
			<Hint on="required">{requiredMessage}</Hint>
			<Hint on="minLength" hideWhenRequired let:value
				>This field must have at least {value} characters.</Hint
			>
			<Hint on="containNumbers" hideWhen="minLength" let:value>
				This field must contain at least {value} numbers.
			</Hint>
		</HintGroup> <br><br>

		<button disabled={!$form.valid} on:click|preventDefault={onSubmit}> Login </button>
	</form>

	{#if hasRes}
		<p>{resOk ? 'Login successful' : 'Login failed'}</p>
	{/if}

	<button on:click={testToken}>TestAuth</button>

	<pre>
		{JSON.stringify($form, null, 1)}
	</pre>
</main>

<style>
	:global(.touched:invalid) {
		border-color: red;
		outline-color: red;
	}

	h1{
		font-size: 50px;
		font-weight: 600;
		font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
		color: #1db954;
		text-shadow: 0px 0px 5px #363636, 0px 0px 10px #363636, 0px 0px 10px #363636, 0px 0px 20px #363636;
	}

	input {
		border:none;
		border-bottom: 1px ridge #1db954;
		background-color: transparent;
		padding:8px;
		display:block;
	}

	main {
		display: flex;
		justify-content: space-around;
	}

	pre {
		height: 80vh;
		overflow: auto;
		font-size: 12px;
	}
</style>
