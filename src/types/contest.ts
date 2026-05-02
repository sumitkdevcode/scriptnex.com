export interface Contest {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  description: string;
  type: 'rated' | 'unrated' | 'hiring';
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_published: boolean;
  registration_required: boolean;
  max_participants: number | null;
  scoring_type: 'icpc' | 'ioi' | 'custom';
  rules: string | null;
  prizes: Record<string, unknown> | null;
  status: 'upcoming' | 'active' | 'ended';
  registration_count: number;
  problems_count: number;
  created_at: string;
}

export interface ContestProblem {
  id: number;
  problem_id: number;
  title: string;
  slug: string;
  difficulty: string;
  points: number;
  sort_order: number;
  solved_count: number;
}

export interface ContestLeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  name: string;
  avatar: string | null;
  total_score: number;
  total_penalty: number;
  problems_solved: number;
}

export interface ContestRegistration {
  contest_id: number;
  user_id: number;
  registered_at: string;
}
