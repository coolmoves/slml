export interface UserPreview {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  readme: string;
  code: string;
  languages: string[];
  tags: string[];
  authorId: string;
  author: UserPreview;
  likes: number;
  comments: any[];
  shares: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  likedByUser: boolean;
  bookmarkedByUser: boolean;
  contributors: UserPreview[];
  versions: any[];
  isPinned: boolean;
  isDraft: boolean;
  collection: string;
}

export interface ContestProblem {
  id: string;
  code: string;
  title: string;
  readme: string;
  points: number;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  duration: string;
  status: 'active' | 'upcoming' | 'ended';
  problems: ContestProblem[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  displayName: string;
  solvedCount: number;
  totalPoints: number;
  submissionsCount: number;
}
