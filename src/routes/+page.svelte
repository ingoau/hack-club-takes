<script lang="ts">
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	const { data } = $props();
</script>

<div class="mx-auto flex max-w-3xl flex-col gap-2 p-4">
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
