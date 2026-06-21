<!--
title: SvelteKit State Store
description: A lightweight reactive state management pattern built with Svelte 5 runes. Zero dependencies, type-safe state sharing.
languages: Svelte, TypeScript
tags: state, runes, reactive, svelte5
createdAt: 2 Hours ago
-->

# SvelteKit State Store

A modern state management solution leveraging Svelte 5 runes for maximum performance.

## Features
- **Zero-dependency**: Built directly on top of native Svelte reactivity.
- **Lightweight footprint**: Extremely small bundle impact.
- **Reactive by default**: Synchronizes application data state seamlessly.

## Usage
Simply import the reactive `app` state store in your Svelte components:

```svelte
<script lang="ts">
  import { app } from "$lib/stores/app.svelte";
</script>

<p>Current Theme: {app.theme}</p>
```
