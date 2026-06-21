<script lang="ts">
  import { app } from '$lib/stores/app.svelte';

  const items = [
    { icon: '🏠', label: 'Home', href: '/' },
    { icon: '🔍', label: 'Explore', href: '/explore' },
    { icon: '✚', label: 'Create', href: '#create', isCreate: true },
    { icon: '🔔', label: 'Alerts', href: '/notifications', badge: () => app.unreadNotifications },
    { icon: '👤', label: 'Profile', href: '/profile' },
  ];

  function handleTap(item: typeof items[0]) {
    if (item.isCreate) {
      app.createPostOpen = true;
    } else {
      app.activeRoute = item.href;
    }
  }
</script>

<nav class="bottom-nav glass" aria-label="Mobile navigation">
  {#each items as item}
    <button
      class="bottom-nav-item"
      class:active={!item.isCreate && app.activeRoute === item.href}
      class:create-btn={item.isCreate}
      onclick={() => handleTap(item)}
    >
      {#if item.isCreate}
        <span class="create-icon-wrap">
          <span class="create-icon">{item.icon}</span>
        </span>
      {:else}
        <span class="item-icon">{item.icon}</span>
      {/if}
      <span class="item-label">{item.label}</span>
      {#if item.badge && item.badge() > 0}
        <span class="item-badge">{item.badge()}</span>
      {/if}
    </button>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bottom-nav-height);
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: var(--z-sticky);
    padding: 0 8px;
    border-top: 1px solid var(--border-primary);
    background: var(--bg-secondary);
  }

  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 12px;
    border-radius: var(--radius-md);
    color: var(--text-tertiary);
    position: relative;
    transition: color var(--transition-fast);
    min-width: 52px;
  }

  .bottom-nav-item.active {
    color: var(--text-primary);
  }

  .item-icon {
    font-size: 22px;
  }

  .item-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .create-btn .create-icon-wrap {
    width: 40px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-primary);
    border-radius: var(--radius-md);
  }

  .create-icon {
    font-size: 18px;
    color: var(--bg-primary);
  }

  .item-badge {
    position: absolute;
    top: 0;
    right: 6px;
    background: var(--color-error);
    color: white;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: var(--radius-full);
    min-width: 14px;
    text-align: center;
  }
</style>
