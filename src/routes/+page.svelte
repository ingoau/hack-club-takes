<script lang="ts">
	const { data } = $props();

	import { PUBLIC_CHANNEL_ID } from '$env/static/public';
	import Take from '$lib/components/take.svelte';
</script>

<div class="mx-auto flex max-w-3xl flex-col gap-2 p-4">
	<div class="flex flex-col gap-2 py-10 text-center">
		<h1 class="text-6xl">hack club takes</h1>
		<h2 class="text-lg">
			takes from <a
				class="rounded-lg bg-ctp-surface0 p-1 text-ctp-mauve hover:underline"
				href={`https://hackclub.enterprise.slack.com/archives/${PUBLIC_CHANNEL_ID}`}
				target="_blank"
			>
				#takes
			</a>
		</h2>
	</div>
	{#each data.takes as take (take.ts)}
		<Take {take} />
	{/each}
</div>
