<script lang="ts">
  import { app } from '$lib/stores/app.svelte';
</script>

<svelte:head>
  <title>contests — slml</title>
</svelte:head>

<div class="contests-page">
  <div class="listing-view">
    <header class="view-header card">
      <h1 class="page-title font-mono">/ contests</h1>
      <p class="subtitle font-mono">attend live programming rounds and test algorithm performance offline.</p>
    </header>

    <div class="contests-grid">
      <div class="contest-column">
        <h2 class="column-title font-mono"># active_and_upcoming</h2>
        <div class="rounds-list">
          {#each app.contests.filter(c => c.status !== 'ended') as contest}
            <div class="contest-panel card">
              <div class="panel-header">
                <span class="badge" class:badge-active={contest.status === 'active'} class:badge-upcoming={contest.status === 'upcoming'}>
                  {contest.status}
                </span>
                <span class="time-meta font-mono">{contest.startTime}</span>
              </div>
              <h3 class="panel-title font-mono">{contest.title}</h3>
              <p class="panel-desc">{contest.description}</p>
              <div class="panel-footer">
                <div class="meta-stats font-mono">
                  <span>{contest.duration.toLowerCase()}</span>
                  <span class="dot-sep">|</span>
                  <span>{contest.problems.length} tasks</span>
                </div>
                <a class="button-primary action-btn font-mono" href="/contests/{contest.id}">
                  {contest.status === 'active' ? 'enter_round' : 'view_problems'}
                </a>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="contest-column">
        <h2 class="column-title font-mono"># ended_rounds</h2>
        <div class="rounds-list">
          {#each app.contests.filter(c => c.status === 'ended') as contest}
            <div class="contest-panel card ended-panel">
              <div class="panel-header">
                <span class="badge badge-ended">ended</span>
                <span class="time-meta font-mono">finished</span>
              </div>
              <h3 class="panel-title font-mono">{contest.title}</h3>
              <p class="panel-desc">{contest.description}</p>
              <div class="panel-footer">
                <div class="meta-stats font-mono">
                  <span>{contest.duration.toLowerCase()}</span>
                  <span class="dot-sep">|</span>
                  <span>{contest.problems.length} tasks</span>
                </div>
                <a class="button-secondary action-btn font-mono" href="/contests/{contest.id}">
                  review_problems
                </a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .contests-page {
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    padding: 24px 16px;
  }

  .view-header {
    margin-bottom: 24px;
    background-color: var(--card);
    border: var(--border-width) solid var(--border);
    padding: 20px;
    box-shadow: var(--shadow);
  }

  .page-title {
    font-size: 20px;
    font-weight: 900;
    color: var(--foreground);
    text-transform: lowercase;
  }

  .subtitle {
    font-size: 11px;
    color: var(--muted-foreground);
    text-transform: lowercase;
    margin-top: 2px;
  }

  /* Contests Grid */
  .contests-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .column-title {
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--foreground);
    text-transform: lowercase;
  }

  .rounds-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .contest-panel {
    padding: 16px;
    background-color: var(--card);
    border: var(--border-width) solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: var(--shadow);
  }

  .ended-panel {
    background-color: #fafafa;
    opacity: 0.9;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .time-meta {
    font-size: 11px;
    color: var(--muted-foreground);
  }

  .panel-title {
    font-size: 14px;
    font-weight: 800;
    color: var(--foreground);
    text-transform: lowercase;
  }

  .panel-desc {
    font-size: 12px;
    color: var(--muted-foreground);
    line-height: 1.5;
  }

  .panel-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    padding-top: 12px;
    margin-top: 4px;
  }

  .meta-stats {
    font-size: 11px;
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot-sep {
    color: var(--border);
  }

  .action-btn {
    padding: 4px 10px;
    font-size: 10px;
  }

  @media (max-width: 768px) {
    .contests-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
</style>
