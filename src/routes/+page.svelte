<script lang="ts">
  import { app } from '$lib/stores/app.svelte';
  import FeedCard from '$lib/components/FeedCard.svelte';

  const quickLangs = ['Rust', 'TypeScript', 'C++', 'Python', 'Go'];
</script>

<svelte:head>
  <title>slml — competitive programming</title>
</svelte:head>

<div class="home-page-layout">
  <div class="feed-container">
    <!-- Header with Search -->
    <header class="feed-header card">
      <div class="header-main">
        <h1 class="feed-title font-mono">/ blogs</h1>
        <p class="feed-subtitle font-mono">explore optimizations, algorithm analyses, and math write-ups.</p>
      </div>

      <div class="search-row">
        <div class="search-input-wrapper">
          <input 
            type="text" 
            placeholder="[search_blogs_by_title_tag_or_language]" 
            class="feed-search-input font-mono" 
            bind:value={app.searchQuery} 
            id="search-input" 
          />
        </div>
      </div>

      <div class="filter-section">
        <span class="filter-label font-mono">filter_by:</span>
        <div class="quick-languages">
          {#each quickLangs as lang}
            <button 
              class="lang-filter-btn font-mono" 
              class:active={app.selectedLanguage === lang}
              onclick={() => {
                if (app.selectedLanguage === lang) {
                  app.selectedLanguage = null;
                } else {
                  app.selectedLanguage = lang;
                }
              }}
            >
              {lang.toLowerCase()}
            </button>
          {/each}
        </div>
      </div>
    </header>

    <!-- Feed List -->
    <div class="feed-list">
      {#each app.filteredProjects as project (project.id)}
        <FeedCard {project} />
      {/each}

      {#if app.filteredProjects.length === 0}
        <div class="empty-state card">
          <h3 class="empty-title font-mono">[empty_state: no blogs found]</h3>
          <p class="empty-desc font-mono">adjust search query or clear active language filters.</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .home-page-layout {
    max-width: 680px;
    margin: 0 auto;
    width: 100%;
    padding: 24px 16px;
  }

  .feed-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .feed-header {
    display: flex;
    flex-direction: column;
    gap: 14px;
    background-color: var(--card);
    border: var(--border-width) solid var(--border);
    padding: 20px;
    box-shadow: var(--shadow);
  }

  .header-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .feed-title {
    font-size: 20px;
    font-weight: 900;
    color: var(--foreground);
    text-transform: lowercase;
  }

  .feed-subtitle {
    font-size: 11px;
    color: var(--muted-foreground);
    text-transform: lowercase;
  }

  .search-row {
    width: 100%;
  }

  .search-input-wrapper {
    width: 100%;
  }

  .feed-search-input {
    width: 100%;
    background-color: #ffffff;
    border: var(--border-width) solid var(--border);
    padding: 8px 12px;
    font-size: 12px;
    transition: all var(--transition-fast);
  }

  .feed-search-input:focus {
    background-color: var(--accent);
  }

  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-top: 1px solid var(--border);
    padding-top: 12px;
  }

  .filter-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--muted-foreground);
    text-transform: lowercase;
  }

  .quick-languages {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .lang-filter-btn {
    background-color: #ffffff;
    border: 1px solid var(--border);
    color: var(--foreground);
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 700;
    transition: all var(--transition-fast);
    cursor: pointer;
  }

  .lang-filter-btn:hover {
    background-color: var(--secondary);
  }

  .lang-filter-btn.active {
    background-color: var(--accent);
    box-shadow: 1px 1px 0px 0px var(--border);
  }

  .feed-list {
    display: flex;
    flex-direction: column;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    text-align: center;
    gap: 6px;
    background-color: var(--card);
  }

  .empty-title {
    font-size: 13px;
    font-weight: 700;
  }

  .empty-desc {
    font-size: 11px;
    color: var(--muted-foreground);
  }
</style>
