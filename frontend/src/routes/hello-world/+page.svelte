<script>
	async function fetchData() {
		const res = await fetch(`http://localhost:3000`);
		return await res.json();
	}

	let lateData;
	fetchData().then((lateRes) => (lateData = lateRes.text));
</script>

<h1>Hello and welcome to my site!</h1>
<a href="/about">About my site</a>

{#await fetchData()}
	<p>waiting</p>
{:then data}
	<p>{data.text}</p>
{/await}

<p>{lateData == null ? 'waiting' : lateData}</p>

<style>
</style>
