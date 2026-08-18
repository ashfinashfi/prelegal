'use client';

import { useState, useEffect } from 'react';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES } from '@/types/documents';

interface SaveDocumentButtonProps {
  documentType: DocumentType;
  formData: DocumentFormData;
  onSaved?: () => void;
}

export function SaveDocumentButton({ documentType, formData, onSaved }: SaveDocumentButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  const handleOpenModal = () => {
    const defaultTitle = `${DOCUMENT_NAMES[documentType]} - ${new Date().toLocaleDateString()}`;
    setTitle(defaultTitle);
    setError('');
    setSuccess(false);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          document_type: documentType,
          title: title.trim(),
          form_data: formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to save document');
      }

      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        onSaved?.();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-3.5 py-2 bg-[#1c1b18] hover:bg-[#36332e] text-[#fdfbf7] text-xs font-serif font-medium rounded-xl shadow-xs transition-all flex items-center gap-1.5"
      >
        <span>保</span>
        <span>Save to Repository</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-[#1c1b18]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#fdfbf7] rounded-2xl p-7 max-w-md w-full shadow-2xl border border-[#e4ded3]">
            <div className="flex justify-between items-center mb-5">
              <div>
                <span className="hanko-seal text-[10px] mb-1">保存</span>
                <h2 className="font-serif text-lg font-bold text-[#1c1b18]">Archive Contract</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#78736a] hover:text-[#1c1b18] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-[#eff5f1] rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#31533d] font-serif text-xl border border-[#31533d]/20">
                  印
                </div>
                <p className="font-serif text-base font-bold text-[#1c1b18]">Preserved to Repository</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif text-[#78736a] mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs border border-[#e4ded3] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
                    placeholder="Enter document title"
                  />
                </div>

                <div className="p-3.5 bg-[#f9f6f0] rounded-xl text-xs text-[#78736a] border border-[#e4ded3]">
                  <p>
                    <span className="font-serif font-semibold text-[#1c1b18]">Classification:</span>{' '}
                    {DOCUMENT_NAMES[documentType]}
                  </p>
                </div>

                {error && (
                  <div className="bg-[#fbf0ec] border border-[#c85a38]/30 text-[#c85a38] px-3.5 py-2.5 rounded-xl text-xs font-serif">
                    {error}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-[#e4ded3] text-[#78736a] rounded-xl text-xs font-serif hover:bg-[#f4f0e8] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !title.trim()}
                    className="flex-1 px-4 py-2 bg-[#c85a38] hover:bg-[#b54f30] text-[#fdfbf7] rounded-xl text-xs font-serif font-medium transition-all disabled:opacity-50"
                  >
                    {saving ? 'Preserving...' : 'Save Document'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
