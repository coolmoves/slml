<script lang="ts">
  import { app } from '$lib/stores/app.svelte';
  import { formatCount, getLanguageColor, highlightCode, copyToClipboard } from '$lib/utils';

  let project = $derived(app.selectedProject!);
  let fullHighlighted = $derived(highlightCode(project.code, project.languages[0] || ''));
  let codeLines = $derived(project.code.split('\n'));
  let copied = $state(false);
  let newComment = $state('');
  let activeTab = $state<'code' | 'readme' | 'versions'>('code');

  async function handleCopy() {
    await copyToClipboard(project.code);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function addComment() {
    if (!newComment.trim()) return;
    const commentObj = {
      id: 'comment_' + Date.now(),
      userId: app.currentUser.id,
      user: {
        id: app.currentUser.id,
        username: app.currentUser.username,
        displayName: app.currentUser.displayName,
        avatar: app.currentUser.avatar,
        isVerified: app.currentUser.isVerified,
        profileStars: app.currentUser.profileStars
      },
      content: newComment,
      createdAt: 'Just now',
      likes: 0,
      likedByUser: false,
      replies: []
    };
    project.comments = [...project.comments, commentObj];
    newComment = '';
  }

  function close() {
    app.closeProject();
  }

  function handleBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) close();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={handleBackdropClick}>
  <div class="modal-container animate-scale-in" role="dialog" aria-label="{project.title} details">
    <!-- Modal Header -->
    <header class="modal-header">
      <div class="modal-header-left">
        <img src={project.author.avatar} alt={project.author.displayName} class="modal-avatar" />
        <div>
          <div class="modal-author-row">
            <span class="modal-author-name">{project.author.displayName.toUpperCase()}</span>
            {#if project.author.isVerified}
              <span class="verified">[V]</span>
            {/if}
          </div>
          <span class="modal-handle">@{project.author.username.toUpperCase()} · {project.createdAt.toUpperCase()}</span>
        </div>
      </div>
      <button class="close-btn" onclick={close} aria-label="Close">[X]</button>
    </header>

    <!-- Project Title -->
    <div class="modal-title-section">
      <h2 class="modal-title">{project.title.toUpperCase()}</h2>
      <div class="modal-tags">
        {#each project.languages as lang}
          <span class="lang-badge" style="--c: {getLanguageColor(lang)}">
            <span class="lang-dot"></span>{lang.toUpperCase()}
          </span>
        {/each}
        {#each project.tags as tag}
          <span class="tag-badge">#{tag.toUpperCase()}</span>
        {/each}
      </div>
      <p class="modal-desc">{project.description}</p>
    </div>

    <!-- Stats Row -->
    <div class="modal-stats">
      <div class="stat"><span class="stat-val">{formatCount(project.likes)}</span> LIKES</div>
      <div class="stat"><span class="stat-val">{formatCount(project.views)}</span> VIEWS</div>
      <div class="stat"><span class="stat-val">{formatCount(project.shares)}</span> SHARES</div>
    </div>

    <!-- Tabs -->
    <div class="modal-tabs">
      <button class="tab-btn" class:active={activeTab === 'code'} onclick={() => activeTab = 'code'}>CODE</button>
      <button class="tab-btn" class:active={activeTab === 'readme'} onclick={() => activeTab = 'readme'}>README</button>
      <button class="tab-btn" class:active={activeTab === 'versions'} onclick={() => activeTab = 'versions'}>VERSIONS</button>
    </div>

    <!-- Tab Content -->
    <div class="modal-body">
      {#if activeTab === 'code'}
        <div class="code-section">
          <div class="code-toolbar">
            <span class="code-file-name">{project.title.toLowerCase().replace(/\s+/g, '-')}.{project.languages[0] === 'Python' ? 'py' : project.languages[0] === 'Rust' ? 'rs' : project.languages[0] === 'Go' ? 'go' : 'ts'}</span>
            <div class="code-actions">
              <button class="toolbar-btn" onclick={handleCopy}>{copied ? '[COPIED]' : '[COPY]'}</button>
            </div>
          </div>
          <div class="full-code">
            <div class="line-numbers">
              {#each codeLines as _, i}
                <span>{i + 1}</span>
              {/each}
            </div>
            <pre class="code-text">{@html fullHighlighted}</pre>
          </div>
        </div>
      {:else if activeTab === 'readme'}
        <div class="readme-section">
          <div class="readme-content">{project.readme}</div>
        </div>
      {:else}
        <div class="versions-section">
          {#each project.versions as ver}
            <div class="version-item">
              <span class="version-tag">v{ver.version}</span>
              <span class="version-msg">{ver.message}</span>
              <span class="version-date">{ver.createdAt}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Contributors -->
    <div class="contributors-section">
      <h4 class="section-title">CONTRIBUTORS</h4>
      <div class="contributor-list">
        {#each project.contributors as contributor}
          <div class="contributor">
            <img src={contributor.avatar} alt={contributor.displayName} class="contributor-avatar" />
            <span class="contributor-name">{contributor.displayName.toUpperCase()}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Comments -->
    <div class="comments-section">
      <h4 class="section-title">COMMENTS ({project.comments.length})</h4>
      <div class="comment-input-row">
        <img src={app.currentUser.avatar} alt="You" class="comment-avatar" />
        <input 
          type="text" 
          bind:value={newComment} 
          placeholder="Add a comment..." 
          class="comment-input" 
          onkeydown={(e) => e.key === 'Enter' && addComment()}
        />
        <button class="comment-submit" disabled={!newComment.trim()} onclick={addComment}>[POST]</button>
      </div>
      <div class="comments-list">
        {#each project.comments as comment}
          <div class="comment-item">
            <img src={comment.user.avatar} alt={comment.user.displayName} class="comment-avatar" />
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-author">{comment.user.displayName.toUpperCase()}</span>
                <span class="comment-time">{comment.createdAt.toUpperCase()}</span>
              </div>
              <p class="comment-text">{comment.content}</p>
              <div class="comment-actions">
                <button class="comment-action-btn">[LIKE] {comment.likes}</button>
                <button class="comment-action-btn">[REPLY]</button>
              </div>
              {#if comment.replies.length > 0}
                <div class="replies">
                  {#each comment.replies as reply}
                    <div class="comment-item reply-item">
                      <img src={reply.user.avatar} alt={reply.user.displayName} class="comment-avatar" />
                      <div class="comment-body">
                        <div class="comment-header">
                          <span class="comment-author">{reply.user.displayName.toUpperCase()}</span>
                          <span class="comment-time">{reply.createdAt.toUpperCase()}</span>
                        </div>
                        <p class="comment-text">{reply.content}</p>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--bg-overlay);
    z-index: var(--z-modal);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 20px;
    overflow-y: auto;
    backdrop-filter: blur(4px);
  }

  .modal-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
    width: 100%;
    max-width: 780px;
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-primary);
  }

  .modal-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .modal-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-primary);
    background: var(--bg-tertiary);
  }

  .modal-author-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .modal-author-name {
    font-weight: 700;
    font-size: 13px;
    font-family: var(--font-mono);
  }

  .verified {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    font-size: 10px;
    font-family: var(--font-mono);
    font-weight: 700;
  }

  .modal-handle {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
  }

  .close-btn {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-secondary);
    transition: all var(--transition-fast);
  }

  .close-btn:hover {
    color: var(--color-error);
    background: var(--bg-secondary);
  }

  .modal-title-section {
    padding: 20px 24px 0;
  }

  .modal-title {
    font-size: 16px;
    font-family: var(--font-mono);
    font-weight: 800;
    margin-bottom: 10px;
  }

  .modal-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }

  .lang-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: var(--radius-sm);
    font-size: 10px;
    font-family: var(--font-mono);
    font-weight: 700;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    color: var(--text-secondary);
  }

  .lang-dot {
    width: 7px;
    height: 7px;
    border-radius: var(--radius-full);
    background: var(--c);
  }

  .tag-badge {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-secondary);
    padding: 3px 8px;
    border-radius: var(--radius-sm);
    background: var(--bg-tertiary);
    border: 1px dashed var(--border-primary);
    font-weight: 500;
  }

  .modal-desc {
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .modal-stats {
    display: flex;
    gap: 24px;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-primary);
  }

  .stat {
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
  }

  .stat-val {
    font-weight: 700;
    color: var(--text-primary);
  }

  .modal-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-primary);
    padding: 0 24px;
  }

  .tab-btn {
    padding: 12px 20px;
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-tertiary);
    border-bottom: 2px solid transparent;
    transition: all var(--transition-fast);
  }

  .tab-btn.active {
    color: var(--text-primary);
    border-bottom-color: var(--text-primary);
  }

  .tab-btn:hover {
    color: var(--text-primary);
  }

  .modal-body {
    padding: 20px 24px;
  }

  /* Code Section */
  .code-section {
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--bg-secondary);
  }

  .code-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-primary);
  }

  .code-file-name {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    color: var(--text-tertiary);
  }

  .code-actions {
    display: flex;
    gap: 8px;
  }

  .toolbar-btn {
    font-size: 10px;
    font-family: var(--font-mono);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    color: var(--text-secondary);
    font-weight: 700;
    transition: all var(--transition-fast);
  }

  .toolbar-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  .full-code {
    display: flex;
    padding: 14px 0;
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 1.65;
    overflow-x: auto;
    max-height: 450px;
  }

  .line-numbers {
    display: flex;
    flex-direction: column;
    padding: 0 14px;
    text-align: right;
    color: var(--text-muted);
    user-select: none;
    flex-shrink: 0;
    border-right: 1px solid var(--border-primary);
    margin-right: 14px;
    font-size: 11px;
    line-height: 1.65;
  }

  .code-text {
    margin: 0;
    white-space: pre;
    color: var(--text-primary);
    padding-right: 14px;
  }

  /* README */
  .readme-section {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
    padding: 20px;
  }

  .readme-content {
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
    white-space: pre-wrap;
    font-family: var(--font-mono);
  }

  /* Versions */
  .version-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-primary);
  }

  .version-item:last-child {
    border-bottom: none;
  }

  .version-tag {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    color: var(--text-primary);
    padding: 3px 10px;
    border-radius: var(--radius-sm);
    font-size: 10px;
    font-weight: 700;
    font-family: var(--font-mono);
  }

  .version-msg {
    flex: 1;
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-secondary);
  }

  .version-date {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
  }

  /* Contributors */
  .contributors-section {
    padding: 16px 24px;
    border-top: 1px solid var(--border-primary);
  }

  .section-title {
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--text-primary);
  }

  .contributor-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .contributor {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
  }

  .contributor-avatar {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-primary);
  }

  .contributor-name {
    font-size: 10px;
    font-family: var(--font-mono);
    font-weight: 700;
  }

  /* Comments */
  .comments-section {
    padding: 16px 24px 24px;
    border-top: 1px solid var(--border-primary);
  }

  .comment-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .comment-avatar {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-primary);
    flex-shrink: 0;
    background: var(--bg-tertiary);
  }

  .comment-input {
    flex: 1;
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-primary);
  }

  .comment-submit {
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    background: var(--accent-primary);
    color: var(--bg-primary);
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 700;
    transition: all var(--transition-fast);
  }

  .comment-submit:hover:not(:disabled) {
    background: var(--accent-primary-hover);
  }

  .comment-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .comment-item {
    display: flex;
    gap: 10px;
  }

  .comment-body {
    flex: 1;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .comment-author {
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 700;
  }

  .comment-time {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
  }

  .comment-text {
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .comment-actions {
    display: flex;
    gap: 12px;
    margin-top: 6px;
  }

  .comment-action-btn {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    font-weight: 700;
    transition: color var(--transition-fast);
  }

  .comment-action-btn:hover {
    color: var(--text-primary);
  }

  .replies {
    margin-top: 12px;
    padding-left: 8px;
    border-left: 2px solid var(--border-primary);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (max-width: 768px) {
    .modal-overlay {
      padding: 0;
      align-items: flex-end;
    }

    .modal-container {
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      max-height: 92vh;
      overflow-y: auto;
    }
  }
</style>
