<script lang="ts">
  import { page } from '$app/stores';
  import { app } from '$lib/stores/app.svelte';
  import { base } from '$app/paths';

  const contestId = $derived($page.params.id);
  const problemId = $derived($page.params.problemId);

  const contest = $derived(app.contests.find(c => c.id === contestId));
  const problem = $derived(contest?.problems.find(p => p.id === problemId));

  function renderReadme(md: string): string {
    if (!md) return '';
    // Escape HTML
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Code blocks
    html = html.replace(/```[a-z]*\n([\s\S]*?)```/g, '<pre class="md-code-block"><code>$1</code></pre>');
    
    // Headers
    html = html.replace(/^# (.*?)$/gm, '<h1 class="md-h1">$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="md-h2">$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3 class="md-h3">$1</h3>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code class="md-inline-code">$1</code>');
    
    // List items
    html = html.replace(/^\- (.*?)$/gm, '<li class="md-li">$1</li>');
    
    // Wrap lists
    html = html.replace(/(<li class="md-li">.*?<\/li>)/gs, '<ul class="md-ul">$1</ul>');
    html = html.replace(/<\/ul>\s*<ul class="md-ul">/g, ''); // join consecutive lists
    
    // Double line breaks into paragraphs, single into breaks
    html = html.replace(/\n\n/g, '</p><p class="md-p">');
    html = html.replace(/\n/g, '<br />');
    
    return '<p class="md-p">' + html + '</p>';
  }
</script>

<svelte:head>
  <title>{problem ? `${problem.code.toLowerCase()} - ${problem.title.toLowerCase()}` : 'task'} — slml</title>
</svelte:head>

<div class="problem-page">
  {#if contest && problem}
    <header class="problem-header card">
      <a class="back-link-btn font-mono" href="{base}/contests/{contest.id}">
        ← BACK_TO_CONTEST
      </a>
      <div class="problem-meta-row">
        <div class="problem-title-block">
          <span class="task-code-badge font-mono">task {problem.code.toLowerCase()}</span>
          <h1 class="problem-page-title font-mono">{problem.title.toLowerCase()}</h1>
        </div>
        <span class="pts-badge font-mono">{problem.points} points</span>
      </div>
    </header>

    <div class="problem-workspace-full">
      <!-- Constraints Box -->
      <div class="constraints-card card">
        <h3 class="section-title font-mono"># constraints_and_limits</h3>
        <div class="constraints-grid">
          <div class="constraint-item font-mono">
            <span class="constraint-label">time_limit:</span>
            <span class="constraint-value">2.0s</span>
          </div>
          <div class="constraint-item font-mono">
            <span class="constraint-label">memory_limit:</span>
            <span class="constraint-value">256 mb</span>
          </div>
          <div class="constraint-item font-mono">
            <span class="constraint-label">evaluation:</span>
            <span class="constraint-value">read_only_mode</span>
          </div>
        </div>
      </div>

      <!-- Problem Statement README -->
      <div class="statement-card card">
        <div class="markdown-container">
          {@html renderReadme(problem.readme)}
        </div>
      </div>
    </div>
  {:else}
    <div class="empty-state card">
      <h2 class="empty-title font-mono">[error: task not found]</h2>
      <p class="empty-desc font-mono">the requested problem identifier does not exist or has been removed.</p>
      <a href="{base}/contests" class="button-primary font-mono" style="margin-top: 12px;">return_to_arena</a>
    </div>
  {/if}
</div>

<style>
  .problem-page {
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    padding: 24px 16px;
  }

  .problem-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    background-color: var(--card);
    border: var(--border-width) solid var(--border);
    padding: 16px;
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

  .problem-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .problem-title-block {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .task-code-badge {
    background-color: var(--secondary);
    border: 1px solid var(--border);
    color: var(--foreground);
    font-size: 11px;
    font-weight: 700;
    padding: 1px 6px;
  }

  .problem-page-title {
    font-size: 18px;
    font-weight: 900;
    text-transform: lowercase;
  }

  .pts-badge {
    background-color: var(--accent);
    color: var(--accent-foreground);
    border: 1px solid var(--border);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
  }

  /* Full Width Workspace */
  .problem-workspace-full {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .statement-card {
    padding: 20px;
    background-color: var(--card);
    border: var(--border-width) solid var(--border);
    box-shadow: var(--shadow);
  }

  /* Constraints Card */
  .constraints-card {
    padding: 16px;
    background-color: var(--card);
    border: var(--border-width) solid var(--border);
    box-shadow: var(--shadow);
  }

  .section-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--muted-foreground);
    margin-bottom: 10px;
    text-transform: lowercase;
  }

  .constraints-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .constraint-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    padding: 8px;
  }

  .constraint-label {
    font-size: 10px;
    color: var(--muted-foreground);
    text-transform: lowercase;
  }

  .constraint-value {
    font-size: 12px;
    font-weight: 700;
    color: var(--foreground);
  }

  /* Markdown custom styles */
  .markdown-container :global(.md-p) {
    font-size: 13px;
    line-height: 1.6;
    color: var(--foreground);
    margin-bottom: 8px;
  }

  .markdown-container :global(.md-h1) {
    font-size: 15px;
    font-weight: 800;
    color: var(--foreground);
    margin-top: 14px;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 2px;
    text-transform: lowercase;
  }

  .markdown-container :global(.md-h2) {
    font-size: 13px;
    font-weight: 800;
    color: var(--foreground);
    margin-top: 12px;
    margin-bottom: 4px;
    text-transform: lowercase;
  }

  .markdown-container :global(.md-h3) {
    font-size: 12px;
    font-weight: 800;
    color: var(--foreground);
    margin-top: 10px;
    margin-bottom: 4px;
    border-left: 2px solid var(--border);
    padding-left: 6px;
    text-transform: lowercase;
  }

  .markdown-container :global(.md-inline-code) {
    font-family: var(--font-mono);
    font-size: 12px;
    background-color: var(--secondary);
    color: #b91c1c;
    padding: 1px 3px;
    border: 1px solid var(--border);
  }

  .markdown-container :global(.md-ul) {
    margin-bottom: 8px;
    padding-left: 16px;
  }

  .markdown-container :global(.md-li) {
    font-size: 13px;
    line-height: 1.6;
    color: var(--foreground);
    margin-bottom: 4px;
  }

  .markdown-container :global(.md-code-block) {
    background-color: #1e1e24;
    border: var(--border-width) solid var(--border);
    border-radius: var(--radius);
    padding: 10px;
    font-family: var(--font-mono);
    font-size: 12px;
    overflow-x: auto;
    margin: 8px 0;
    color: #e4e4e7;
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

  @media (max-width: 600px) {
    .constraints-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
