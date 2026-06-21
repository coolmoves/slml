<script lang="ts">
  import { app } from '$lib/stores/app.svelte';

  let title = $state('');
  let description = $state('');
  let code = $state('');
  let language = $state('TypeScript');
  let tags = $state('');
  let activeField = $state<string | null>(null);

  const languages = ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Svelte', 'React', 'C++', 'Java', 'Ruby', 'Swift', 'Kotlin'];

  function close() {
    app.createPostOpen = false;
  }

  function publish() {
    if (!title.trim() || !code.trim()) return;
    
    const newProject = {
      id: 'p_' + Date.now(),
      title,
      description,
      readme: description, // Use description directly so they can write README markdown in this box
      code,
      languages: [language],
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      authorId: app.currentUser.id,
      author: {
        id: app.currentUser.id,
        username: app.currentUser.username,
        displayName: app.currentUser.displayName,
        avatar: app.currentUser.avatar,
        isVerified: app.currentUser.isVerified,
        profileStars: app.currentUser.profileStars
      },
      likes: 0,
      comments: [],
      shares: 0,
      views: 1,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      thumbnail: '',
      likedByUser: false,
      bookmarkedByUser: false,
      contributors: [],
      versions: [],
      isPinned: false,
      isDraft: false,
      collection: ''
    };

    app.projects = [newProject, ...app.projects];
    close();
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
  <div class="create-modal animate-scale-in" role="dialog" aria-label="Create new post">
    <header class="create-header">
      <h2 class="create-title">Create New Post</h2>
      <button class="close-btn" onclick={close} aria-label="Close">✕</button>
    </header>

    <div class="create-body">
      <!-- Title -->
      <div class="field" class:focused={activeField === 'title'}>
        <label for="create-title" class="field-label">Post Title</label>
        <input 
          id="create-title"
          type="text" 
          bind:value={title} 
          placeholder="Enter title..." 
          class="field-input"
          onfocus={() => activeField = 'title'}
          onblur={() => activeField = null}
        />
      </div>

      <!-- Language -->
      <div class="field">
        <label for="create-lang" class="field-label">Primary Language</label>
        <select id="create-lang" bind:value={language} class="field-input">
          {#each languages as lang}
            <option value={lang}>{lang}</option>
          {/each}
        </select>
      </div>

      <!-- Description / Readme -->
      <div class="field" class:focused={activeField === 'desc'}>
        <label for="create-desc" class="field-label">Description / Readme (Markdown Supported)</label>
        <textarea 
          id="create-desc"
          bind:value={description}
          placeholder="Write your post content here... Supports standard Markdown features like headers (#), lists (-), bold (**), etc."
          class="field-input field-textarea"
          rows="5"
          onfocus={() => activeField = 'desc'}
          onblur={() => activeField = null}
        ></textarea>
      </div>

      <!-- Code -->
      <div class="field" class:focused={activeField === 'code'}>
        <label for="create-code" class="field-label">Code Block</label>
        <textarea 
          id="create-code"
          bind:value={code}
          placeholder="Paste code snippet here..."
          class="field-input field-textarea code-area"
          rows="8"
          onfocus={() => activeField = 'code'}
          onblur={() => activeField = null}
        ></textarea>
      </div>

      <!-- Tags -->
      <div class="field" class:focused={activeField === 'tags'}>
        <label for="create-tags" class="field-label">Tags (comma separated)</label>
        <input 
          id="create-tags"
          type="text"
          bind:value={tags}
          placeholder="react, hooks, state"
          class="field-input"
          onfocus={() => activeField = 'tags'}
          onblur={() => activeField = null}
        />
      </div>
    </div>

    <footer class="create-footer">
      <button class="button-outline draft-btn" onclick={close}>Cancel</button>
      <button class="button-primary publish-btn" disabled={!title.trim() || !code.trim()} onclick={publish}>
        Publish Post
      </button>
    </footer>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.3);
    z-index: var(--z-modal);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(4px);
  }

  .create-modal {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 640px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  .create-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
  }

  .create-title {
    font-size: 16px;
    font-weight: 600;
  }

  .close-btn {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: color var(--transition-fast);
  }

  .close-btn:hover {
    color: var(--foreground);
    background-color: var(--secondary);
  }

  .create-body {
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--muted-foreground);
  }

  .field.focused .field-label {
    color: var(--foreground);
  }

  .field-input {
    width: 100%;
    background-color: var(--background);
    font-size: 14px;
  }

  .field-input:focus {
    background-color: var(--card);
  }

  .field-textarea {
    resize: vertical;
    line-height: 1.5;
  }

  .code-area {
    font-family: var(--font-mono);
    font-size: 13px;
  }

  .create-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--border);
  }

  .draft-btn {
    padding: 8px 16px;
  }

  .publish-btn {
    padding: 8px 20px;
  }
</style>
