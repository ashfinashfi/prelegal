'use client';

import { useState, useEffect, useCallback } from 'react';
import { SavedDocument } from '@/types/auth';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES } from '@/types/documents';

interface DocumentsModalProps {
  onClose: () => void;
  onLoadDocument: (documentType: DocumentType, formData: DocumentFormData) => void;
}

export function DocumentsModal({ onClose, onLoadDocument }: DocumentsModalProps) {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents', { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to load documents');
      }
      const data = await res.json();
      setDocuments(data.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load saved archives');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you wish to delete this preserved agreement?')) {
      return;
    }

    setDeleting(id);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to delete document');
      }
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const handleLoad = (doc: SavedDocument) => {
    const docType = doc.document_type as DocumentType;
    onLoadDocument(docType, doc.form_data as unknown as DocumentFormData);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (DOCUMENT_NAMES[doc.document_type as DocumentType] || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-[#1c1b18]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" role="presentation">
      <div
        className="bg-[#fdfbf7] rounded-2xl max-w-3xl w-full shadow-2xl border border-[#e4ded3] max-h-[85vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="documents-modal-title"
      >
        {/* Header */}
        <div className="px-7 py-6 border-b border-[#e4ded3] flex items-center justify-between bg-[#f9f6f0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="hanko-seal">書庫</span>
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#78736a]">Personal Repository</span>
            </div>
            <h2 id="documents-modal-title" className="font-serif text-2xl font-bold text-[#1c1b18]">Preserved Agreements</h2>
            <p className="text-xs text-[#78736a] mt-0.5">
              Review, resume crafting, or download your archived contracts
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#78736a] hover:text-[#1c1b18] p-2 rounded-xl hover:bg-[#f4f0e8] transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#e4ded3] bg-[#f5f2eb]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search preserved contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-[#e4ded3] focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#fdfbf7] text-[#1c1b18]"
            />
            <span className="absolute left-3 top-2.5 text-[#968f83] text-xs">🔍</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f9f6f0]/40">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-[#c85a38]/30 border-t-[#c85a38] animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-[#fbf0ec] border border-[#c85a38]/30 text-[#c85a38] px-4 py-3 rounded-xl text-xs font-serif">
              {error}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-16 text-[#968f83]">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#f4f0e8] text-[#78736a] flex items-center justify-center font-serif text-2xl">
                無
              </div>
              <p className="font-serif text-base font-medium text-[#36332e]">No preserved agreements found</p>
              <p className="text-xs text-[#78736a] mt-1 font-serif">
                {documents.length === 0
                  ? 'Complete and save an agreement to archive it here.'
                  : 'No contracts match your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-[#fdfbf7] rounded-xl border border-[#e4ded3] hover:border-[#c85a38]/40 hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-serif text-sm font-bold text-[#1c1b18] truncate">{doc.title}</h3>
                    <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-serif bg-[#f4f0e8] text-[#78736a] border border-[#e4ded3]">
                        {DOCUMENT_NAMES[doc.document_type as DocumentType] || doc.document_type}
                      </span>
                      <span className="text-[11px] font-serif text-[#968f83]">
                        Archived {formatDate(doc.updated_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLoad(doc)}
                      className="px-3.5 py-1.5 text-xs font-serif font-medium text-[#fdfbf7] bg-[#1c1b18] hover:bg-[#36332e] rounded-lg shadow-2xs transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleting === doc.id}
                      className="px-2.5 py-1.5 text-xs font-serif text-[#968f83] hover:text-[#c85a38] rounded-lg transition-colors"
                      title="Delete"
                    >
                      {deleting === doc.id ? '...' : '✕'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#e4ded3] bg-[#f9f6f0] text-xs font-serif text-[#78736a] flex items-center justify-between">
          <span>{documents.length} Preserved Contract{documents.length === 1 ? '' : 's'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#78736a] hover:text-[#1c1b18]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
