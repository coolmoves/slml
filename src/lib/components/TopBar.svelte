<script lang="ts">
  import { page } from "$app/stores";
</script>

<header class="top-bar">
  <div class="top-bar-inner">
    <!-- Left Logo & Nav Section -->
    <div class="left-nav">
      <a href="/" class="logo">
        <span class="logo-bold font-mono">slml</span>
        <span class="logo-dot">.</span>
      </a>

      <nav class="nav-links">
        <a
          href="/"
          class="nav-link font-mono"
          class:active={$page.url.pathname === "/"}
          id="nav-home"
        >
          blogs
        </a>
        <a
          href="/contests"
          class="nav-link font-mono"
          class:active={$page.url.pathname.startsWith("/contests")}
          id="nav-contests"
        >
          contests
        </a>
      </nav>
    </div>
  </div>
</header>

<style>
  .top-bar {
    width: 100%;
    height: var(--header-height);
    background: #ffffff;
    border-bottom: var(--border-width) solid var(--border);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-sticky);
  }

  .top-bar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .left-nav {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .logo {
    display: flex;
    align-items: baseline;
    gap: 0px;
  }

  .logo-bold {
    font-size: 18px;
    font-weight: 900;
    color: var(--foreground);
    text-transform: lowercase;
  }

  .logo-dot {
    color: var(--foreground);
    font-weight: 900;
    font-size: 18px;
  }

  .nav-links {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .nav-link {
    font-size: 12px;
    font-weight: 700;
    color: var(--foreground);
    padding: 4px 10px;
    text-transform: lowercase;
    transition: all var(--transition-fast);
    border: 1px solid transparent;
  }

  .nav-link:hover {
    background-color: var(--secondary);
    border: 1px solid var(--border);
  }

  .nav-link.active {
    background-color: var(--accent);
    border: 1px solid var(--border);
    box-shadow: 1px 1px 0px 0px var(--border);
  }
</style>
