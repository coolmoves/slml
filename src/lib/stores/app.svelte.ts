import type { Project, Contest, LeaderboardEntry } from '$lib/types';
import contestData from "$lib/data/contests";
const blogFiles = import.meta.glob('/src/lib/content/blogs/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

// Parse blog posts from local markdown files
const parsedBlogs: Project[] = Object.entries(blogFiles).map(([path, content]) => {
  const metaMatch = content.match(/<!--([\s\S]*?)-->/);
  const meta: Record<string, string> = {};
  if (metaMatch) {
    metaMatch[1].split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        meta[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    });
  }

  const readme = content.replace(/<!--[\s\S]*?-->/, '').trim();
  const id = path.split('/').pop()?.replace('.md', '') || 'p_' + Date.now();
  const title = meta.title || 'Untitled Post';
  const authorId = meta.authorId || 'Anonymous';
  const languages = meta.languages ? meta.languages.split(',').map(l => l.trim()) : ['Misc','Other'];
  const tags = meta.tags ? meta.tags.split(',').map(t => t.trim()) : [];

  return {
    id,
    title,
    description: meta.description || '',
    readme,
    code: `// Local markdown blog post: ${title}\n// Location: ${path.replace(/^\/src\//, '')}`,
    languages,
    tags,
    authorId: authorId,
    author: {
      id: authorId,
      username: authorId,
      displayName: authorId,
      avatar: '',
      isVerified: true
    },
    likes: 0,
    comments: [],
    shares: 0,
    views: 1,
    createdAt: meta.createdAt || '01/01/2000',
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
});

// Setup contests
const parsedContests: Contest[] = contestData;

class AppState {
  theme = $state<'dark' | 'light'>('light');
  searchQuery = $state('');

  projects = $state<Project[]>(parsedBlogs);
  contests = $state<Contest[]>(parsedContests);

  selectedLanguage = $state<string | null>(null);

  get filteredProjects() {
    let result = this.projects;

    if (this.selectedLanguage) {
      result = result.filter(p => p.languages.includes(this.selectedLanguage!));
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.languages.some(l => l.toLowerCase().includes(q)) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }
}

export const app = new AppState();
