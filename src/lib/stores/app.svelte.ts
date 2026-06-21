import type { User, Project, Contest, LeaderboardEntry } from '$lib/types';

const blogFiles = import.meta.glob('/src/lib/content/blogs/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const problemFiles = import.meta.glob('/src/lib/content/problems/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

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
  const languages = meta.languages ? meta.languages.split(',').map(l => l.trim()) : ['TypeScript'];
  const tags = meta.tags ? meta.tags.split(',').map(t => t.trim()) : [];

  return {
    id,
    title,
    description: meta.description || '',
    readme,
    code: `// Local markdown blog post: ${title}\n// Location: ${path.replace(/^\/src\//, '')}`,
    languages,
    tags,
    authorId: 'admin',
    author: {
      id: 'admin',
      username: 'slml_admin',
      displayName: 'slml admin',
      avatar: '',
      isVerified: true
    },
    likes: 0,
    comments: [],
    shares: 0,
    views: 1,
    createdAt: meta.createdAt || 'Just now',
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

// Parse problems from local markdown files
const parsedProblems = Object.entries(problemFiles).map(([path, content]) => {
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
  const id = path.split('/').pop()?.replace('.md', '') || 'prob_' + Date.now();

  return {
    id,
    code: meta.code || 'A',
    title: meta.title || 'Untitled Problem',
    readme,
    points: Number(meta.points) || 100,
    contestId: meta.contestId || 'c1'
  };
});

// Setup contests
const parsedContests: Contest[] = [
  {
    id: 'c1',
    title: 'slml algorithmic challenge #01',
    description: 'A structural, lightweight competition focusing on memory efficiency and bitwise optimization.',
    startTime: 'live now',
    duration: '2 hours',
    status: 'active',
    problems: parsedProblems.filter(p => p.contestId === 'c1').sort((a, b) => a.code.localeCompare(b.code))
  },
  {
    id: 'c2',
    title: 'slml micro-optimizations #02',
    description: 'Solve challenges using minimal assembly-like constraints in C and Rust.',
    startTime: 'starts in 2 days',
    duration: '3 hours',
    status: 'upcoming',
    problems: parsedProblems.filter(p => p.contestId === 'c2').sort((a, b) => a.code.localeCompare(b.code))
  },
  {
    id: 'c3',
    title: 'slml launch contest #00',
    description: 'The inaugural contest of slml.',
    startTime: 'ended 3 days ago',
    duration: '1.5 hours',
    status: 'ended',
    problems: parsedProblems.filter(p => p.contestId === 'c3').sort((a, b) => a.code.localeCompare(b.code))
  }
];

class AppState {
  theme = $state<'dark' | 'light'>('light');
  searchQuery = $state('');

  projects = $state<Project[]>(parsedBlogs);
  contests = $state<Contest[]>(parsedContests);
  leaderboard = $state<LeaderboardEntry[]>([
    { userId: 'u_user1', username: 'tourist', displayName: 'Gennady Korotkevich', solvedCount: 3, totalPoints: 850, submissionsCount: 4 },
    { userId: 'u_user2', username: 'ecnerwala', displayName: 'Neal Wu', solvedCount: 2, totalPoints: 350, submissionsCount: 3 },
    { userId: 'u_user3', username: 'radewoosh', displayName: 'Mateusz Radecki', solvedCount: 1, totalPoints: 100, submissionsCount: 2 }
  ]);

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
