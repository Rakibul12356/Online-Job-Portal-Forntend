import { useEffect, useRef, useState } from 'react';
import { FileText, Send, Trash2, Upload, X } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_COVER_LENGTH = 500;

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApplyJobDialog({ isOpen, job, onClose }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [coverMessage, setCoverMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setResumeFile(null);
      setCoverMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 5MB.');
      return;
    }

    setResumeFile(file);
    event.target.value = '';
  }

  function handleSubmit() {
    if (!resumeFile) {
      alert('Please upload your resume before submitting.');
      return;
    }

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-dialog-title"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 id="apply-dialog-title" className="text-2xl font-semibold">
                Apply for Position
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {job.title} at {job.company}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Complete the form below to submit your application
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Resume <span className="text-red-500">*</span>
            </label>

            {!resumeFile ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-200 p-8 text-center transition-colors hover:border-slate-900"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <Upload className="h-6 w-6 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Click to upload resume</p>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF file only (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <FileText className="h-5 w-5 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{resumeFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(resumeFile.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium transition-colors hover:bg-gray-50"
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Reupload
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="flex h-8 items-center rounded-lg border border-gray-300 px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Remove
                    </button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="coverMessage" className="text-sm font-medium">
              Cover Message{' '}
              <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="coverMessage"
              rows={5}
              value={coverMessage}
              onChange={(e) =>
                setCoverMessage(e.target.value.slice(0, MAX_COVER_LENGTH))
              }
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              placeholder="Write a brief message about why you're a great fit for this role..."
            />
            <p className="text-xs text-gray-500">
              {coverMessage.length}/{MAX_COVER_LENGTH} characters
            </p>
          </div>

          <div className="flex gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <Send className="h-4 w-4" />
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyJobDialog;
