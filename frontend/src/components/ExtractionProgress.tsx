'use client';

import { DocumentType, DocumentFormData, DOCUMENT_NAMES } from '@/types/documents';

interface ExtractionProgressProps {
  documentType: DocumentType | null;
  formData: DocumentFormData;
  isComplete: boolean;
}

export function ExtractionProgress({ documentType, formData, isComplete }: ExtractionProgressProps) {
  if (!documentType) {
    return (
      <div className="bg-[#f9f6f0] border-b border-[#e4ded3] px-5 py-3 flex items-center justify-between text-xs text-[#78736a]">
        <div className="flex items-center gap-2 font-serif tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c85a38]"></span>
          <span>Awaiting your contract intent...</span>
        </div>
        <span className="text-[10px] tracking-wider uppercase text-[#968f83]">Step 1: Choose or describe agreement</span>
      </div>
    );
  }

  const checks: { label: string; done: boolean }[] = [];

  const hasParty1 = Boolean(formData.party1?.company || formData.party1?.name);
  const hasParty2 = Boolean(formData.party2?.company || formData.party2?.name);
  const hasEffectiveDate = Boolean(formData.effectiveDate);
  const hasGoverningLaw = Boolean(formData.governingLaw);
  const hasPurpose = Boolean(formData.purpose);

  checks.push({ label: 'Contract Type', done: true });
  checks.push({ label: 'First Entity', done: hasParty1 });
  checks.push({ label: 'Second Entity', done: hasParty2 });
  checks.push({ label: 'Intent & Scope', done: hasPurpose });
  checks.push({ label: 'Effective Date', done: hasEffectiveDate });
  checks.push({ label: 'Governing Law', done: hasGoverningLaw });

  if (documentType === DocumentType.MUTUAL_NDA) {
    const ndaData = formData as unknown as { confidentialityTermType?: string };
    checks.push({ label: 'Confidentiality Term', done: Boolean(ndaData.confidentialityTermType) });
  } else if (documentType === DocumentType.CLOUD_SERVICE) {
    const csData = formData as unknown as { fees?: string; subscriptionPeriod?: string };
    checks.push({ label: 'Fees & Subscription', done: Boolean(csData.fees || csData.subscriptionPeriod) });
  } else if (documentType === DocumentType.PILOT) {
    const pilotData = formData as unknown as { pilotPeriod?: string };
    checks.push({ label: 'Trial Period', done: Boolean(pilotData.pilotPeriod) });
  }

  const completedCount = checks.filter((c) => c.done).length;
  const totalCount = checks.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-[#f9f6f0] border-b border-[#e4ded3] px-5 py-3">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xs font-semibold text-[#1c1b18] tracking-wide">
            {DOCUMENT_NAMES[documentType]}
          </span>
          <span className="text-[11px] text-[#78736a]">
            ({completedCount}/{totalCount} terms clarified)
          </span>
        </div>

        <div>
          {isComplete || percentage === 100 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-serif font-medium text-[#31533d] bg-[#eff5f1] px-2.5 py-0.5 rounded-md border border-[#31533d]/20">
              <span>✓</span> Fully Gathered
            </span>
          ) : (
            <span className="text-[10px] font-mono font-medium text-[#c85a38] bg-[#fbf0ec] px-2 py-0.5 rounded-md border border-[#c85a38]/20">
              {percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Clay Progress Bar */}
      <div className="w-full bg-[#ece6dc] h-1 rounded-full overflow-hidden mb-2.5">
        <div
          className={`h-full transition-all duration-500 ${
            percentage === 100 ? 'bg-[#31533d]' : 'bg-[#c85a38]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Zen Garden Pills */}
      <div className="flex flex-wrap gap-1.5">
        {checks.map((item, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-serif tracking-wide transition-all ${
              item.done
                ? 'bg-[#eff5f1] text-[#31533d] border border-[#31533d]/20'
                : 'bg-[#f4f0e8] text-[#968f83] border border-[#e4ded3]'
            }`}
          >
            <span className="text-[9px]">{item.done ? '●' : '○'}</span> {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
