<script lang="ts">
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	const { data } = $props();

	import { PUBLIC_CHANNEL_ID } from '$env/static/public';
</script>

<div class="mx-auto flex max-w-3xl flex-col gap-2 p-4">
	<div class="flex flex-col gap-2 py-10 text-center">
		<h1 class="text-4xl">Hack Club Takes</h1>
		<p>
			Takes from <a
				class="rounded-md bg-ctp-surface0 p-1 text-ctp-mauve hover:underline"
				href={`https://hackclub.enterprise.slack.com/archives/${PUBLIC_CHANNEL_ID}`}
			>
				#takes
			</a>
		</p>
	</div>
	{#each data.takes as take (take.ts)}
		<div class="flex flex-col gap-2 rounded-md border bg-ctp-base p-4">
			<div>
				{take.content}
			</div>
			<div class="flex gap-2">
				<div class="flex gap-2 rounded-md border bg-ctp-surface0 pr-2 pl-1">
					<ChevronUp />
					{take.upvotes}
				</div>
				<div class="flex gap-2 rounded-md border bg-ctp-surface0 pr-2 pl-1">
					<ChevronDown />
					{take.downvotes}
				</div>
			</div>
		</div>
	{/each}
</div>
