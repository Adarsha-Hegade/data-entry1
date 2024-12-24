import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactQuill from 'react-quill';
import { Timer, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Task } from '../../types';
import debounce from 'lodash/debounce';
import 'react-quill/dist/quill.snow.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function DataEntryForm() {
  const { taskId } = useParams();
  const { profile } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [content, setContent] = useState('');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-save functionality
  const saveContent = useCallback(
    debounce(async (newContent: string) => {
      if (!taskId || !profile) return;

      setSaving(true);
      try {
        const { error } = await supabase.from('submissions').upsert([
          {
            task_id: taskId,
            user_id: profile.id,
            content: newContent,
            status: 'pending'
          }
        ]);

        if (error) throw error;
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving content:', error);
      } finally {
        setSaving(false);
      }
    }, 2000),
    [taskId, profile]
  );

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    saveContent(newContent);
  };

  // Load task and existing submission
  useEffect(() => {
    async function loadData() {
      if (!taskId || !profile) return;

      try {
        // Fetch task
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', taskId)
          .single();

        if (taskError) throw taskError;
        setTask(taskData);

        // Fetch existing submission
        const { data: submissionData, error: submissionError } = await supabase
          .from('submissions')
          .select('*')
          .eq('task_id', taskId)
          .eq('user_id', profile.id)
          .single();

        if (!submissionError && submissionData) {
          setContent(submissionData.content);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [taskId, profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{task.title}</h1>
          <p className="text-sm text-gray-500">{task.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <Timer className="h-5 w-5" />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
          {saving ? (
            <span className="text-sm text-gray-500">Saving...</span>
          ) : lastSaved ? (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer */}
        <div className="w-1/2 bg-gray-100 overflow-y-auto p-4">
          {task.document_url ? (
            <div className="bg-white rounded-lg shadow">
              <Document
                file={task.document_url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                <Page pageNumber={pageNumber} />
              </Document>
              {numPages && (
                <div className="flex items-center justify-between p-4 border-t">
                  <button
                    onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                    disabled={pageNumber <= 1}
                    className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                    disabled={pageNumber >= numPages}
                    className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No document available</p>
            </div>
          )}
        </div>

        {/* Data Entry Form */}
        <div className="w-1/2 bg-white p-4 flex flex-col">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={handleContentChange}
            className="flex-1"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean']
              ]
            }}
          />
        </div>
      </div>
    </div>
  );
}