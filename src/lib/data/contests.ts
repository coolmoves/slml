import type { Contest } from '$lib/types';
const problemFiles = import.meta.glob('/src/lib/content/problems/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

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
const data: Contest[] = [
  {
    id: 'c1',
    title: 'Contest c1',
    description: 'A simple testing version.',
    startTime: 'live now',
    duration: 'Not Specified',
    status: 'active',
    problems: parsedProblems.filter(p => p.contestId === 'c1').sort((a, b) => a.code.localeCompare(b.code))
  }
]

export default data;
