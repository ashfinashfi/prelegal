'use client';

import { useState } from 'react';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES } from '@/types/documents';
import { formatDate } from '@/utils/nda';
import { getFieldConfig } from '@/utils/documentConfig';

interface MarkdownViewProps {
  documentType: DocumentType;
  formData: DocumentFormData;
}

export function generateDocumentMarkdown(documentType: DocumentType, formData: DocumentFormData): string {
  const docName = DOCUMENT_NAMES[documentType] || 'Legal Agreement';
  const config = getFieldConfig(documentType);

  let md = `# ${docName}\n\n`;
  md += `**Effective Date:** ${formatDate(formData.effectiveDate) || '_________________'}\n`;
  md += `**Purpose:** ${formData.purpose || '_________________'}\n`;
  md += `**Governing Law:** ${formData.governingLaw || '_________________'}\n`;
  md += `**Jurisdiction:** ${formData.jurisdiction || '_________________'}\n\n`;

  if (config.fields.length > 0) {
    md += `### Specific Terms\n\n`;
    for (const f of config.fields) {
      const val = (formData as unknown as Record<string, unknown>)[f.key] as string || '_________________';
      md += `- **${f.label}:** ${val}\n`;
    }
    md += `\n`;
  }

  md += `### Signatures\n\n`;
  md += `By signing below, each party enters into this agreement as of the Effective Date in mutual accord.\n\n`;

  md += `#### ${config.party1Label || 'Party 1'}:\n`;
  md += `- **Entity:** ${formData.party1?.company || '_________________'}\n`;
  md += `- **Print Name:** ${formData.party1?.name || '_________________'}\n`;
  md += `- **Title:** ${formData.party1?.title || '_________________'}\n`;
  md += `- **Notice Email/Address:** ${formData.party1?.noticeAddress || '_________________'}\n`;
  md += `- **Date:** ${formatDate(formData.party1?.date) || '_________________'}\n\n`;

  md += `#### ${config.party2Label || 'Party 2'}:\n`;
  md += `- **Entity:** ${formData.party2?.company || '_________________'}\n`;
  md += `- **Print Name:** ${formData.party2?.name || '_________________'}\n`;
  md += `- **Title:** ${formData.party2?.title || '_________________'}\n`;
  md += `- **Notice Email/Address:** ${formData.party2?.noticeAddress || '_________________'}\n`;
  md += `- **Date:** ${formatDate(formData.party2?.date) || '_________________'}\n\n`;

  md += `---\n*Common Paper Standard Terms (${docName}) • Licensed under CC BY 4.0.*`;

  return md;
}

export function MarkdownView({ documentType, formData }: MarkdownViewProps) {
  const [copied, setCopied] = useState(false);
  const markdownText = generateDocumentMarkdown(documentType, formData);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-[#f9f6f0] px-5 py-3 rounded-xl border border-[#e4ded3]">
        <div className="flex items-center gap-2">
          <span className="hanko-seal text-[10px]">原稿</span>
          <span className="font-serif text-xs font-semibold text-[#1c1b18]">Washi Raw Markdown Export</span>
        </div>
        <button
          onClick={handleCopy}
          className="px-3.5 py-1.5 bg-[#1c1b18] hover:bg-[#36332e] text-[#fdfbf7] text-xs font-serif rounded-lg shadow-2xs transition-all flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <span className="text-[#31533d]">✓</span>
              <span>Copied to Clipboard</span>
            </>
          ) : (
            <>
              <span>Copy Markdown</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-6 bg-[#2b2927] text-[#f4f0e8] rounded-2xl text-xs font-mono leading-relaxed overflow-x-auto border border-[#383531] whitespace-pre-wrap selection:bg-[#c85a38]/30">
        {markdownText}
      </pre>
    </div>
  );
}
