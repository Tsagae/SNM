<script lang="ts">
	import {
	  Collapse,
	  Navbar,
	  NavbarToggler,
	  NavbarBrand,
	  Nav,
	  NavItem,
	  NavLink
	} from 'sveltestrap';  
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let src = '/logo.png';
  
	let ready = false;
	onMount(() => ready = true);
	  
	let isOpen = false;

</script>
  
<Navbar class="NavStyle" expand="md">
	{#if ready}
	<NavbarBrand href="/"><img src={src} in:fly={{ x: 200, duration: 1500 }} alt="logo" height="50px"></NavbarBrand>
	{/if}
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md">
		<Nav class="ms-auto" navbar>
			<NavItem>
				<NavLink href="/registration">Registration</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/hello-world">Hello World!</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/login">Login</NavLink>
			</NavItem>
			<NavItem>
				<NavLink>Logout</NavLink>
			</NavItem>
		</Nav>
    </Collapse>
</Navbar>

<div class="page-content">

<slot />

</div>

<style>	
    .page-content {
        padding: 20px;
    }
	:global(.NavStyle){
		background-color: #373737;
		border-bottom: 1px solid #1db954;
	}
</style>