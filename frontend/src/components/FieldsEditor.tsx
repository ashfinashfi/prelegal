'use client';

import { DocumentType, DocumentFormData, PartyInfo } from '@/types/documents';
import { getFieldConfig } from '@/utils/documentConfig';

interface FieldsEditorProps {
  documentType: DocumentType;
  formData: DocumentFormData;
  onChange: (fields: Partial<DocumentFormData>) => void;
}

export function FieldsEditor({ documentType, formData, onChange }: FieldsEditorProps) {
  const config = getFieldConfig(documentType);

  const handleScalarChange = (key: string, value: string | number) => {
    onChange({ [key]: value } as unknown as Partial<DocumentFormData>);
  };

  const handlePartyChange = (partyKey: 'party1' | 'party2', field: keyof PartyInfo, value: string) => {
    const currentParty = formData[partyKey] || {
      name: '',
      title: '',
      company: '',
      noticeAddress: '',
      date: '',
    };
    onChange({
      [partyKey]: {
        ...currentParty,
        [field]: value,
      },
    } as unknown as Partial<DocumentFormData>);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-2">
      <div className="bg-[#f9f6f0] border border-[#e4ded3] rounded-2xl p-4 text-xs text-[#36332e] flex items-start gap-3">
        <span className="hanko-seal text-[11px] shrink-0 mt-0.5">直接編集</span>
        <div>
          <p className="font-serif font-semibold text-[#1c1b18] text-sm">Direct Terms Atelier</p>
          <p className="text-[#78736a] mt-0.5">
            Refine extracted variables directly. All modifications immediately harmonize with the live agreement canvas and PDF export.
          </p>
        </div>
      </div>

      {/* General Terms */}
      <div className="bg-[#fdfbf7] rounded-2xl border border-[#e4ded3] p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-sm font-bold text-[#1c1b18] uppercase tracking-wider border-b border-[#e4ded3] pb-2.5">
          Core Agreement Terms
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-serif text-[#78736a] mb-1">Effective Date</label>
            <input
              type="date"
              value={formData.effectiveDate || ''}
              onChange={(e) => handleScalarChange('effectiveDate', e.target.value)}
              className="w-full text-xs px-3.5 py-2 border border-[#e4ded3] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>

          <div>
            <label className="block text-xs font-serif text-[#78736a] mb-1">Governing Law (State)</label>
            <input
              type="text"
              placeholder="e.g. Delaware, California, New York"
              value={formData.governingLaw || ''}
              onChange={(e) => handleScalarChange('governingLaw', e.target.value)}
              className="w-full text-xs px-3.5 py-2 border border-[#e4ded3] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-serif text-[#78736a] mb-1">Purpose / Scope Definition</label>
            <textarea
              rows={2}
              placeholder="Purpose of this agreement..."
              value={formData.purpose || ''}
              onChange={(e) => handleScalarChange('purpose', e.target.value)}
              className="w-full text-xs px-3.5 py-2 border border-[#e4ded3] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-serif text-[#78736a] mb-1">Court Jurisdiction</label>
            <input
              type="text"
              placeholder="e.g. State or federal courts in New Castle County, Delaware"
              value={formData.jurisdiction || ''}
              onChange={(e) => handleScalarChange('jurisdiction', e.target.value)}
              className="w-full text-xs px-3.5 py-2 border border-[#e4ded3] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>
        </div>

        {/* Dynamic Config Fields */}
        {config.fields.length > 0 && (
          <div className="pt-4 border-t border-[#e4ded3] grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.fields.map((f) => {
              const val = (formData as unknown as Record<string, unknown>)[f.key] as string || '';
              return (
                <div key={f.key}>
                  <label className="block text-xs font-serif text-[#78736a] mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={val}
                    placeholder={`Enter ${f.label.toLowerCase()}...`}
                    onChange={(e) => handleScalarChange(f.key, e.target.value)}
                    className="w-full text-xs px-3.5 py-2 border border-[#e4ded3] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Party 1 & Party 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Party 1 */}
        <div className="bg-[#fdfbf7] rounded-2xl border border-[#e4ded3] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#e4ded3] pb-2">
            <h3 className="font-serif text-xs font-bold text-[#1c1b18] uppercase tracking-wider">
              {config.party1Label || 'Party 1'}
            </h3>
            <span className="hanko-seal text-[9px]">甲</span>
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#78736a] mb-1">Entity / Organization</label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={formData.party1?.company || ''}
              onChange={(e) => handlePartyChange('party1', 'company', e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-[#e4ded3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#78736a] mb-1">Signer Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={formData.party1?.name || ''}
              onChange={(e) => handlePartyChange('party1', 'name', e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-[#e4ded3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#78736a] mb-1">Signer Title</label>
            <input
              type="text"
              placeholder="e.g. Chief Executive Officer"
              value={formData.party1?.title || ''}
              onChange={(e) => handlePartyChange('party1', 'title', e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-[#e4ded3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#78736a] mb-1">Notice Address / Email</label>
            <input
              type="text"
              placeholder="e.g. legal@acme.com"
              value={formData.party1?.noticeAddress || ''}
              onChange={(e) => handlePartyChange('party1', 'noticeAddress', e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-[#e4ded3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>
        </div>

        {/* Party 2 */}
        <div className="bg-[#fdfbf7] rounded-2xl border border-[#e4ded3] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#e4ded3] pb-2">
            <h3 className="font-serif text-xs font-bold text-[#1c1b18] uppercase tracking-wider">
              {config.party2Label || 'Party 2'}
            </h3>
            <span className="hanko-seal text-[9px]">乙</span>
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#78736a] mb-1">Entity / Organization</label>
            <input
              type="text"
              placeholder="e.g. Beta Innovations LLC"
              value={formData.party2?.company || ''}
              onChange={(e) => handlePartyChange('party2', 'company', e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-[#e4ded3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#78736a] mb-1">Signer Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Smith"
              value={formData.party2?.name || ''}
              onChange={(e) => handlePartyChange('party2', 'name', e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-[#e4ded3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#78736a] mb-1">Signer Title</label>
            <input
              type="text"
              placeholder="e.g. Managing Partner"
              value={formData.party2?.title || ''}
              onChange={(e) => handlePartyChange('party2', 'title', e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-[#e4ded3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#78736a] mb-1">Notice Address / Email</label>
            <input
              type="text"
              placeholder="e.g. notices@betainnovations.com"
              value={formData.party2?.noticeAddress || ''}
              onChange={(e) => handlePartyChange('party2', 'noticeAddress', e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-[#e4ded3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#f9f6f0] text-[#1c1b18]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
