<script lang="ts">
	const { data } = $props();
</script>

<div class="mx-auto max-w-3xl p-4">
	{#each data.takes as take (take.ts)}
		<div class="border bg-ctp-base p-4">
			{take.content}
		</div>
	{/each}
</div>
