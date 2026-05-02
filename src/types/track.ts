export interface Track {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  difficulty: string;
  estimated_hours: number;
  is_published: boolean;
  is_premium: boolean;
  modules_count: number;
  lessons_count: number;
}

export interface TrackModule {
  id: number;
  track_id: number;
  title: string;
  sort_order: number;
  lessons: TrackLesson[];
}

export interface TrackLesson {
  id: number;
  module_id: number;
  title: string;
  slug: string;
  type: 'article' | 'video' | 'problem';
  content: string | null;
  video_url: string | null;
  problem_id: number | null;
  duration_minutes: number;
  sort_order: number;
}

export interface UserTrackProgress {
  track_id: number;
  completed_lessons: number[];
  progress_percent: number;
  started_at: string;
  completed_at: string | null;
}
