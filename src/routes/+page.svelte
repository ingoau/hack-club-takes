<script lang="ts">
	const { data } = $props();

	import { PUBLIC_CHANNEL_ID } from '$env/static/public';
	import Take from '$lib/components/take.svelte';
	import { Heart } from 'lucide-svelte';
</script>

<svelte:head>
	<title>hack club takes</title>
	<meta
		name="description"
		content="a collection of takes from the hack club slack channel #takes"
	/>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-2 p-4">
	<div
		class="relative flex flex-col gap-2 rounded-md bg-linear-to-br from-ctp-mauve-900/50 to-ctp-base py-10 text-center drop-shadow-2xl drop-shadow-ctp-mauve/10"
	>
		<h1 class="text-6xl">hack club takes</h1>
		<h2 class="text-lg">
			{data.takes.length} takes from
			<a
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
	{:else}
		<div class="p-4 text-center">There are no takes or something is broken</div>
	{/each}
	<div
		class="flex items-center justify-center gap-2 pt-4 text-sm opacity-50 grayscale duration-100 hover:opacity-100 hover:grayscale-0 [&_a]:text-ctp-mauve [&_a]:hover:underline"
	>
		<div>
			made with <Heart class="mx-px inline size-4 align-text-bottom text-ctp-red" /> by
			<a href="https://ingo.au?utm_source=hc-takes" target="_blank">Ingo</a>
		</div>
		<div class="size-1 rounded-full bg-ctp-text"></div>
		<div>
			<a target="_blank" href="https://github.com/ingoau/hack-club-takes">open source</a>
		</div>
	</div>
</div>
