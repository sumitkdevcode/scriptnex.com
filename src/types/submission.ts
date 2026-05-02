export type SubmissionStatus =
  | 'queued'
  | 'running'
  | 'accepted'
  | 'wrong_answer'
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded'
  | 'runtime_error'
  | 'compilation_error';

export interface TestResult {
  test_id: number;
  passed: boolean;
  runtime_ms: number;
  memory_kb: number;
  output: string | null;
}

export interface Submission {
  id: number;
  uuid: string;
  user_id: number;
  problem_id: number;
  language_id: number;
  language_name: string;
  status: SubmissionStatus;
  score: number;
  runtime_ms: number | null;
  memory_kb: number | null;
  test_results: TestResult[];
  submitted_at: string;
  judged_at: string | null;
  problem?: {
    title: string;
    slug: string;
    difficulty: string;
  };
}
