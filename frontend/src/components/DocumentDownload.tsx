'use client';

import { useState } from 'react';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES, MutualNDAData, PilotData, CloudServiceData } from '@/types/documents';
import { NDAPdf } from './NDAPdf';
import { PilotPdf } from './PilotPdf';
import { CloudServicePdf } from './CloudServicePdf';
import { GenericPdf } from './GenericPdf';
import { NDAFormData } from '@/types/nda';

interface DocumentDownloadProps {
  documentType: DocumentType;
  formData: DocumentFormData;
}

function sanitizeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9-]/g, '_').substring(0, 50);
}

function generateFilename(documentType: DocumentType, formData: DocumentFormData): string {
  const docName = DOCUMENT_NAMES[documentType].replace(/\s+/g, '-');
  const party1Name = sanitizeFilename(formData.party1.company || 'Party1');
  const party2Name = sanitizeFilename(formData.party2.company || 'Party2');
  const date = formData.effectiveDate || new Date().toISOString().split('T')[0];
  return `${docName}_${party1Name}_${party2Name}_${date}.pdf`;
}

export function DocumentDownload({ documentType, formData }: DocumentDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);

    let url: string | null = null;

    try {
      // Dynamic import to optimize bundle size and hydration
      const { pdf } = await import('@react-pdf/renderer');
      let pdfComponent;

      switch (documentType) {
        case DocumentType.MUTUAL_NDA:
          const ndaData = formData as MutualNDAData;
          const ndaFormData: NDAFormData = {
            purpose: ndaData.purpose,
            effectiveDate: ndaData.effectiveDate,
            mndaTermType: ndaData.mndaTermType,
            mndaTermYears: ndaData.mndaTermYears,
            confidentialityTermType: ndaData.confidentialityTermType,
            confidentialityTermYears: ndaData.confidentialityTermYears,
            governingLaw: ndaData.governingLaw,
            jurisdiction: ndaData.jurisdiction,
            modifications: ndaData.modifications,
            party1: ndaData.party1,
            party2: ndaData.party2,
          };
          pdfComponent = <NDAPdf formData={ndaFormData} />;
          break;
        case DocumentType.PILOT:
          pdfComponent = <PilotPdf formData={formData as PilotData} />;
          break;
        case DocumentType.CLOUD_SERVICE:
          pdfComponent = <CloudServicePdf formData={formData as CloudServiceData} />;
          break;
        default:
          pdfComponent = <GenericPdf documentType={documentType} formData={formData} />;
          break;
      }

      const blob = await pdf(pdfComponent).toBlob();
      url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = generateFilename(documentType, formData);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please retry.');
    } finally {
      if (url) {
        URL.revokeObjectURL(url);
      }
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        aria-busy={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-[#c85a38] hover:bg-[#b54f30] text-[#fdfbf7] text-xs font-serif font-medium rounded-xl transition-all shadow-xs disabled:bg-[#ece6dc] disabled:text-[#968f83] disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>Crafting PDF...</span>
          </>
        ) : (
          <>
            <span>捺印</span>
            <span>Download PDF</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-[11px] text-[#c85a38] mt-1 font-serif" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
