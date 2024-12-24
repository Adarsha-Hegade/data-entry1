import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Submission } from '../../types';
import { getScoreColor } from '../../lib/utils';

export default function Profile() {
  const { profile } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      if (!profile) return;

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSubmissions(data);
      }
      setLoading(false);
    }

    fetchSubmissions();
  }, [profile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const averageScore = submissions
    .filter(s => s.score !== null)
    .reduce((acc, curr) => acc + (curr.score || 0), 0) / submissions.length || 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
            {profile.full_name.charAt(0)}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
            <p className="text-gray-500">{profile.role}</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Submissions</h3>
          <p className="text-3xl font-bold text-indigo-600">{submissions.length}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Score</h3>
          <p className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
            {averageScore.toFixed(1)}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Reviews</h3>
          <p className="text-3xl font-bold text-orange-600">
            {submissions.filter(s => s.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Submission History */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Submission History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {submissions.map((submission) => (
            <div key={submission.id} className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Task #{submission.task_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {submission.status}
                  </span>
                  {submission.score !== null && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(submission.score)}`}>
                      Score: {submission.score}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {submissions.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              No submissions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}