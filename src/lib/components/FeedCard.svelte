<script lang="ts">
  import type { Project } from '$lib/types';
  import { highlightCode } from '$lib/utils';

  let { project }: { project: Project } = $props();

  let showCode = $state(false);
  let copied = $state(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(project.code);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  // Simple, safe client-side markdown/readme renderer
  function renderReadme(md: string): string {
    if (!md) return '';
    
    // Escape standard HTML
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Code blocks in markdown (e.g. ```rust ... ```)
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

    // Image support (classic version)
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img class="md-image" src="$2" alt="$1" />'
    );
    return '<p class="md-p">' + html + '</p>';
  }

  const codeLines = $derived(project.code.split('\n'));
  const highlighted = $derived(highlightCode(project.code, project.languages[0] || ''));
</script>

<article class="blog-card card">
  <!-- Header -->
  <header class="card-header">
    <div class="meta-row font-mono">
      <span class="author-badge">
        <span class="author-avatar-stub">👤︎</span>
        <span class="author-name">@{project.author.username}</span>
      </span>
      <span class="dot-separator">|</span>
      <span class="publish-time">{project.createdAt}</span>
    </div>
    <h2 class="post-title font-mono">{project.title}</h2>
  </header>

  <!-- Body (README Rendered) -->
  <div class="card-body">
    <div class="markdown-content">
      {@html renderReadme(project.readme || project.description)}
    </div>

    <!-- Tags Row -->
    <div class="tags-row font-mono">
      {#each project.languages as lang}
        <span class="lang-tag">{lang.toLowerCase()}</span>
      {/each}
      {#each project.tags as tag}
        <span class="hash-tag">#{tag}</span>
      {/each}
    </div>
  </div>

  <!-- Expandable Code Block -->
  {#if project.code && !project.code.startsWith('// Local markdown blog post:')}
    <footer class="card-footer">
      <button class="toggle-code-btn button-outline" onclick={() => showCode = !showCode}>
        {showCode ? '[-] hide code' : '[+] expand code'}
      </button>

      {#if showCode}
        <div class="code-window">
          <div class="code-window-header">
            <span class="window-title font-mono">file://{project.title.toLowerCase().replace(/\s+/g, '-')}.{project.languages[0] === 'Rust' ? 'rs' : 'ts'}</span>
            <button class="copy-btn button-outline font-mono" onclick={handleCopy}>
              {copied ? 'copied!' : 'copy_code'}
            </button>
          </div>
          <div class="code-content">
            <div class="line-numbers font-mono">
              {#each codeLines as _, i}
                <span class="line-num">{i + 1}</span>
              {/each}
            </div>
            <pre class="code-text font-mono">{@html highlighted}</pre>
          </div>
        </div>
      {/if}
    </footer>
  {/if}
</article>

<style>
  .blog-card {
    background-color: var(--card);
    border: var(--border-width) solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: var(--shadow);
  }

  .card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--muted-foreground);
    text-transform: lowercase;
  }

  .author-badge {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .author-avatar-stub {
    background-color: var(--border);
    font-size: 9px;
    font-weight: 700;
    color: #ffffff;
    padding: 1px 4px;
    text-transform: uppercase;
    border-radius:50%;
  }

  .author-name {
    font-weight: 700;
    color: var(--foreground);
  }

  .dot-separator {
    color: var(--border);
  }

  .post-title {
    font-size: 16px;
    font-weight: 900;
    color: var(--foreground);
    line-height: 1.2;
    text-transform: math-auto;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Markdown custom rendered styles */
  .markdown-content :global(.md-p) {
    font-size: 13px;
    line-height: 1.6;
    color: var(--foreground);
    margin-bottom: 8px;
  }

  .markdown-content :global(.md-h1) {
    font-size: 15px;
    font-weight: 800;
    color: var(--foreground);
    margin-top: 14px;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 2px;
    text-transform: math-auto;
  }

  .markdown-content :global(.md-h2) {
    font-size: 13px;
    font-weight: 800;
    color: var(--foreground);
    margin-top: 12px;
    margin-bottom: 4px;
    text-transform: math-auto;
  }

  .markdown-content :global(.md-h3) {
    font-size: 12px;
    font-weight: 800;
    color: var(--foreground);
    margin-top: 10px;
    margin-bottom: 4px;
    text-transform: math-auto;
  }

  .markdown-content :global(.md-inline-code) {
    font-family: var(--font-mono);
    font-size: 12px;
    background-color: var(--secondary);
    color: #b91c1c; /* dark red */
    padding: 1px 3px;
    border: 1px solid var(--border);
  }

  .markdown-content :global(.md-ul) {
    margin-bottom: 8px;
    padding-left: 16px;
  }

  .markdown-content :global(.md-li) {
    font-size: 13px;
    line-height: 1.6;
    color: var(--foreground);
    margin-bottom: 4px;
  }

  .markdown-content :global(.md-code-block) {
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

  .markdown-content :global(.md-image) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 12px auto;
    border-radius: var(--radius);
  }

  /* Tags */
  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 11px;
  }

  .lang-tag {
    background-color: var(--accent);
    color: var(--accent-foreground);
    font-weight: 700;
    padding: 1px 6px;
    border: 1px solid var(--border);
  }

  .hash-tag {
    color: var(--muted-foreground);
  }

  .card-footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-top: 1px solid var(--border);
    padding-top: 12px;
  }

  .toggle-code-btn {
    align-self: flex-start;
    padding: 4px 8px;
    font-size: 11px;
    text-transform: lowercase;
  }

  /* Code window styling */
  .code-window {
    background-color: #1e1e24; /* dark terminal body */
    border: var(--border-width) solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-sm);
  }

  .code-window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--accent);
    padding: 6px 12px;
    border-bottom: var(--border-width) solid var(--border);
    color: var(--accent-foreground);
  }

  .window-title {
    font-size: 11px;
    font-weight: 700;
  }

  .copy-btn {
    padding: 2px 6px;
    font-size: 10px;
    background: #ffffff;
    box-shadow: 1px 1px 0px 0px #09090b;
    border-width: 1px;
  }

  .code-content {
    display: flex;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.4;
  }

  .line-numbers {
    display: flex;
    flex-direction: column;
    text-align: right;
    padding: 12px 8px 12px 12px;
    background-color: #18181c;
    border-right: 1px solid var(--border);
    user-select: none;
    color: #52525b;
    min-width: 36px;
  }

  .code-text {
    padding: 12px;
    white-space: pre;
    overflow: visible;
    color: #e4e4e7;
  }
</style>
