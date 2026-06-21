<script lang="ts">
  import { app } from '$lib/stores/app.svelte';

  let { collapsed = false, isMobile = false }: { collapsed?: boolean; isMobile?: boolean } = $props();
  
  const navItems = [
    { icon: '🏠', label: 'Home', href: '/', id: 'nav-home' },
    { icon: '🔍', label: 'Explore', href: '/explore', id: 'nav-explore' },
    { icon: '🔔', label: 'Notifications', href: '/notifications', id: 'nav-notifications', badge: () => app.unreadNotifications },
    { icon: '💬', label: 'Messages', href: '/messages', id: 'nav-messages', badge: () => app.unreadMessages },
    { icon: '👤', label: 'Profile', href: '/profile', id: 'nav-profile' },
  ];

  function handleNav(href: string) {
    app.activeRoute = href;
  }
</script>

<aside class="sidebar" class:collapsed aria-label="Main navigation">
  <div class="sidebar-inner">
    <!-- Logo -->
    <a href="/" class="logo" onclick={() => handleNav('/')}>
      <span class="logo-icon">⌨️</span>
      {#if !collapsed}
        <span class="logo-text">Dev<span class="gradient-text">Gram</span></span>
      {/if}
    </a>

    <!-- Navigation -->
    <nav class="nav-list">
      {#each navItems as item}
        <a 
          href={item.href}
          id={item.id}
          class="nav-item" 
          class:active={app.activeRoute === item.href}
          onclick={() => handleNav(item.href)}
        >
          <span class="nav-icon">{item.icon}</span>
          {#if !collapsed}
            <span class="nav-label">{item.label}</span>
          {/if}
          {#if item.badge && item.badge() > 0}
            <span class="nav-badge">{item.badge()}</span>
          {/if}
        </a>
      {/each}

      <!-- Create Post Button -->
      <button class="nav-item create-btn" onclick={() => app.createPostOpen = true} id="nav-create">
        <span class="nav-icon create-icon">✚</span>
        {#if !collapsed}
          <span class="nav-label">Create Post</span>
        {/if}
      </button>
    </nav>

    <!-- Bottom Section -->
    <div class="sidebar-bottom">
      <!-- Theme Switcher -->
      <button class="nav-item" onclick={() => app.toggleTheme()} id="nav-theme-toggle">
        <span class="nav-icon">{app.theme === 'dark' ? '☀️' : '🌙'}</span>
        {#if !collapsed}
          <span class="nav-label">{app.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        {/if}
      </button>

      <button class="nav-item" onclick={() => app.toggleSidebar()} id="nav-collapse">
        <span class="nav-icon">{collapsed ? '▸' : '◂'}</span>
        {#if !collapsed}
          <span class="nav-label">Collapse</span>
        {/if}
      </button>

      <!-- Current User -->
      <a href="/profile" class="user-card" onclick={() => handleNav('/profile')}>
        <img src={app.currentUser.avatar} alt={app.currentUser.displayName} class="user-avatar" />
        {#if !collapsed}
          <div class="user-info">
            <span class="user-name">{app.currentUser.displayName}</span>
            <span class="user-handle">@{app.currentUser.username}</span>
          </div>
        {/if}
      </a>
    </div>
  </div>
</aside>

<style>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    height: 100vh;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-primary);
    z-index: var(--z-sticky);
    transition: width var(--transition-base);
    overflow: hidden;
  }

  .sidebar.collapsed {
    width: var(--sidebar-collapsed);
  }

  .sidebar-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px 12px;
    gap: 8px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    margin-bottom: 16px;
    text-decoration: none;
    color: var(--text-primary);
  }

  .logo-icon {
    font-size: 28px;
    flex-shrink: 0;
  }

  .logo-text {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
    white-space: nowrap;
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 14px;
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    text-decoration: none;
    transition: all var(--transition-fast);
    position: relative;
    white-space: nowrap;
    font-size: 15px;
    font-weight: 500;
  }

  .nav-item:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .nav-item.active {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-weight: 600;
  }

  .nav-icon {
    font-size: 22px;
    width: 28px;
    text-align: center;
    flex-shrink: 0;
  }

  .nav-label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-badge {
    position: absolute;
    right: 12px;
    background: var(--color-error);
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: var(--radius-full);
    min-width: 20px;
    text-align: center;
  }

  .collapsed .nav-badge {
    right: auto;
    top: 6px;
    left: 32px;
    padding: 1px 5px;
    font-size: 10px;
    min-width: 16px;
  }

  .create-btn {
    margin-top: 8px;
    background: var(--accent-primary);
    color: var(--bg-primary) !important;
    font-weight: 600;
    border: none;
  }

  .create-btn:hover {
    background: var(--accent-primary-hover);
  }

  .create-icon {
    font-size: 18px !important;
  }

  .sidebar-bottom {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-top: 1px solid var(--border-primary);
    padding-top: 12px;
    margin-top: auto;
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: background var(--transition-fast);
  }

  .user-card:hover {
    background: var(--bg-tertiary);
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    background: var(--bg-tertiary);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .user-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-handle {
    font-size: 12px;
    color: var(--text-tertiary);
  }
</style>
