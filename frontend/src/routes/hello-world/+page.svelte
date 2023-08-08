<script>
	async function fetchData() {
		const res = await fetch(`http://localhost:3000`);
		return await res.json();
	}

	let lateData;
	fetchData().then((lateRes) => (lateData = lateRes.text));

	//late component update
	let lateData2;
	setTimeout(function () {
		fetchData().then((res) => (lateData2 = res));
	}, 5000);
</script>

<h3>Test data fetch</h3>

{#await fetchData()}
	<p>waiting</p>
{:then data}
	<p>{data.text}</p>
{/await}

<p>{lateData == null ? 'waiting' : lateData}</p>

<p>{lateData2 == null ? 'waiting' : lateData}</p>

<style>
</style>
