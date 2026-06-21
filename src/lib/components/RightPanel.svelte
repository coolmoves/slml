<script lang="ts">
  import { app } from '$lib/stores/app.svelte';

  // Sorted by profileStars desc
  let topDevs = $derived(
    [...app.users]
      .sort((a, b) => b.profileStars - a.profileStars)
      .slice(0, 3)
  );

  // Sorted leaderboard entries
  let topCompetitors = $derived(
    [...app.leaderboard]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 3)
  );
</script>

<aside class="right-panel">
  <!-- Search -->
  <div class="search-box">
    <input 
      type="text" 
      placeholder="SEARCH HUB..." 
      class="search-input" 
      bind:value={app.searchQuery} 
      id="search-input" 
    />
  </div>

  <!-- Contest Leaderboard -->
  <section class="panel-card">
    <h3 class="panel-title">[ LEADERBOARD ]</h3>
    <div class="competitor-list">
      {#each topCompetitors as comp, index}
        <div class="competitor-row">
          <span class="rank">#{index + 1}</span>
          <div class="comp-details">
            <span class="comp-name">{comp.displayName.toUpperCase()}</span>
            <span class="comp-handle">@{comp.username}</span>
          </div>
          <div class="comp-stats">
            <span class="stat-pts">{comp.totalPoints} PTS</span>
            <span class="stat-solved">{comp.solvedCount} SOLVED</span>
          </div>
        </div>
      {/each}
      {#if topCompetitors.length === 0}
        <span class="empty-text">No submissions yet</span>
      {/if}
    </div>
  </section>

  <!-- Top Starred Developers -->
  <section class="panel-card">
    <h3 class="panel-title">[ TOP DEVELOPERS ]</h3>
    <div class="dev-list">
      {#each topDevs as dev}
        <div class="dev-card">
          <div class="dev-info">
            <img src={dev.avatar} alt={dev.displayName} class="dev-avatar" />
            <div class="dev-details">
              <div class="dev-name-row">
                <span class="dev-name">{dev.displayName.toUpperCase()}</span>
                {#if dev.isVerified}
                  <span class="verified">[V]</span>
                {/if}
              </div>
              <span class="dev-handle">@{dev.username}</span>
              <span class="dev-stars">★ {dev.profileStars} Stars</span>
            </div>
          </div>
          {#if dev.id !== app.currentUser.id}
            <button 
              class="star-btn" 
              onclick={() => app.toggleStar(dev.id)} 
              class:starred={dev.starredByCurrentUser}
            >
              {dev.starredByCurrentUser ? '[★]' : '[☆]'}
            </button>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <!-- Footer -->
  <footer class="panel-footer">
    <span>© 2026 SLML HUB</span>
  </footer>
</aside>

<style>
  .right-panel {
    width: 340px;
    flex-shrink: 0;
    padding: 20px 0 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: sticky;
    top: var(--header-height);
    max-height: calc(100vh - var(--header-height));
    overflow-y: auto;
  }

  .search-box {
    display: flex;
    align-items: center;
    padding: 8px 14px;
    background: var(--bg-card);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
    transition: border-color var(--transition-fast);
  }

  .search-box:focus-within {
    border-color: var(--text-primary);
  }

  .search-input {
    flex: 1;
    background: none;
    border: none;
    padding: 0;
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-primary);
    outline: none;
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  .panel-card {
    background: var(--bg-card);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
    padding: 16px;
  }

  .panel-title {
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--text-primary);
  }

  /* Leaderboard List */
  .competitor-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .competitor-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 11px;
    padding-bottom: 8px;
    border-bottom: 1px dashed var(--border-primary);
  }

  .competitor-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .rank {
    font-weight: 700;
    color: var(--color-info);
    width: 20px;
  }

  .comp-details {
    flex: 1;
    min-width: 0;
  }

  .comp-name {
    display: block;
    font-weight: 700;
    color: var(--text-primary);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .comp-handle {
    font-size: 9px;
    color: var(--text-muted);
  }

  .comp-stats {
    text-align: right;
    font-size: 9px;
  }

  .stat-pts {
    display: block;
    font-weight: 700;
    color: var(--color-success);
  }

  .stat-solved {
    color: var(--text-tertiary);
  }

  .empty-text {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    text-align: center;
  }

  /* Developer Cards */
  .dev-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .dev-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .dev-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .dev-avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-primary);
    flex-shrink: 0;
    background: var(--bg-tertiary);
  }

  .dev-details {
    min-width: 0;
  }

  .dev-name-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dev-name {
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .verified {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    font-size: 10px;
    font-family: var(--font-mono);
    font-weight: 700;
    flex-shrink: 0;
  }

  .dev-handle {
    font-size: 9px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    display: block;
  }

  .dev-stars {
    font-size: 9px;
    font-family: var(--font-mono);
    color: var(--color-info);
    display: block;
  }

  .star-btn {
    padding: 4px 6px;
    font-size: 12px;
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-tertiary);
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .star-btn:hover {
    color: var(--color-info);
  }

  .star-btn.starred {
    color: var(--color-info);
  }

  .panel-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-muted);
    padding: 4px 0;
    flex-wrap: wrap;
  }

  @media (max-width: 1200px) {
    .right-panel {
      display: none;
    }
  }
</style>
