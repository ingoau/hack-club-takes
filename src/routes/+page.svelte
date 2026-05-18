<script lang="ts">
	import { ChevronDown, ChevronUp, ExternalLink, Link } from 'lucide-svelte';

	const { data } = $props();

	import { PUBLIC_CHANNEL_ID } from '$env/static/public';
</script>

<div class="mx-auto flex max-w-3xl flex-col gap-2 p-4">
	<div class="flex flex-col gap-2 py-10 text-center">
		<h1 class="text-4xl">Hack Club Takes</h1>
		<p>
			Takes from <a
				class="rounded-lg bg-ctp-surface0 p-1 text-ctp-mauve hover:underline"
				href={`https://hackclub.enterprise.slack.com/archives/${PUBLIC_CHANNEL_ID}`}
				target="_blank"
			>
				#takes
			</a>
		</p>
	</div>
	{#each data.takes as take (take.ts)}
		<div
			class="flex flex-col gap-2 rounded-lg border bg-ctp-base p-4 target:bg-ctp-surface0 target:border-ctp-mauve"
			id={take.ts}
		>
			<div>
				{take.content}
			</div>
			<div class="flex gap-2">
				<div
					class="flex items-center justify-center gap-2 rounded-lg border bg-ctp-red px-2 text-ctp-base"
				>
					<ChevronUp class="size-4" />
					{take.upvotes}
				</div>
				<div
					class="flex items-center justify-center gap-2 rounded-lg border bg-ctp-blue px-2 text-ctp-base"
				>
					<ChevronDown class="size-4" />
					{take.downvotes}
				</div>
				<div class="grow"></div>
				<a
					class="flex items-center justify-center gap-2 rounded-lg border bg-ctp-surface0 px-2 duration-200 hover:bg-ctp-surface1 active:brightness-75"
					href={`https://hackclub.slack.com/archives/${PUBLIC_CHANNEL_ID}/p${take.ts}`}
					target="_blank"
				>
					<ExternalLink class="size-4" />
					Slack
				</a>
				<button
					class="flex items-center justify-center gap-2 rounded-lg border bg-ctp-surface0 px-2 duration-200 hover:bg-ctp-surface1 active:brightness-75"
					onclick={() => {
						const url = new URL(location.href);
						url.hash = take.ts;
						navigator.clipboard.writeText(url.toString());
					}}
				>
					<Link class="size-4" />
					Copy
				</button>
			</div>
		</div>
	{/each}
</div>
