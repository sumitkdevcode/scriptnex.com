export interface Discussion {
  id: number;
  user_id: number;
  problem_id: number | null;
  title: string;
  body: string;
  type: 'question' | 'editorial' | 'general';
  upvotes: number;
  downvotes: number;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
  problem?: {
    title: string;
    slug: string;
  } | null;
}

export interface DiscussionReply {
  id: number;
  discussion_id: number;
  user_id: number;
  parent_id: number | null;
  body: string;
  upvotes: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
  replies?: DiscussionReply[];
}
