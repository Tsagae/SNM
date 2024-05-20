<script lang="ts">
	import '../app.css';
	import { 
		DarkMode, 
		Navbar, 
		NavBrand, 
		NavLi, 
		NavUl, 
		NavHamburger,
		Footer, 
		FooterBrand, 
		FooterCopyright, 
		FooterLink, 
		FooterLinkGroup
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import {fly} from 'svelte/transition';

	let src = '/logo.png';  
	let ready = false;

	onMount(() => ready = true);
	  
</script>

<Navbar>
	{#if ready}
	<NavBrand href="/">
		<img src={src} in:fly={{ x: 200, duration: 1500 }} class="me-3 h-6 sm:h-9" alt="SNM Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Social Network for Music</span>
	</NavBrand>
	{/if}

	<NavHamburger />
	<NavUl >
	  <NavLi href="/registration">Registration</NavLi>
	  <NavLi href="/hello-world">Hello World!</NavLi>
	  <NavLi href="/login">Login</NavLi>
	  <NavLi href="/logout">Logout</NavLi>	 
	</NavUl>
</Navbar>

<div class="p-8">

	<DarkMode />

	<slot />
	
</div>

<!-- <Footer>
	<FooterCopyright href="/" by="Flowbite™" year={2022} />
	<FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
		<FooterLink href="/">About</FooterLink>
		<FooterLink href="/">Privacy Policy</FooterLink>
		<FooterLink href="/">Licensing</FooterLink>
		<FooterLink href="/">Contact</FooterLink>
	</FooterLinkGroup>
</Footer> -->

<Footer footerType="logo"  class="bg-white dark:bg-zinc-800">
	<div class="sm:flex sm:items-center sm:justify-between">
	  <FooterBrand href="/" src={src} alt="SNM Logo" name="SNM" />
	  <FooterLinkGroup ulClass="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
		<FooterLink href="/">About</FooterLink>
		<FooterLink href="/">Privacy Policy</FooterLink>
		<FooterLink href="/">Licensing</FooterLink>
		<FooterLink href="/">Contact</FooterLink>
	  </FooterLinkGroup>
	</div>
	<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
	<FooterCopyright href="/" by="Z&P" />
  </Footer>