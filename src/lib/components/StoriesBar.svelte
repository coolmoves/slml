<script lang="ts">
  import { app } from '$lib/stores/app.svelte';

  let activeDevs = $derived(app.users.filter(u => u.isOnline));
</script>

<div class="stories-bar">
  <!-- Your Story -->
  <button class="story-item your-story" onclick={() => app.createPostOpen = true}>
    <div class="story-ring your-ring">
      <img src={app.currentUser.avatar} alt="Your story" class="story-avatar" />
      <span class="story-add">+</span>
    </div>
    <span class="story-name">YOUR_STORY</span>
  </button>

  {#each activeDevs as dev}
    <button class="story-item" onclick={() => {}}>
      <div class="story-ring" class:has-story={dev.isOnline}>
        <img src={dev.avatar} alt={dev.displayName} class="story-avatar" />
        {#if dev.isOnline}
          <span class="online-dot"></span>
        {/if}
      </div>
      <span class="story-name">{dev.username.toUpperCase()}</span>
    </button>
  {/each}
</div>

<style>
  .stories-bar {
    display: flex;
    gap: 16px;
    padding: 16px 20px;
    overflow-x: auto;
    border-bottom: 1px solid var(--border-primary);
    scrollbar-width: none;
  }

  .stories-bar::-webkit-scrollbar {
    display: none;
  }

  .story-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .story-ring {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    padding: 3px;
    background: var(--bg-tertiary);
    position: relative;
    transition: transform var(--transition-fast);
  }

  .story-ring.has-story {
    background: var(--border-primary);
  }

  .story-avatar {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-primary);
    background: var(--bg-tertiary);
  }

  .your-ring {
    border: 1px dashed var(--border-primary);
    background: transparent;
    padding: 3px;
  }

  .story-add {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 16px;
    height: 16px;
    background: var(--accent-primary);
    color: var(--bg-primary);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    border: 1px solid var(--border-primary);
  }

  .online-dot {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 10px;
    height: 10px;
    background: var(--color-online);
    border-radius: var(--radius-full);
    border: 1px solid var(--bg-primary);
  }

  .story-name {
    font-size: 9px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    max-width: 64px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 700;
  }
</style>
