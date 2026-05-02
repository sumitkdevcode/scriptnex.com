export interface Problem {
  id: number;
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
  solve_count: number;
  attempt_count: number;
  success_rate: number;
  is_premium: boolean;
}

export interface ProblemDetail extends Problem {
  uuid: string;
  description: string;
  input_format: string | null;
  output_format: string | null;
  constraints: string | null;
  time_limit_ms: number;
  memory_limit_kb: number;
  sample_input: string | null;
  sample_output: string | null;
  explanation: string | null;
  editorial: string | null;
}

export interface SampleCase {
  id: number;
  input: string;
  expected_output: string;
  sort_order: number;
}

export interface SupportedLanguage {
  id: number;
  name: string;
  version: string;
  judge0_id: number;
  monaco_id: string;
  file_extension: string;
  boilerplate_code: string;
}

export interface Submission {
  id: number;
  uuid: string;
  problem: { id: number; title: string; slug: string; difficulty?: string } | null;
  language: { id: number; name: string } | null;
  status: string;
  score: number;
  runtime_ms: number | null;
  memory_kb: number | null;
  test_results: TestResult[] | null;
  submitted_at: string;
  judged_at: string | null;
}

export interface TestResult {
  test_id: number;
  passed: boolean | null;
  runtime_ms: number | null;
  memory_kb: number | null;
  status: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  problem_count: number;
}
