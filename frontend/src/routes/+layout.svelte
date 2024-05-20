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
		FooterLinkGroup
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { ChartPieSolid, GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketOutline, EditOutline } from 'flowbite-svelte-icons';

	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	let src = '/logo.png';  
	let ready = false;
	
	onMount(() => {
		ready = true;
	});

	$: activeUrl = $page.url.pathname;
	  
</script>
<!-- 
<section class="h-screen w-screen bg-zinc-800 flex flex-col-reverse sm:flex-row min-h-0 min-w-0">
	<aside class="bg-white dark:bg-zinc-900">
		<Sidebar {activeUrl}>
			<SidebarWrapper>
			<SidebarGroup>
				<SidebarItem label="Dashboard">
				<svelte:fragment slot="icon">
					<ChartPieSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
				</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Kanban" {spanClass}>
				<svelte:fragment slot="icon">
					<GridSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
				</svelte:fragment>
				<svelte:fragment slot="subtext">
					<span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"> Pro </span>
				</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Inbox" {spanClass}>
				<svelte:fragment slot="icon">
					<MailBoxSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
				</svelte:fragment>
				<svelte:fragment slot="subtext">
					<span class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"> 3 </span>
				</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Sidebar" href="/docs/components/sidebar" active={activeUrl === '/docs/components/sidebar'}>
				<svelte:fragment slot="icon">
					<UserSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
				</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Sign In">
				<svelte:fragment slot="icon">
					<ArrowRightToBracketOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
				</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Sign Up">
				<svelte:fragment slot="icon">
					<EditOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
				</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</aside>
	<main class="sm:h-full flex-1 flex flex-col min-h-0 min-w-0 overflow-auto">
		<Navbar class="flex-none w-full mx-auto bg-white dark:bg-zinc-900">
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
		<section class="flex-1 pt-3 md:p-6 lg:mb-0 lg:min-h-0 lg:min-w-0">
			<div class="flex flex-col lg:ml-72 w-full mx-auto">
			
						<DarkMode />	
						<slot />
				
	
			</div>
		</section>
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
	</main>
  </section> -->

<div class="container">
    <div class="flex flex-row flex-wrap">
        <aside class="w-full sm:w-1/3 md:w-1/4 bg-white dark:bg-zinc-900">
            <div class="sticky top-10 w-full">
                <!-- navigation -->
                <ul class="flex flex-col overflow-hidden">
                    <Sidebar {activeUrl}>
						<SidebarWrapper>
						<SidebarGroup>
							<SidebarItem label="Dashboard">
							<svelte:fragment slot="icon">
								<ChartPieSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
							</svelte:fragment>
							</SidebarItem>
							<SidebarItem label="Kanban" {spanClass}>
							<svelte:fragment slot="icon">
								<GridSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
							</svelte:fragment>
							<svelte:fragment slot="subtext">
								<span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"> Pro </span>
							</svelte:fragment>
							</SidebarItem>
							<SidebarItem label="Inbox" {spanClass}>
							<svelte:fragment slot="icon">
								<MailBoxSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
							</svelte:fragment>
							<svelte:fragment slot="subtext">
								<span class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"> 3 </span>
							</svelte:fragment>
							</SidebarItem>
							<SidebarItem label="Sidebar" href="/docs/components/sidebar" active={activeUrl === '/docs/components/sidebar'}>
							<svelte:fragment slot="icon">
								<UserSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
							</svelte:fragment>
							</SidebarItem>
							<SidebarItem label="Sign In">
							<svelte:fragment slot="icon">
								<ArrowRightToBracketOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
							</svelte:fragment>
							</SidebarItem>
							<SidebarItem label="Sign Up">
							<svelte:fragment slot="icon">
								<EditOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
							</svelte:fragment>
							</SidebarItem>
						</SidebarGroup>
						</SidebarWrapper>
					</Sidebar>
                </ul>
            </div>
        </aside>
        <main class="w-full sm:w-2/3 md:w-3/4 pt-1 px-2">
            <Navbar class="flex-none w-full mx-auto bg-white dark:bg-zinc-900">
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
			<DarkMode />	
			<slot />
        </main>
    </div>
</div>
<Footer footerType="logo" class="bg-white dark:bg-zinc-800 mt-auto">
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