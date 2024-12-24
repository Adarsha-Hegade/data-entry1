import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Task } from '../../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function TaskEntry() {
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [content, setContent] = useState('');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      if (!taskId) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (!error && data) {
        setTask(data);
      }
      setLoading(false);
    }

    fetchTask();
  }, [taskId]);

  const handleSubmit = async () => {
    if (!task || !content) return;

    setSubmitting(true);
    const { error } = await supabase.from('submissions').insert([
      {
        task_id: task.id,
        content,
        status: 'pending',
      },
    ]);

    if (!error) {
      // Handle successful submission
      setContent('');
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Document Viewer */}
      <div className="w-1/2 p-4 bg-gray-100 overflow-y-auto">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">{task.title}</h2>
          <p className="text-gray-600 mb-4">{task.description}</p>
          
          {task.document_url && (
            <div className="border rounded-lg overflow-hidden">
              <Document
                file={task.document_url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                <Page pageNumber={pageNumber} />
              </Document>
              {numPages && (
                <div className="flex justify-between items-center p-4 border-t">
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
          )}
        </div>
      </div>

      {/* Data Entry Form */}
      <div className="w-1/2 p-4 flex flex-col">
        <div className="flex-grow">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="h-[calc(100%-100px)]"
          />
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting || !content}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}