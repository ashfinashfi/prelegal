'use client';

import { useState } from 'react';
import { CATALOG_ITEMS, CatalogItem } from '@/utils/catalogData';

interface TemplateCatalogModalProps {
  onClose: () => void;
  onSelectTemplate: (item: CatalogItem, startPrompt?: string) => void;
}

export function TemplateCatalogModal({ onClose, onSelectTemplate }: TemplateCatalogModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Confidentiality', 'Software & SaaS', 'Services', 'Compliance & AI'];

  const filteredItems = CATALOG_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1b18]/50 backdrop-blur-sm animate-in fade-in duration-200" role="presentation">
      <div
        className="bg-[#fdfbf7] rounded-2xl shadow-2xl border border-[#e4ded3] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-modal-title"
      >
        {/* Header */}
        <div className="px-7 py-6 border-b border-[#e4ded3] flex items-center justify-between bg-[#f9f6f0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="hanko-seal">目録</span>
              <span className="text-xs font-serif tracking-widest text-[#78736a] uppercase">The 11 CommonPaper Standard Archives</span>
            </div>
            <h2 id="catalog-modal-title" className="font-serif text-2xl font-bold text-[#1c1b18]">Agreement Archives</h2>
            <p className="text-xs text-[#78736a] mt-0.5">
              Select any agreement to initialize the AI Scribe or begin manual curation
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#78736a] hover:text-[#1c1b18] p-2 rounded-xl hover:bg-[#ece6dc] transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-[#e4ded3] bg-[#f5f2eb] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-xs font-serif rounded-lg transition-all ${
                  selectedCategory === category
                    ? 'bg-[#1c1b18] text-[#fdfbf7] shadow-xs font-medium'
                    : 'bg-[#fdfbf7] text-[#78736a] hover:bg-[#ece6dc] border border-[#e4ded3]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#e4ded3] focus:outline-none focus:ring-1 focus:ring-[#c85a38] bg-[#fdfbf7] text-[#1c1b18]"
            />
            <span className="absolute left-2.5 top-2 text-[#968f83] text-xs">🔍</span>
          </div>
        </div>

        {/* Grid List */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f9f6f0]/40">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group border border-[#e4ded3] hover:border-[#c85a38]/40 rounded-xl p-5 bg-[#fdfbf7] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-serif uppercase tracking-widest text-[#78736a] bg-[#f4f0e8] px-2.5 py-0.5 rounded border border-[#e4ded3]">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-serif text-[#c85a38] bg-[#fbf0ec] px-2 py-0.5 rounded border border-[#c85a38]/20">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-[#1c1b18] group-hover:text-[#c85a38] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-[#78736a] mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#e4ded3] flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectTemplate(item)}
                  className="text-xs font-serif text-[#78736a] hover:text-[#1c1b18] px-2 py-1 rounded hover:bg-[#f4f0e8] transition-colors"
                >
                  Direct Template
                </button>
                <button
                  onClick={() => onSelectTemplate(item, item.samplePrompt)}
                  className="text-xs bg-[#c85a38] hover:bg-[#b54f30] text-[#fdfbf7] px-3.5 py-1.5 rounded-lg font-medium shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Draft with Scribe</span>
                  <span className="text-xs">→</span>
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-2 text-center py-12 text-[#968f83] font-serif">
              <p className="text-sm">No agreements found in the archive.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#e4ded3] bg-[#f9f6f0] text-xs font-serif text-[#78736a] flex items-center justify-between">
          <span>All 11 agreements licensed under CC BY 4.0 by Common Paper</span>
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
