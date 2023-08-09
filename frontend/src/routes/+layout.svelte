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

	let src = '/Spotify_icon.svg.png';
  
	let ready = false;
	onMount(() => ready = true);
	  
	let isOpen = false;
  
	function handleUpdate(event) {
	  isOpen = event.detail.isOpen;
	}
</script>
  
<Navbar color="success" light expand="md">
	{#if ready}
	<NavbarBrand href="/"><img src={src} transition:fly={{ x: 200, duration: 1500 }} alt="logo" height="50px"></NavbarBrand>
	{/if}
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
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
</style>