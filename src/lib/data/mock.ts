import type { User, Project, Notification, Message, Contest, Submission, LeaderboardEntry } from '$lib/types';

const avatars = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Mike',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Dev',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Jake',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Mei',
];

export const mockUsers: User[] = [
  {
    id: 'u1', username: 'alexdev', displayName: 'Alex Chen', avatar: avatars[0],
    bio: 'Full-stack engineer. Building the future with Svelte & Rust. Open source enthusiast.',
    techStack: ['Svelte', 'TypeScript', 'Rust', 'Go', 'PostgreSQL'],
    location: 'San Francisco, CA', website: 'https://alexchen.dev', github: 'alexchen',
    profileStars: 142, friends: 89, totalLikes: 452,
    projectsCount: 67, joinedDate: '2023-03-15', isOnline: true, isVerified: true,
    starredUsers: ['u2','u3','u4'], friendsList: ['u2','u3'], pinnedProjects: ['p1','p3'],
    starredByCurrentUser: false, friendRequestSent: false, isFriend: false
  },
  {
    id: 'u2', username: 'sarahrust', displayName: 'Sarah Miller', avatar: avatars[1],
    bio: 'Rust evangelist & systems programmer. Core contributor @servo. She/Her.',
    techStack: ['Rust', 'C++', 'WebAssembly', 'Linux'],
    location: 'Berlin, Germany', website: 'https://sarahmiller.io', github: 'sarahrust',
    profileStars: 318, friends: 134, totalLikes: 894,
    projectsCount: 112, joinedDate: '2022-08-01', isOnline: true, isVerified: true,
    starredUsers: ['u1','u3'], friendsList: ['u1','u4'], pinnedProjects: ['p2'],
    starredByCurrentUser: true, friendRequestSent: false, isFriend: true
  },
  {
    id: 'u3', username: 'mikeai', displayName: 'Mike Thompson', avatar: avatars[2],
    bio: 'ML Engineer @deepmind. Python lover. Building intelligent systems.',
    techStack: ['Python', 'PyTorch', 'TensorFlow', 'Kubernetes'],
    location: 'London, UK', website: 'https://mikethompson.ai', github: 'mikeai',
    profileStars: 521, friends: 201, totalLikes: 1340,
    projectsCount: 89, joinedDate: '2022-01-10', isOnline: false, isVerified: true,
    starredUsers: ['u1','u2','u4'], friendsList: ['u1','u2'], pinnedProjects: ['p4'],
    starredByCurrentUser: false, friendRequestSent: false, isFriend: true
  },
  {
    id: 'u4', username: 'lunaweb', displayName: 'Luna Park', avatar: avatars[3],
    bio: 'Frontend wizard. Design engineer. CSS art creator. React & Svelte.',
    techStack: ['React', 'Svelte', 'CSS', 'Figma', 'Three.js'],
    location: 'Seoul, South Korea', website: 'https://lunapark.design', github: 'lunaweb',
    profileStars: 247, friends: 156, totalLikes: 678,
    projectsCount: 145, joinedDate: '2022-06-20', isOnline: true, isVerified: false,
    starredUsers: ['u1','u2','u3'], friendsList: ['u2','u3'], pinnedProjects: [],
    starredByCurrentUser: true, friendRequestSent: false, isFriend: false
  },
  {
    id: 'u5', username: 'priyacode', displayName: 'Priya Sharma', avatar: avatars[5],
    bio: 'Backend architect. Go & Distributed Systems. Building scalable infra.',
    techStack: ['Go', 'Kubernetes', 'gRPC', 'Redis', 'Terraform'],
    location: 'Bangalore, India', website: 'https://priyasharma.dev', github: 'priyacode',
    profileStars: 98, friends: 67, totalLikes: 231,
    projectsCount: 54, joinedDate: '2023-09-05', isOnline: true, isVerified: false,
    starredUsers: ['u1','u3'], friendsList: ['u1'], pinnedProjects: [],
    starredByCurrentUser: false, friendRequestSent: true, isFriend: false
  }
];

const codeSnippets = {
  svelte: `<script lang="ts">
  import { onMount } from 'svelte';
  
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  function increment() {
    count++;
  }
</script>

<button onclick={increment}>
  Count: {count} (doubled: {doubled})
</button>

<style>
  button {
    background: linear-gradient(135deg, #1f2937, #111827);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
  }
</style>`,
  rust: `use std::collections::HashMap;
use tokio::sync::RwLock;
use std::sync::Arc;

#[derive(Clone)]
pub struct Cache<T: Clone> {
    store: Arc<RwLock<HashMap<String, CacheEntry<T>>>>,
    ttl: std::time::Duration,
}

impl<T: Clone + Send + Sync + 'static> Cache<T> {
    pub fn new(ttl_secs: u64) -> Self {
        Self {
            store: Arc::new(RwLock::new(HashMap::new())),
            ttl: std::time::Duration::from_secs(ttl_secs),
        }
    }

    pub async fn get(&self, key: &str) -> Option<T> {
        let store = self.store.read().await;
        store.get(key).and_then(|entry| {
            if entry.is_valid() { Some(entry.value.clone()) }
            else { None }
        })
    }

    pub async fn set(&self, key: String, value: T) {
        let mut store = self.store.write().await;
        store.insert(key, CacheEntry::new(value, self.ttl));
    }
}`,
  python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
  typescript: `export class BinarySearch {
  static search(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === target) return mid;
      if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
}`,
  go: `package main

import (
    "fmt"
)

// GCD computes Greatest Common Divisor
func GCD(a, b int) int {
    for b != 0 {
        t := b
        b = a % b
        a = t
    }
    return a
}`
};

function makeUser(u: User): { id: string; username: string; displayName: string; avatar: string; isVerified: boolean; profileStars: number } {
  return { id: u.id, username: u.username, displayName: u.displayName, avatar: u.avatar, isVerified: u.isVerified, profileStars: u.profileStars };
}

export const mockProjects: Project[] = [
  {
    id: 'p1', title: 'SvelteKit State Store', description: 'A lightweight reactive state management pattern built with Svelte 5 runes. Zero dependencies, type-safe state sharing.',
    readme: '# SvelteKit State Store\n\nA modern state management solution leveraging Svelte 5 runes for maximum performance.\n\n## Features\n- Zero-dependency\n- Light and clean footprint\n- Reactive by default\n\n## Usage\n```svelte\nimport { app } from "$lib/stores/app.svelte";\n```',
    code: codeSnippets.svelte, languages: ['Svelte', 'TypeScript'], tags: ['state', 'runes', 'reactive', 'svelte5'],
    authorId: 'u1', author: makeUser(mockUsers[0]),
    likes: 234, comments: [
      { id: 'c1', userId: 'u2', user: makeUser(mockUsers[1]), content: 'This is exactly what I needed! The runes API is so clean.', createdAt: '2h ago', likes: 45, likedByUser: false, replies: [
        { id: 'c1r1', userId: 'u1', user: makeUser(mockUsers[0]), content: 'Thanks Sarah! Glad you find it useful.', createdAt: '1h ago', likes: 12, likedByUser: false, replies: [] }
      ]},
      { id: 'c2', userId: 'u4', user: makeUser(mockUsers[3]), content: 'Beautiful design. Would love to see dynamic state keys.', createdAt: '4h ago', likes: 23, likedByUser: true, replies: [] },
    ],
    shares: 56, views: 1520, createdAt: '2h ago', updatedAt: '1h ago',
    thumbnail: '', likedByUser: false, bookmarkedByUser: true,
    contributors: [makeUser(mockUsers[0]), makeUser(mockUsers[1])],
    versions: [{ id: 'v1', version: '1.0.0', message: 'Initial release', createdAt: '2h ago' }],
    isPinned: true, isDraft: false, collection: 'Svelte Ecosystem'
  },
  {
    id: 'p2', title: 'Async Cache Engine', description: 'High-performance async caching layer for Rust with TTL, LRU eviction, and simple mutex synchronization.',
    readme: '# Async Cache Engine\n\nA production-grade caching solution for async Rust applications.\n\n## Features\n- Thread-safe with `tokio::sync::RwLock`\n- Configurable TTL',
    code: codeSnippets.rust, languages: ['Rust'], tags: ['cache', 'async', 'tokio', 'performance'],
    authorId: 'u2', author: makeUser(mockUsers[1]),
    likes: 567, comments: [
      { id: 'c4', userId: 'u3', user: makeUser(mockUsers[2]), content: 'The concurrent read pattern here is brilliant.', createdAt: '5h ago', likes: 89, likedByUser: true, replies: [] }
    ],
    shares: 89, views: 3450, createdAt: '5h ago', updatedAt: '3h ago',
    thumbnail: '', likedByUser: true, bookmarkedByUser: false,
    contributors: [makeUser(mockUsers[1]), makeUser(mockUsers[0])],
    versions: [{ id: 'v3', version: '1.0.0', message: 'Initial version', createdAt: '5h ago' }],
    isPinned: false, isDraft: false, collection: 'Rust Tools'
  },
  {
    id: 'p3', title: 'Minimal Bubble Sort', description: 'Classic bubble sort algorithm implemented in Python. Optimized with a swapped flag for early termination.',
    readme: '# Bubble Sort Optimization\n\nStandard implementation with O(N) best case time complexity when array is already sorted.',
    code: codeSnippets.python, languages: ['Python'], tags: ['algorithm', 'sorting', 'education'],
    authorId: 'u3', author: makeUser(mockUsers[2]),
    likes: 192, comments: [
      { id: 'c5', userId: 'u1', user: makeUser(mockUsers[0]), content: 'Clean and simple implementation!', createdAt: '1d ago', likes: 15, likedByUser: false, replies: [] }
    ],
    shares: 24, views: 890, createdAt: '1d ago', updatedAt: '8h ago',
    thumbnail: '', likedByUser: false, bookmarkedByUser: false,
    contributors: [makeUser(mockUsers[2])],
    versions: [{ id: 'v4', version: '0.1.0', message: 'Initial commit', createdAt: '1d ago' }],
    isPinned: false, isDraft: false, collection: 'Algorithms'
  },
  {
    id: 'p4', title: 'Iterative Binary Search', description: 'A clean and bug-free implementation of binary search in TypeScript using iterative pointers.',
    readme: '# Binary Search\n\nClassical O(log N) search algorithm.',
    code: codeSnippets.typescript, languages: ['TypeScript'], tags: ['algorithm', 'search', 'binary-search'],
    authorId: 'u1', author: makeUser(mockUsers[0]),
    likes: 345, comments: [], shares: 67, views: 2100,
    createdAt: '3h ago', updatedAt: '2h ago', thumbnail: '',
    likedByUser: false, bookmarkedByUser: false,
    contributors: [makeUser(mockUsers[0])],
    versions: [{ id: 'v5', version: '1.0.0', message: 'Initial release', createdAt: '3h ago' }],
    isPinned: true, isDraft: false, collection: 'TypeScript Utils'
  },
  {
    id: 'p5', title: 'Go Euclidean GCD', description: 'An elegant iterative Euclidean algorithm to calculate the Greatest Common Divisor of two integers.',
    readme: '# Euclidean GCD\n\nMathematical algorithm to find GCD.',
    code: codeSnippets.go, languages: ['Go'], tags: ['algorithm', 'math', 'gcd'],
    authorId: 'u5', author: makeUser(mockUsers[4]),
    likes: 189, comments: [
      { id: 'c7', userId: 'u1', user: makeUser(mockUsers[0]), content: 'Classic algorithm, very clean in Go.', createdAt: '8h ago', likes: 34, likedByUser: false, replies: [] }
    ],
    shares: 34, views: 1280, createdAt: '8h ago', updatedAt: '6h ago',
    thumbnail: '', likedByUser: false, bookmarkedByUser: true,
    contributors: [makeUser(mockUsers[4])],
    versions: [{ id: 'v6', version: '1.0.0', message: 'Initial release', createdAt: '8h ago' }],
    isPinned: false, isDraft: false, collection: 'Go Math'
  }
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'like', message: 'liked your project "SvelteKit State Store"', fromUser: makeUser(mockUsers[1]), projectId: 'p1', projectTitle: 'SvelteKit State Store', createdAt: '2m ago', read: false },
  { id: 'n2', type: 'star', message: 'starred your profile', fromUser: makeUser(mockUsers[2]), createdAt: '15m ago', read: false },
  { id: 'n3', type: 'star', message: 'starred your profile', fromUser: makeUser(mockUsers[3]), createdAt: '1h ago', read: false },
  { id: 'n4', type: 'comment', message: 'commented on "SvelteKit State Store"', fromUser: makeUser(mockUsers[3]), projectId: 'p1', projectTitle: 'SvelteKit State Store', createdAt: '2h ago', read: true },
  { id: 'n5', type: 'friend_request', message: 'sent you a friend request', fromUser: makeUser(mockUsers[4]), createdAt: '3h ago', read: false },
];

export const mockMessages: Message[] = [
  { id: 'm1', fromUser: makeUser(mockUsers[1]), lastMessage: 'Hey! Want to collaborate on algorithms?', createdAt: '5m ago', read: false, messages: [
    { id: 'msg1', senderId: 'u2', content: 'Hey Alex! Love your state store.', createdAt: '10m ago', isCode: false },
    { id: 'msg2', senderId: 'u1', content: 'Thanks Sarah! Your cache engine is impressive too.', createdAt: '8m ago', isCode: false },
    { id: 'msg3', senderId: 'u2', content: 'Hey! Want to collaborate on algorithms?', createdAt: '5m ago', isCode: false },
  ]},
  { id: 'm2', fromUser: makeUser(mockUsers[2]), lastMessage: 'The sorting code is uploaded', createdAt: '1h ago', read: true, messages: [
    { id: 'msg4', senderId: 'u3', content: 'The sorting code is uploaded', createdAt: '1h ago', isCode: false },
  ]},
];

// ── Mock Contests Data ─────────────────────────────────────────

export const mockContests: Contest[] = [
  {
    id: 'c1',
    title: 'slml Algorithmic Challenge #01',
    description: 'A structural, lightweight competition focusing on memory efficiency and bitwise optimization. Admin-evaluated afterwards.',
    startTime: 'LIVE NOW',
    duration: '2 Hours',
    status: 'active',
    problems: [
      {
        id: 'p_c1_a',
        code: 'A',
        title: 'Zero-Alloc In-Place Sort',
        readme: `# Task A: Zero-Alloc In-Place Sort

Given an array of integers, sort the array in ascending order. You must achieve **O(1) auxiliary space complexity**. Standard sorting libraries are forbidden.

### Input Format
- The first line contains \`N\` (number of elements).
- The second line contains \`N\` space-separated integers.

### Output Format
Print the \`N\` space-separated sorted integers.

### Sample Input
\`\`\`
5
5 3 8 1 2
\`\`\`

### Sample Output
\`\`\`
1 2 3 5 8
\`\`\``,
        points: 100
      },
      {
        id: 'p_c1_b',
        code: 'B',
        title: 'Lightweight Run-Length Encoder',
        readme: `# Task B: Lightweight Run-Length Encoder

Compress a string of uppercase letters by replacing consecutive repeating characters with the character followed by the count. If the compressed string is not shorter than the original, output the original string.

### Input Format
A single string \`S\` containing only uppercase alphabetical characters.

### Output Format
The compressed string or original string.

### Sample Input
\`\`\`
AAAABBBCC
\`\`\`

### Sample Output
\`\`\`
A4B3C2
\`\`\``,
        points: 250
      },
      {
        id: 'p_c1_c',
        code: 'C',
        title: 'Bitwise Modular Exponentiation',
        readme: `# Task C: Bitwise Modular Exponentiation

Calculate \`(Base^Exp) % Mod\` extremely fast using bitwise exponentiation. You must handle values up to \`2^63 - 1\` and avoid overflow during multiplication.

### Input Format
Three space-separated integers representing \`Base\`, \`Exp\`, and \`Mod\`.

### Output Format
A single integer representing the result.

### Sample Input
\`\`\`
2 10 1000
\`\`\`

### Sample Output
\`\`\`
24
\`\`\``,
        points: 500
      }
    ]
  },
  {
    id: 'c2',
    title: 'slml Micro-Optimizations #02',
    description: 'Solve challenges using minimal assembly-like constraints in C and Rust.',
    startTime: 'Starts in 2 days',
    duration: '3 Hours',
    status: 'upcoming',
    problems: [
      {
        id: 'p_c2_a',
        code: 'A',
        title: 'Popcount Fast Path',
        readme: `# Task A: Popcount Fast Path

Write a high-speed function to calculate the number of set bits in a 64-bit integer.

### Input Format
A single 64-bit integer.

### Output Format
An integer representing the set bit count.

### Sample Input
\`\`\`
7
\`\`\`

### Sample Output
\`\`\`
3
\`\`\``,
        points: 100
      }
    ]
  },
  {
    id: 'c3',
    title: 'slml Launch Contest #00',
    description: 'The inaugural contest of the slml hub.',
    startTime: 'Ended 3 days ago',
    duration: '1.5 Hours',
    status: 'ended',
    problems: [
      {
        id: 'p_c3_a',
        code: 'A',
        title: 'Reverse Bits',
        readme: `# Task A: Reverse Bits

Reverse bits of a given 32-bit unsigned integer.

### Input Format
A single integer.

### Output Format
The reversed bit integer.

### Sample Input
\`\`\`
43261596
\`\`\`

### Sample Output
\`\`\`
964176192
\`\`\``,
        points: 100
      }
    ]
  }
];

// Initial mock submissions
export const mockSubmissions: Submission[] = [
  {
    id: 's1',
    contestId: 'c1',
    problemId: 'p_c1_a',
    problemCode: 'A',
    problemTitle: 'Zero-Alloc In-Place Sort',
    userId: 'u2',
    username: 'sarahrust',
    displayName: 'Sarah Miller',
    language: 'Rust',
    code: `pub fn sort_array(nums: &mut Vec<i32>) {
    let n = nums.len();
    for i in 0..n {
        let mut min_idx = i;
        for j in (i+1)..n {
            if nums[j] < nums[min_idx] {
                min_idx = j;
            }
        }
        nums.swap(i, min_idx);
    }
}`,
    submittedAt: '10m ago',
    status: 'PENDING EVALUATION'
  },
  {
    id: 's2',
    contestId: 'c1',
    problemId: 'p_c1_b',
    problemCode: 'B',
    problemTitle: 'Lightweight Run-Length Encoder',
    userId: 'u3',
    username: 'mikeai',
    displayName: 'Mike Thompson',
    language: 'Python',
    code: `def compress(s: str) -> str:
    res = []
    i = 0
    while i < len(s):
        count = 1
        while i + 1 < len(s) and s[i] == s[i+1]:
            i += 1
            count += 1
        res.append(s[i] + str(count))
        i += 1
    out = "".join(res)
    return out if len(out) < len(s) else s`,
    submittedAt: '25m ago',
    status: 'PENDING EVALUATION'
  }
];

// Initial mock leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: 'u2',
    username: 'sarahrust',
    displayName: 'Sarah Miller',
    solvedCount: 2,
    totalPoints: 350,
    submissionsCount: 2
  },
  {
    userId: 'u3',
    username: 'mikeai',
    displayName: 'Mike Thompson',
    solvedCount: 1,
    totalPoints: 250,
    submissionsCount: 1
  },
  {
    userId: 'u4',
    username: 'lunaweb',
    displayName: 'Luna Park',
    solvedCount: 1,
    totalPoints: 100,
    submissionsCount: 2
  }
];
