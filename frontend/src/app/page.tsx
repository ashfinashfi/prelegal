'use client';

import { useState, useCallback } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { DocumentPreview } from '@/components/DocumentPreview';
import { DocumentDownload } from '@/components/DocumentDownload';
import { AuthModal } from '@/components/AuthModal';
import { UserMenu } from '@/components/UserMenu';
import { DocumentsModal } from '@/components/DocumentsModal';
import { SaveDocumentButton } from '@/components/SaveDocumentButton';
import { TemplateCatalogModal } from '@/components/TemplateCatalogModal';
import { ExtractionProgress } from '@/components/ExtractionProgress';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES, getDefaultFormData } from '@/types/documents';
import { CatalogItem } from '@/utils/catalogData';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [formData, setFormData] = useState<DocumentFormData>(getDefaultFormData(DocumentType.MUTUAL_NDA));
  const [isComplete, setIsComplete] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);

  const handleDocumentTypeDetected = (type: DocumentType) => {
    setDocumentType(type);
    setFormData((prev) => {
      const defaultData = getDefaultFormData(type);
      return {
        ...defaultData,
        ...prev,
        documentType: type,
        party1: { ...defaultData.party1, ...prev.party1 },
        party2: { ...defaultData.party2, ...prev.party2 },
      } as DocumentFormData;
    });
  };

  const handleFieldsExtracted = (fields: Partial<DocumentFormData>) => {
    setFormData((prev) => {
      const { party1: newParty1, party2: newParty2, ...scalarFields } = fields;

      return {
        ...prev,
        ...scalarFields,
        party1: newParty1 ? mergeParty(prev.party1, newParty1) : prev.party1,
        party2: newParty2 ? mergeParty(prev.party2, newParty2) : prev.party2,
      } as DocumentFormData;
    });
  };

  function mergeParty(existing: DocumentFormData['party1'], updates: Partial<DocumentFormData['party1']>) {
    return {
      name: updates.name !== undefined ? updates.name : existing.name,
      title: updates.title !== undefined ? updates.title : existing.title,
      company: updates.company !== undefined ? updates.company : existing.company,
      noticeAddress: updates.noticeAddress !== undefined ? updates.noticeAddress : existing.noticeAddress,
      date: updates.date !== undefined ? updates.date : existing.date,
    };
  }

  const handleManualFieldChange = (fields: Partial<DocumentFormData>) => {
    handleFieldsExtracted(fields);
  };

  const handleLoadDocument = useCallback((type: DocumentType, data: DocumentFormData) => {
    setDocumentType(type);
    setFormData(data);
    setIsComplete(true);
    setChatKey((k) => k + 1);
    setInitialPrompt(null);
  }, []);

  const handleNewDocument = useCallback(() => {
    setDocumentType(null);
    setFormData(getDefaultFormData(DocumentType.MUTUAL_NDA));
    setIsComplete(false);
    setChatKey((k) => k + 1);
    setInitialPrompt(null);
  }, []);

  const handleSelectTemplate = (item: CatalogItem, prompt?: string) => {
    setShowCatalogModal(false);
    setDocumentType(item.id);
    setFormData(getDefaultFormData(item.id));
    setIsComplete(false);
    setChatKey((k) => k + 1);
    setInitialPrompt(prompt || null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f5f2eb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#c85a38]/30 border-t-[#c85a38] animate-spin"></div>
          <span className="font-serif text-sm text-[#78736a] tracking-widest uppercase">静寂 • Preparing Sanctuary</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f2eb] text-[#1c1b18] selection:bg-[#fbf0ec] selection:text-[#c85a38]">
      {/* Top Sanctuary Navigation */}
      <header className="bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#e4ded3] sticky top-0 z-30">
        <div className="max-w-[1880px] mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1c1b18] text-[#fdfbf7] flex items-center justify-center font-serif text-lg font-bold shadow-sm">
                合
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-semibold tracking-tight text-[#1c1b18]">
                    Prelegal
                  </span>
                  <span className="hanko-seal">
                    合意
                  </span>
                </div>
                <p className="text-[11px] text-[#78736a] font-normal tracking-wide hidden sm:block">
                  Mindful Agreement Atelier
                </p>
              </div>
            </div>

            {documentType && (
              <div className="h-5 w-px bg-[#e4ded3] hidden md:block" />
            )}

            {documentType && (
              <div className="hidden md:flex items-center gap-2 bg-[#f4f0e8] px-3 py-1 rounded-lg border border-[#e4ded3]">
                <span className="text-xs font-serif text-[#36332e] tracking-wide truncate max-w-[240px]">
                  {DOCUMENT_NAMES[documentType]}
                </span>
                <button
                  onClick={() => setShowCatalogModal(true)}
                  className="text-[10px] uppercase font-semibold tracking-wider text-[#c85a38] hover:underline ml-1"
                >
                  Switch
                </button>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setShowCatalogModal(true)}
              className="px-3.5 py-2 text-xs font-medium text-[#36332e] bg-[#fdfbf7] hover:bg-[#f4f0e8] border border-[#e4ded3] rounded-xl transition-all flex items-center gap-2 shadow-xs hover:border-[#c85a38]/40"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c85a38]"></span>
              <span>11 Contract Archives</span>
            </button>

            {documentType && (
              <button
                onClick={handleNewDocument}
                className="px-3 py-2 text-xs font-medium text-[#78736a] hover:text-[#1c1b18] hover:bg-[#f4f0e8] rounded-xl transition-colors hidden sm:block"
              >
                + Reset Draft
              </button>
            )}

            {documentType && (
              <div className="flex items-center gap-2">
                {user && <SaveDocumentButton documentType={documentType} formData={formData} />}
                <DocumentDownload documentType={documentType} formData={formData} />
              </div>
            )}

            {user ? (
              <UserMenu user={user} onOpenDocuments={() => setShowDocumentsModal(true)} />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-[#1c1b18] hover:bg-[#36332e] text-[#fdfbf7] text-xs font-medium rounded-xl transition-all shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Sanctuary Studio */}
      <main className="flex-1 max-w-[1880px] w-full mx-auto p-4 sm:p-6 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Left Studio: AI Conversational Scribe (5 cols) */}
          <div className="lg:col-span-5 flex flex-col atelier-panel overflow-hidden h-[calc(100vh-140px)] min-h-[580px] shadow-xs">
            {/* Atelier Scribe Header */}
            <div className="bg-[#f9f6f0] border-b border-[#e4ded3] px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#31533d]"></span>
                <div>
                  <h2 className="font-serif text-sm font-semibold tracking-wide text-[#1c1b18]">
                    The Conversational Scribe
                  </h2>
                  <p className="text-[10px] text-[#78736a]">Quiet legal guidance powered by AI</p>
                </div>
              </div>

              <button
                onClick={handleNewDocument}
                className="text-[11px] text-[#78736a] hover:text-[#c85a38] px-2 py-1 rounded hover:bg-[#ece6dc] transition-colors"
                title="Restart conversation"
              >
                Clear
              </button>
            </div>

            {/* Sand Garden Extraction Checklist */}
            <ExtractionProgress
              documentType={documentType}
              formData={formData}
              isComplete={isComplete}
            />

            {/* Chat Messages */}
            <div className="flex-1 min-h-0 bg-[#fcfbf9]">
              <ChatInterface
                key={chatKey}
                formData={formData}
                onDocumentTypeDetected={handleDocumentTypeDetected}
                onFieldsExtracted={handleFieldsExtracted}
                onComplete={() => setIsComplete(true)}
                initialPrompt={initialPrompt}
              />
            </div>
          </div>

          {/* Right Studio: Living Agreement Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col atelier-panel overflow-hidden h-[calc(100vh-140px)] min-h-[580px] shadow-xs">
            {/* Living Canvas Header */}
            <div className="bg-[#f9f6f0] border-b border-[#e4ded3] px-6 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="font-serif text-sm font-semibold tracking-wide text-[#1c1b18]">
                    Agreement Canvas
                  </h2>
                  <p className="text-[10px] text-[#78736a]">
                    {documentType ? DOCUMENT_NAMES[documentType] : 'Select an agreement to begin'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isComplete && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-serif font-medium text-[#31533d] bg-[#eff5f1] px-3 py-1 rounded-full border border-[#31533d]/20">
                    <span>印</span> Ready to Seal & Sign
                  </span>
                )}
              </div>
            </div>

            {/* Canvas Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f5f2eb]/60">
              <DocumentPreview
                documentType={documentType}
                formData={formData}
                onFieldsChange={handleManualFieldChange}
                onOpenCatalog={() => setShowCatalogModal(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mindful Footer */}
      <footer className="border-t border-[#e4ded3] bg-[#fdfbf7] py-3.5 text-xs text-[#78736a]">
        <div className="max-w-[1880px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-serif">
          <span>Prelegal • Built with quiet intentionality & wabi-sabi clarity</span>
          <span>
            Common Paper Standard Terms • Open Source (CC BY 4.0)
          </span>
        </div>
      </footer>

      {/* Modals */}
      {showCatalogModal && (
        <TemplateCatalogModal
          onClose={() => setShowCatalogModal(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showDocumentsModal && (
        <DocumentsModal
          onClose={() => setShowDocumentsModal(false)}
          onLoadDocument={handleLoadDocument}
        />
      )}
    </div>
  );
}
