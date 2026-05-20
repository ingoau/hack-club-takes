<script lang="ts">
	import { Check, ChevronDown, ChevronUp, Clipboard, ExternalLink, Link } from 'lucide-svelte';

	import { PUBLIC_CHANNEL_ID } from '$env/static/public';
	import type { PageData } from '../../routes/$types';

	const { take }: { take: PageData['takes'][number] } = $props();

	let copied = $state(false);
</script>

<div
	class="relative flex flex-col gap-2 overflow-hidden rounded-lg border bg-ctp-base p-2 target:border-ctp-mauve target:bg-ctp-surface0"
	id={take.ts}
>
	<div class="absolute bottom-0 left-0 flex h-12 p-2 opacity-75 blur-xl">
		<div class="h-full w-14 bg-ctp-red"></div>
		<div class="h-full w-14 bg-ctp-blue"></div>
	</div>
	<div class="z-10 rounded-md border bg-ctp-base/25 p-2 drop-shadow-2xl">
		{take.content}
	</div>
	<div class="z-10 flex gap-2">
		<div class="flex items-center justify-center gap-2 rounded-lg bg-ctp-red px-2 text-ctp-base">
			<ChevronUp class="size-4" />
			{take.upvotes}
		</div>
		<div class="flex items-center justify-center gap-2 rounded-lg bg-ctp-blue px-2 text-ctp-base">
			<ChevronDown class="size-4" />
			{take.downvotes}
		</div>
		<div class="grow"></div>
		<button
			class="flex items-center justify-center gap-2 rounded-lg border bg-ctp-surface0 px-2 duration-200 hover:bg-ctp-surface1 active:brightness-75"
			onclick={() => {
				const url = new URL(location.href);
				url.hash = take.ts;
				navigator.clipboard.writeText(url.toString());
				copied = true;
				setTimeout(() => {
					copied = false;
				}, 2000);
			}}
		>
			{#if copied}
				<Check class="size-4" />
			{:else}
				<Clipboard class="size-4" />
			{/if}
			link
		</button>
		<a
			class="flex items-center justify-center gap-2 rounded-lg border bg-ctp-surface0 px-2 duration-200 hover:bg-ctp-surface1 active:brightness-75"
			href={`https://hackclub.slack.com/archives/${PUBLIC_CHANNEL_ID}/p${take.ts}`}
			target="_blank"
		>
			<ExternalLink class="size-4" />
			slack
		</a>
	</div>
</div>
