'use client';

import { NDAFormData } from '@/types/nda';
import { formatDate, getMndaTermText, getConfidentialityTermText } from '@/utils/nda';

interface NDAPreviewProps {
  formData: NDAFormData;
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

function SignatureBlock({ party, partyNumber }: { party: NDAFormData['party1']; partyNumber: 1 | 2 }) {
  return (
    <div className="border border-[#e4ded3] rounded-xl p-5 bg-[#fdfbf7]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xs font-semibold text-[#78736a] uppercase tracking-widest mt-0">
          Signer {partyNumber}
        </h3>
        <span className="hanko-seal text-[10px]">捺印</span>
      </div>
      <div className="space-y-3.5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Entity Name</p>
          <p className="text-xs text-[#1c1b18] font-medium">
            <Placeholder value={party.company} />
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-1">Signature Authorization</p>
          <div className="border-b border-[#d8d0c2] h-8 flex items-end pb-1">
            {party.name && <span className="font-serif italic text-xs text-[#78736a]">{party.name}</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Full Name</p>
            <p className="text-xs text-[#1c1b18]">
              <Placeholder value={party.name} />
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Title</p>
            <p className="text-xs text-[#1c1b18]">
              <Placeholder value={party.title} />
            </p>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Notice Address</p>
          <p className="text-xs text-[#1c1b18]">
            <Placeholder value={party.noticeAddress} />
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#968f83] mb-0.5">Date</p>
          <p className="text-xs text-[#1c1b18]">{formatDate(party.date) || '___________'}</p>
        </div>
      </div>
    </div>
  );
}

export function NDAPreview({ formData }: NDAPreviewProps) {
  const mndaTerm = getMndaTermText(formData);
  const confidentialityTerm = getConfidentialityTermText(formData);

  return (
    <div className="text-[#1c1b18] max-w-none">
      {/* Header */}
      <div className="text-center mb-10 pb-6 border-b border-[#e4ded3]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="hanko-seal">合意書</span>
          <span className="text-[11px] font-serif tracking-widest text-[#78736a] uppercase">Mutual Non-Disclosure Agreement</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1c1b18] mb-2 tracking-tight">
          Mutual Non-Disclosure Agreement
        </h1>
        <p className="text-xs font-serif text-[#78736a] tracking-wide">
          Common Paper Mutual NDA Standard Terms • Version 1.0
        </p>
      </div>

      {/* Cover Page Terms */}
      <div className="bg-[#f9f6f0] rounded-xl p-6 sm:p-7 mb-10 border border-[#e4ded3]">
        <h2 className="font-serif text-base font-semibold text-[#1c1b18] mb-5 mt-0 tracking-wide pb-2 border-b border-[#e4ded3]/80">
          Cover Page Terms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="md:col-span-2">
            <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
              Purpose
            </h3>
            <p className="text-[#36332e] leading-relaxed">
              <Placeholder value={formData.purpose} fallback="[How Confidential Information may be used]" />
            </p>
          </div>

          <div>
            <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
              Effective Date
            </h3>
            <p className="text-[#36332e]">{formatDate(formData.effectiveDate) || '___________'}</p>
          </div>

          <div>
            <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
              Agreement Term
            </h3>
            <p className="text-[#36332e]">{mndaTerm}</p>
          </div>

          <div>
            <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
              Term of Confidentiality
            </h3>
            <p className="text-[#36332e]">{confidentialityTerm}</p>
          </div>

          <div>
            <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
              Governing Law & Jurisdiction
            </h3>
            <p className="text-[#36332e]">
              State of <Placeholder value={formData.governingLaw} fallback="[Governing State]" />
            </p>
            <p className="text-[#78736a] text-[11px] mt-0.5">
              Courts in <Placeholder value={formData.jurisdiction} fallback="[City/County, State]" />
            </p>
          </div>

          {formData.modifications && (
            <div className="md:col-span-2 pt-2 border-t border-[#e4ded3]">
              <h3 className="font-serif text-[11px] font-semibold text-[#78736a] uppercase tracking-wider mb-1">
                Special Modifications
              </h3>
              <p className="text-[#36332e]">{formData.modifications}</p>
            </div>
          )}
        </div>
      </div>

      {/* Signature Section */}
      <div className="mb-10">
        <p className="font-serif text-xs text-[#78736a] italic mb-6">
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date with mutual good faith.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignatureBlock party={formData.party1} partyNumber={1} />
          <SignatureBlock party={formData.party2} partyNumber={2} />
        </div>
      </div>

      {/* Standard Terms Articles */}
      <div className="border-t border-[#e4ded3] pt-8">
        <h2 className="font-serif text-lg font-bold text-[#1c1b18] mb-5 tracking-wide">
          Standard Terms & Conditions
        </h2>

        <div className="space-y-4 text-xs text-[#36332e] leading-relaxed">
          <div>
            <p className="font-serif font-semibold text-[#1c1b18] mb-1">1. Introduction</p>
            <p className="text-[#6e695f]">
              This Mutual Non-Disclosure Agreement allows each party (&ldquo;Disclosing Party&rdquo;) to disclose or make available information in connection with the Purpose which is identified as confidential or should be reasonably understood as confidential due to its nature.
            </p>
          </div>

          <div>
            <p className="font-serif font-semibold text-[#1c1b18] mb-1">2. Use and Protection of Confidential Information</p>
            <p className="text-[#6e695f]">
              The Receiving Party shall: (a) use Confidential Information solely for the Purpose; (b) not disclose Confidential Information to third parties without prior written consent; and (c) protect Confidential Information using a reasonable standard of care.
            </p>
          </div>

          <div>
            <p className="font-serif font-semibold text-[#1c1b18] mb-1">3. Governing Law and Jurisdiction</p>
            <p className="text-[#6e695f]">
              This Agreement is governed by the laws of the State of{' '}
              <Placeholder value={formData.governingLaw} fallback="[Governing Law]" />. Any legal proceedings shall be instituted exclusively in the courts located in{' '}
              <Placeholder value={formData.jurisdiction} fallback="[Jurisdiction]" />.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#e4ded3] text-[11px] font-serif text-[#968f83]">
          <p>Common Paper Mutual Non-Disclosure Agreement (Version 1.0) • Free to use under Creative Commons CC BY 4.0.</p>
        </div>
      </div>
    </div>
  );
}
