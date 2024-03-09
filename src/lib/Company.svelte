<script>
	import { afterUpdate } from "svelte";
	export let companyData;
	export let name;
	export let where;

	let enabled = {};
	export let enabledSnapshot = {};

	function applySnapshot() {
		enabled = enabledSnapshot;
	}

	afterUpdate(() => {
		applySnapshot();
	});
</script>

<h1 class="text-xl dark:text-white">{name}</h1>
{#if where}
	<h2 class="text-sm dark:text-white">{where}</h2>
{/if}
{#each Object.entries(companyData) as [key, value]}
	<button
		on:click={() => {
			// reset();
			enabled[key] =
				key === "Om oss/att jobba med oss"
					? (enabled[key] = !enabled[key])
					: key.includes("Mer om oss") || key.includes("mer om oss")
					? (enabled[key] = !enabled[key])
					: key === "Vi är intresserade av dig som studerar"
					? (enabled[key] = !enabled[key])
					: key === "Vi är intresserade av att"
					? (enabled[key] = !enabled[key])
					: key === "Några exempel på avdelningar/tjänster som finns hos oss"
					? (enabled[key] = !enabled[key])
					: key === "Några av de område som vi arbetar med är"
					? (enabled[key] = !enabled[key])
					: key.includes("Kompetenser vi värdesätter") ||
					  key.includes("Kompetenser som vi värdesätter extra/letar efter") ||
					  key.includes("Kompetenser som vi värdesätter")
					? (enabled[key] = !enabled[key])
					: key.includes("kontakta mig om du har") ||
					  key.includes("Kontakta mig om du har") ||
					  key.includes("Kontakta mig vid frågor")
					? (enabled[key] = !enabled[key])
					: key.includes("Extra")
					? (enabled[key] = !enabled[key])
					: "";
		}}
		class="key"
		class:toggled={enabled[key]}>{key}</button>
	{#if key === "Om oss/att jobba med oss"}
		{#if enabled[key]}
			{#each value as line}
				<p class="dark:text-white">
					{line}
				</p>
			{/each}
		{/if}
	{/if}
	{#if key.includes("Mer om oss") || key.includes("mer om oss")}
		{#if enabled[key]}
			<div class="flex-col">
				{#each Object.entries(value) as [linkType, link]}
					<!-- check if link actually is something  -->
					{#if link}
						<a
							class="underline-2 underline-solid underline-blue underline dark:text-white"
							href={link}>{linkType}</a>
					{/if}
				{/each}
			</div>
		{/if}
	{/if}
  {#if key === "Några exempel på avdelningar/tjänster som finns hos oss"}
		{#if enabled[key]}
			<div class="dark:text-white [&>*]:m-px">
        {value}
			</div>
		{/if}
	{/if}
  {#if key === "Några av de område som vi arbetar med är"}
		{#if enabled[key]}
			<div class="dark:text-white [&>*]:m-px">
        {value}
			</div>
		{/if}
	{/if}
	{#if key === "Vi är intresserade av dig som studerar"}
		{#if enabled[key]}
			<div class="dark:text-white [&>*]:m-px">
				{#each value as studentType}
					<p>
						{studentType}
					</p>
				{/each}
			</div>
		{/if}
	{/if}
	{#if key === "Vi är intresserade av att"}
		{#if enabled[key]}
			{#each value as ourInterest}
				<p class="dark:text-white">
					{ourInterest}
				</p>
			{/each}
		{/if}
	{/if}
	{#if key.includes("Kompetenser vi värdesätter") || key.includes("Kompetenser som vi värdesätter") || key.includes("Kompetenser som vi värdesätter extra/letar efter")}
		{#if enabled[key]}
			<p class="dark:text-white">
				{value}
			</p>
		{/if}
	{/if}
	{#if key.includes("kontakta mig om du har") || key.includes("Kontakta mig om du har") || key.includes("Kontakta mig vid frågor") || key.includes("Kontakta mig om du har frågor")}
		{#if enabled[key]}
			{#each value as address}
				{#if !value.includes("(")}
					{#if address.includes("@")}
						<a
							class="underline-2 underline-solid underline-blue block break-all underline dark:text-white"
							href="mailto:{address}">{address}</a>
					{:else}
						<p class="dark:text-white">
							{address}
						</p>
					{/if}
				{:else}
					<a
						class="underline-2 underline-solid underline-blue break-all underline"
						href="mailto:{address.split('(')[0]}">{address.split("(")[0]}</a>
					<p class="dark:text-white">({value.split("(")[1]}</p>
				{/if}
			{/each}
		{/if}
	{/if}
	{#if key.includes("Extra")}
		{#if enabled[key]}
			<p class="dark:text-white">
				{value}
			</p>
		{/if}
	{/if}
{/each}

<style>
	.key {
		@apply dark-bg-slate-500 dark-text-white rounded-md bg-slate-300 p-2;
	}
	.toggled {
		@apply dark-bg-blue-600 rounded-md bg-blue-300 p-2;
	}
</style>
