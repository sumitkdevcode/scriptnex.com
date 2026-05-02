export interface Certification {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  passing_score: number;
  total_questions: number;
  badge_image_url: string | null;
  is_published: boolean;
  is_premium: boolean;
  category: { id: number; name: string; slug: string } | null;
}

export interface CertificationQuestion {
  id: number;
  type: 'coding' | 'mcq' | 'fill_blank';
  question_text: string;
  options: string[] | null;
  points: number;
  sort_order: number;
  problem_id: number | null;
}

export interface CertificationAttempt {
  id: number;
  user_id: number;
  certification_id: number;
  status: 'in_progress' | 'passed' | 'failed';
  score: number;
  total_possible: number;
  started_at: string;
  completed_at: string | null;
  answers: Record<string, string>;
  certificate_url: string | null;
}

export interface UserCertificate {
  id: number;
  uuid: string;
  user_id: number;
  certification_id: number;
  certification_title: string;
  issued_at: string;
  expires_at: string | null;
  pdf_url: string | null;
  verification_url: string;
}
