export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  document_url?: string;
  status: 'active' | 'completed' | 'archived';
  assigned_to: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  score?: number;
  status: 'pending' | 'reviewed';
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}