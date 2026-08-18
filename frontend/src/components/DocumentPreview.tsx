'use client';

import { useState } from 'react';
import {
  DocumentType,
  DocumentFormData,
  DOCUMENT_NAMES,
  MutualNDAData,
  PilotData,
  CloudServiceData,
} from '@/types/documents';
import { NDAPreview } from './NDAPreview';
import { PilotPreview } from './PilotPreview';
import { CloudServicePreview } from './CloudServicePreview';
import { GenericPreview } from './GenericPreview';
import { FieldsEditor } from './FieldsEditor';
import { MarkdownView } from './MarkdownView';

interface DocumentPreviewProps {
  documentType: DocumentType | null;
  formData: DocumentFormData;
  onFieldsChange?: (fields: Partial<DocumentFormData>) => void;
  onOpenCatalog?: () => void;
}

export function DocumentPreview({
  documentType,
  formData,
  onFieldsChange,
  onOpenCatalog,
}: DocumentPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'editor' | 'markdown'>('preview');

  if (!documentType) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[420px] p-8 text-center bg-[#fdfbf7] rounded-2xl border border-dashed border-[#d8d0c2]">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-[#f4f0e8] text-[#c85a38] flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
          印
        </div>
        <h3 className="font-serif text-lg font-semibold text-[#1c1b18] mb-1.5">No Agreement Selected</h3>
        <p className="text-xs text-[#78736a] max-w-sm mb-6 leading-relaxed">
          Conversational AI is ready to draft any contract on the left. Or explore our archive of 11 standard CommonPaper agreements.
        </p>
        {onOpenCatalog && (
          <button
            onClick={onOpenCatalog}
            className="px-5 py-2.5 bg-[#1c1b18] hover:bg-[#36332e] text-[#fdfbf7] text-xs font-medium rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <span>Explore 11 Contract Archives</span>
            <span className="text-xs font-serif">→</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Tab Switcher */}
      <div className="flex items-center justify-between border-b border-[#e4ded3] pb-3">
        <div className="flex items-center bg-[#f4f0e8] p-1 rounded-xl border border-[#e4ded3]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-medium tracking-wide transition-all ${
              activeTab === 'preview'
                ? 'bg-[#fdfbf7] text-[#1c1b18] shadow-xs'
                : 'text-[#78736a] hover:text-[#1c1b18]'
            }`}
          >
            Living Document
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-medium tracking-wide transition-all ${
              activeTab === 'editor'
                ? 'bg-[#fdfbf7] text-[#1c1b18] shadow-xs'
                : 'text-[#78736a] hover:text-[#1c1b18]'
            }`}
          >
            Direct Terms
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-medium tracking-wide transition-all ${
              activeTab === 'markdown'
                ? 'bg-[#fdfbf7] text-[#1c1b18] shadow-xs'
                : 'text-[#78736a] hover:text-[#1c1b18]'
            }`}
          >
            Washi Markdown
          </button>
        </div>

        <div className="text-[11px] font-serif text-[#968f83] tracking-wide">
          Standard Terms Version 1.0
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'preview' && (
        <div className="japandi-paper rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto min-h-[550px]">
          {renderPreviewComponent(documentType, formData)}
        </div>
      )}

      {activeTab === 'editor' && onFieldsChange && (
        <FieldsEditor
          documentType={documentType}
          formData={formData}
          onChange={onFieldsChange}
        />
      )}

      {activeTab === 'markdown' && (
        <MarkdownView documentType={documentType} formData={formData} />
      )}
    </div>
  );
}

function renderPreviewComponent(documentType: DocumentType, formData: DocumentFormData) {
  switch (documentType) {
    case DocumentType.MUTUAL_NDA:
      return <NDAPreview formData={formData as MutualNDAData} />;
    case DocumentType.PILOT:
      return <PilotPreview formData={formData as PilotData} />;
    case DocumentType.CLOUD_SERVICE:
      return <CloudServicePreview formData={formData as CloudServiceData} />;
    case DocumentType.DESIGN_PARTNER:
    case DocumentType.SLA:
    case DocumentType.PROFESSIONAL_SERVICES:
    case DocumentType.PARTNERSHIP:
    case DocumentType.SOFTWARE_LICENSE:
    case DocumentType.DPA:
    case DocumentType.BAA:
    case DocumentType.AI_ADDENDUM:
      return <GenericPreview documentType={documentType} formData={formData} />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-[#78736a] text-xs font-serif">Preview unavailable for this agreement type</p>
        </div>
      );
  }
}
