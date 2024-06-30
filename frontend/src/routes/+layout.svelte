<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import {
		DarkMode,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		Footer,
		FooterBrand,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup,
		Button,
		Img
	} from 'flowbite-svelte';
	import { twMerge } from 'tailwind-merge';
	import {ArrowLeftToBracketOutline, UserSolid, ArrowRightToBracketOutline, EditOutline } from 'flowbite-svelte-icons';
	import {isValidToken} from '$lib/backend.js';

	let src = '/logo.png';
 	let aClass = 'flex items-center mb-5';
  	let spanClass = 'self-center text-xl font-semibold whitespace-nowrap dark:text-white';
	$: activeUrl = $page.url.pathname;
	let logged = false;

	const logout = () => {
		localStorage.removeItem('authToken');
		// window.location.replace("/");
	};

	async function checkToken() {
		let res = await isValidToken();
		return await res;
	};

	checkToken().then((res) => {
		console.log("RES: ", res)
		if (res != false) {
			if (!res.error){
				logged = true;
			} else{
				//localStorage.removeItem('authToken');
				logout();
			}
		}
	});
		
</script>

<div class="h-full flex flex-row flex-wrap">

	<aside class="w-full sm:w-1/3 md:w-1/6 bg-gray-100 dark:bg-zinc-900">
		<div class="sticky top-2 w-full p-0">
			<ul class="flex flex-col overflow-hidden">
				<Sidebar {activeUrl} class="w-full">
					<SidebarWrapper class="bg-gray-100 dark:bg-zinc-900 p-0">
					<SidebarGroup>

						<a {...$$restProps} href="/" class={twMerge(aClass, $$props.class)}>
							<Img src="/logo.png" class="w-1/2 p-5" alt="SNM"/>
							<span class={spanClass}>SNM</span>
						</a>

						{#if logged}
							<p class="text-gray-500 dark:text-gray-400">LOGGED MENU</p>
							<SidebarItem label="hello-world" href="/hello-world">
								<svelte:fragment slot="icon">
									<UserSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
								</svelte:fragment>
							</SidebarItem>
						{:else}
							<p class="text-gray-500 dark:text-gray-400">NOT LOGGED MENU</p>
							<SidebarItem label="hello-world" href="/hello-world">
								<svelte:fragment slot="icon">
									<UserSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
								</svelte:fragment>
							</SidebarItem>
						{/if}

						<DarkMode />

					</SidebarGroup>
					</SidebarWrapper>
				</Sidebar>
			</ul>
		</div>
	</aside>

	<main class="w-full sm:w-2/3 md:w-5/6 flex flex-col">
		<Navbar class="w-full bg-gray-100 dark:bg-zinc-900" style="border-bottom: 1px solid #1db954;">
			<NavBrand href="/" >
				
			</NavBrand>
			<NavHamburger/>
			<NavUl>
				{#if logged}
					<NavLi><Button on:click={logout} color="primary" outline pill><ArrowRightToBracketOutline class="w-4 h-4" color="primary" />Esci</Button></NavLi>	 
				{:else}
					<NavLi href="/registration"><Button color="primary" outline pill><EditOutline class="w-4 h-4" color="primary" />Registrati</Button></NavLi>
					<NavLi href="/login"><Button color="primary" outline pill><ArrowLeftToBracketOutline class="w-4 h-4" color="primary" />Accedi</Button></NavLi>
				{/if}
			</NavUl>
		</Navbar>

		<slot />

		<Footer footerType="logo" class="bg-white dark:bg-zinc-800 mt-auto">
			<div class="sm:flex sm:items-center sm:justify-between">
				<FooterBrand href="/" src={src} alt="SNM Logo" name="SNM" />
				<FooterLinkGroup ulClass="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
				<FooterLink href="/">Info</FooterLink>
				<FooterLink href="/">Privacy Policy</FooterLink>
				<FooterLink href="/">Contatti</FooterLink>
				</FooterLinkGroup>
			</div>
			<hr class="my-6 border-emerald-200 sm:mx-auto dark:border-emerald-700 lg:my-8" />
			<FooterCopyright href="/" by="Z&P" />
		</Footer>
	</main>
</div>

<style>
	:global(.touched:invalid) {
		border-color: red;
		outline-color: red;
		background-color: rgb(241, 142, 142);
	}
</style>