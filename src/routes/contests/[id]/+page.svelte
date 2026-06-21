<script lang="ts">
  import { page } from '$app/stores';
  import { app } from '$lib/stores/app.svelte';
  import { base } from '$app/paths';

  const contestId = $derived($page.params.id);
  const contest = $derived(app.contests.find(c => c.id === contestId));

  let activeTab = $state<'tasks' | 'standings'>('tasks');
</script>

<svelte:head>
  <title>{contest ? contest.title : 'contest'} — slml</title>
</svelte:head>

<div class="contest-hub-page">
  {#if contest}
    <header class="arena-header card">
      <a class="back-link-btn font-mono" href="{base}/contests">
        ← BACK_TO_ARENA
      </a>
      <div class="arena-meta-row">
        <div class="arena-title-info">
          <h1 class="arena-title font-mono">{contest.title}</h1>
          <p class="arena-subtitle font-mono">duration: {contest.duration.toLowerCase()} | start: {contest.startTime.toLowerCase()}</p>
          <p class="arena-description">{contest.description}</p>
        </div>
        <span class="badge" class:badge-active={contest.status === 'active'} class:badge-ended={contest.status === 'ended'} class:badge-upcoming={contest.status === 'upcoming'}>
          {contest.status}
        </span>
      </div>
    </header>

    <!-- Tabs Bar (Brutalist tabs) -->
    <div class="arena-tabs-container">
      <div class="arena-tabs">
        <button class="arena-tab font-mono" class:active={activeTab === 'tasks'} onclick={() => activeTab = 'tasks'}>
          tasks
        </button>
      </div>
    </div>

    <!-- Tab Contents -->
    {#if activeTab === 'tasks'}
      <div class="table-view card">
        <table class="arena-table">
          <thead>
            <tr>
              <th style="width: 100px">Task</th>
              <th>Title</th>
              <th style="text-align: right; width: 120px">Points</th>
              <th style="text-align: right; width: 150px">Action</th>
            </tr>
          </thead>
          <tbody>
            {#each contest.problems as problem}
              <tr>
                <td class="font-mono task-code-cell">{problem.code}</td>
                <td>
                  <a href="{base}/contests/{contest.id}/problems/{problem.id}" class="task-title-link font-mono">
                    {problem.title.toLowerCase()}
                  </a>
                </td>
                <td style="text-align: right" class="font-mono pts-text">{problem.points} pts</td>
                <td style="text-align: right">
                  <a href="{base}/contests/{contest.id}/problems/{problem.id}" class="button-primary action-btn font-mono">
                    VIEW_PROBLEM
                  </a>
                </td>
              </tr>
            {/each}
            {#if contest.problems.length === 0}
              <tr>
                <td colspan="4" class="empty-table-notice font-mono">[empty_table: no tasks uploaded yet]</td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    {/if}
  {:else}
    <div class="empty-state card">
      <h2 class="empty-title font-mono">[error: contest not found]</h2>
      <p class="empty-desc font-mono">the requested contest identifier does not exist.</p>
      <a href="{base}/contests" class="button-primary font-mono" style="margin-top: 12px;">return_to_arena</a>
    </div>
  {/if}
</div>

<style>
  .contest-hub-page {
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    padding: 24px 16px;
  }

  .arena-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    background-color: var(--card);
    border: var(--border-width) solid var(--border);
    padding: 20px;
    box-shadow: var(--shadow);
  }

  .back-link-btn {
    align-self: flex-start;
    font-size: 11px;
    font-weight: 700;
    color: var(--muted-foreground);
    text-transform: lowercase;
    transition: color var(--transition-fast);
  }

  .back-link-btn:hover {
    color: var(--foreground);
  }

  .arena-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
  }

  .arena-title-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .arena-title {
    font-size: 20px;
    font-weight: 900;
    color: var(--foreground);
    text-transform: lowercase;
  }

  .arena-subtitle {
    font-size: 11px;
    color: var(--muted-foreground);
  }

  .arena-description {
    font-size: 13px;
    color: var(--foreground);
    margin-top: 4px;
    line-height: 1.5;
  }

  /* Tabs Bar */
  .arena-tabs-container {
    margin-bottom: 16px;
  }

  .arena-tabs {
    display: inline-flex;
    background-color: #ffffff;
    border: var(--border-width) solid var(--border);
    padding: 4px;
    gap: 4px;
  }

  .arena-tab {
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 700;
    color: var(--foreground);
    border: 1px solid transparent;
    background: none;
    transition: all var(--transition-fast);
    cursor: pointer;
    text-transform: lowercase;
  }

  .arena-tab:hover {
    background-color: var(--secondary);
  }

  .arena-tab.active {
    background-color: var(--accent);
    border: 1px solid var(--border);
    box-shadow: 1px 1px 0px 0px var(--border);
  }

  /* Tables */
  .table-view {
    overflow-x: auto;
    border: var(--border-width) solid var(--border);
    box-shadow: var(--shadow);
  }

  .arena-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .arena-table th, .arena-table td {
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    text-align: left;
  }

  .arena-table th {
    background-color: var(--secondary);
    border-bottom: var(--border-width) solid var(--border);
    font-weight: 700;
    color: var(--foreground);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .arena-table tbody tr:hover {
    background-color: rgba(9, 9, 11, 0.02);
  }

  .arena-table tr:last-child td {
    border-bottom: none;
  }

  .task-code-cell {
    font-weight: 900;
    color: var(--foreground);
  }

  .task-title-link {
    font-weight: 700;
    color: var(--foreground);
  }

  .task-title-link:hover {
    text-decoration: underline;
  }

  .pts-text {
    color: var(--muted-foreground);
  }

  .empty-table-notice {
    text-align: center;
    color: var(--muted-foreground);
    padding: 32px !important;
  }

  .rank-number {
    font-weight: 700;
  }

  .standings-user {
    display: flex;
    flex-direction: column;
  }

  .user-display {
    font-weight: 700;
  }

  .score-cell {
    text-align: right;
    font-weight: 700;
    color: var(--color-success);
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
    border: var(--border-width) solid var(--border);
  }

  .empty-title {
    font-size: 14px;
    font-weight: 700;
  }

  .empty-desc {
    font-size: 12px;
    color: var(--muted-foreground);
  }

  .action-btn {
    padding: 3px 8px;
    font-size: 10px;
  }
</style>
