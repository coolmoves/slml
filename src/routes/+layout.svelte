<script lang="ts">
  import '../app.css';
  import TopBar from '$lib/components/TopBar.svelte';
  import { app } from '$lib/stores/app.svelte';

  let { children } = $props();
</script>

<div class="app-layout {app.theme}">
  <TopBar />
  
  <main class="main-content">
    {@render children()}
  </main>
</div>

<style>
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: relative;
  }

  .main-content {
    flex: 1;
    margin-top: var(--header-height);
    min-height: calc(100vh - var(--header-height));
    padding-bottom: 40px;
  }
</style>
