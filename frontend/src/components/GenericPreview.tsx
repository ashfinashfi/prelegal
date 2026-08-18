'use client';

import { DocumentType, DocumentFormData, DOCUMENT_NAMES } from '@/types/documents';
import { formatDate } from '@/utils/nda';
import { getFieldConfig } from '@/utils/documentConfig';

interface GenericPreviewProps {
  documentType: DocumentType;
  formData: DocumentFormData;
}

function Placeholder({ value, fallback = '___________' }: { value: string; fallback?: string }) {
  return value ? (
    <span className="text-[#1c1b18] font-medium bg-[#fbf0ec]/60 px-1 py-0.5 rounded text-xs border-b border-[#c85a38]/40">
      {value}
    </span>
  ) : (
    <span className="text-[#968f83] italic text-xs">{fallback}</span>
  );
}

function SignatureBlock({ party, label }: { party: { name: string; title: string; company: string; noticeAddress: string; date: string }; label: string }) {
  return (
    <div className="border border-[#e4ded3] rounded-xl p-5 bg-[#fdfbf7]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xs font-semibold text-[#78736a] uppercase tracking-widest mt-0">
          {label}
        </h3>
        <span className="hanko-seal text-[10px]">捺印</span>
      </div>
      <div className="space-y-3.5 text-xs">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Entity / Organization</p>
          <p className="text-[#1c1b18] font-medium">
            <Placeholder value={party.company} />
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-1">Authorized Signature</p>
          <div className="border-b border-[#d8d0c2] h-8 flex items-end pb-1">
            {party.name && <span className="font-serif italic text-xs text-[#78736a]">{party.name}</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Print Name</p>
            <p className="text-[#1c1b18]">
              <Placeholder value={party.name} />
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Title</p>
            <p className="text-[#1c1b18]">
              <Placeholder value={party.title} />
            </p>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Notice Address</p>
          <p className="text-[#1c1b18]">
            <Placeholder value={party.noticeAddress} />
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Date</p>
          <p className="text-[#1c1b18]">{formatDate(party.date) || '___________'}</p>
        </div>
      </div>
    </div>
  );
}

export function GenericPreview({ documentType, formData }: GenericPreviewProps) {
  const config = getFieldConfig(documentType);
  const documentName = DOCUMENT_NAMES[documentType];

  return (
    <div className="text-[#1c1b18] max-w-none">
      {/* Header */}
      <div className="text-center mb-10 pb-6 border-b border-[#e4ded3]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="hanko-seal">契約書</span>
          <span className="text-[11px] font-serif tracking-widest text-[#78736a] uppercase">CommonPaper Standard Terms</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1c1b18] mb-2 tracking-tight">
          {documentName}
        </h1>
        <p className="text-xs font-serif text-[#78736a] tracking-wide">
          Standard Terms & Agreement Framework
        </p>
      </div>

      {/* Cover Page Terms */}
      <div className="bg-[#f9f6f0] rounded-xl p-6 sm:p-7 mb-10 border border-[#e4ded3]">
        <h2 className="font-serif text-base font-semibold text-[#1c1b18] mb-5 mt-0 tracking-wide pb-2 border-b border-[#e4ded3]/80">
          Agreement Key Terms
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
              Purpose & Scope
            </h3>
            <p className="text-[#36332e] leading-relaxed">
              <Placeholder value={formData.purpose} fallback="[Purpose of this agreement]" />
            </p>
          </div>

          <div>
            <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
              Effective Date
            </h3>
            <p className="text-[#36332e]">{formatDate(formData.effectiveDate) || '___________'}</p>
          </div>

          {/* Dynamic specific fields */}
          {config.fields.map((field) => {
            const value = ((formData as unknown as Record<string, unknown>)[field.key] as string) || '';
            return (
              <div key={field.key}>
                <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
                  {field.label}
                </h3>
                <p className="text-[#36332e] leading-relaxed">
                  <Placeholder value={value} fallback={`[${field.label}]`} />
                </p>
              </div>
            );
          })}

          <div>
            <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
              Governing Law & Jurisdiction
            </h3>
            <p className="text-[#36332e]">
              Governing Law: <Placeholder value={formData.governingLaw} fallback="[State]" />
            </p>
            <p className="text-[#78736a] text-[11px] mt-0.5">
              Courts in <Placeholder value={formData.jurisdiction} fallback="[City/County, State]" />
            </p>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mb-10">
        <p className="font-serif text-xs text-[#78736a] italic mb-6">
          By signing below, each party agrees to enter into this {documentName} as of the Effective Date with mutual good faith.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignatureBlock party={formData.party1} label={config.party1Label} />
          <SignatureBlock party={formData.party2} label={config.party2Label} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#e4ded3] pt-6 text-[11px] font-serif text-[#968f83]">
        <p>
          Common Paper {documentName} • Free to use under Creative Commons CC BY 4.0.
        </p>
      </div>
    </div>
  );
}
