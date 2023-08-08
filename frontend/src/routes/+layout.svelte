<script>
	import { Navbar, Nav, NavItem, NavLink, NavbarBrand } from 'sveltestrap';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
  
	let ready = false;
	onMount(() => ready = true);
</script>

<Navbar color="success" light>
	{#if ready}
	<h1 transition:fly={{ x: 200, duration: 1500 }} >
	SNM
	</h1>
	{/if}
</Navbar>

<Navbar color="light" light expand="md">
	<NavbarBrand href="/">Home</NavbarBrand>
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
  </Navbar>

<div class="page-content">

<slot />

</div>

<style>
	
	:global(body) {
		background-color: #535353;
		color: #1db954;
	}

    .page-content {
        padding: 20px;
    }
</style>