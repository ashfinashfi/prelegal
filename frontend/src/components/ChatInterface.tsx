'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { DocumentType, DocumentFormData } from '@/types/documents';
import { ChatMessage, ChatResponse, extractFieldsFromResponse, parseDocumentType } from '@/types/chat';
import { getGreeting, sendMessage } from '@/services/chatApi';

interface ChatInterfaceProps {
  formData: DocumentFormData;
  onDocumentTypeDetected: (type: DocumentType) => void;
  onFieldsExtracted: (fields: Partial<DocumentFormData>) => void;
  onComplete: () => void;
  initialPrompt?: string | null;
}

const STARTER_PROMPTS = [
  { label: 'Mutual NDA', desc: 'Protect shared confidential insights', prompt: 'I want to draft a standard Mutual Non-Disclosure Agreement for evaluating a business partnership.' },
  { label: 'Cloud Service Agreement', desc: 'SaaS software terms & clear hosting obligations', prompt: 'Create a Cloud Service Agreement for our SaaS subscription product with annual term.' },
  { label: 'Pilot Evaluation', desc: '90-day trial with $0 liability cap', prompt: 'Draft a 90-day Pilot Agreement with a $0 liability cap for product evaluation.' },
  { label: 'AI Addendum', desc: 'Ethical model training & IP boundary terms', prompt: 'Create an AI Addendum ensuring customer data is never used to train public AI models.' },
];

export function ChatInterface({
  formData,
  onDocumentTypeDetected,
  onFieldsExtracted,
  onComplete,
  initialPrompt,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentTypeDetected, setDocumentTypeDetected] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading && messages.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, messages.length]);

  useEffect(() => {
    async function fetchGreeting() {
      try {
        setIsLoading(true);
        const response = await getGreeting();
        setMessages([{ role: 'assistant', content: response.response }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to AI Scribe');
      } finally {
        setIsLoading(false);
      }
    }
    fetchGreeting();
  }, []);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendText(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const handleSendText = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendMessage(newMessages);

      setMessages((prev) => [...prev, { role: 'assistant', content: response.response }]);

      if (!documentTypeDetected && response.documentType) {
        const docType = parseDocumentType(response.documentType);
        if (docType) {
          setDocumentTypeDetected(true);
          onDocumentTypeDetected(docType);
        }
      }

      const extractedFields = extractFieldsFromResponse(response);
      if (Object.keys(extractedFields).length > 0) {
        onFieldsExtracted(extractedFields);
      }

      if (response.isComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendText(input);
  };

  const handleCopyMessage = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      {/* Scrollable Message List */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {/* Starter Chips (Only before conversation grows) */}
        {messages.length <= 1 && (
          <div className="mb-4 bg-[#f9f6f0] border border-[#e4ded3] rounded-2xl p-4">
            <p className="text-[10px] font-serif uppercase tracking-widest text-[#78736a] mb-2.5">
              Reflective Starters
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STARTER_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendText(item.prompt)}
                  className="text-left bg-[#fdfbf7] hover:bg-[#f4f0e8] hover:border-[#c85a38]/30 border border-[#e4ded3] p-3 rounded-xl transition-all"
                >
                  <p className="font-serif text-xs font-semibold text-[#1c1b18]">{item.label}</p>
                  <p className="text-[11px] text-[#78736a] mt-0.5 leading-snug">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#1c1b18] text-[#fdfbf7] flex items-center justify-center text-xs font-serif font-bold shrink-0 mt-0.5">
                筆
              </div>
            )}

            <div className="group relative max-w-[85%]">
              <div
                className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#c85a38] text-white rounded-tr-xs shadow-xs font-medium'
                    : 'bg-[#f4f0e8] text-[#1c1b18] border border-[#e4ded3] rounded-tl-xs prose prose-xs max-w-none'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>

              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopyMessage(msg.content, idx)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 -bottom-3 bg-[#fdfbf7] border border-[#e4ded3] text-[#78736a] hover:text-[#1c1b18] text-[9px] px-1.5 py-0.5 rounded shadow-2xs"
                  title="Copy"
                >
                  {copiedIndex === idx ? '✓ Copied' : 'Copy'}
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#36332e] text-[#fdfbf7] flex items-center justify-center text-xs font-serif font-bold shrink-0 mt-0.5">
                客
              </div>
            )}
          </div>
        ))}

        {/* Gentle Ripple / Loading */}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-[#1c1b18] text-[#fdfbf7] flex items-center justify-center text-xs font-serif font-bold shrink-0">
              筆
            </div>
            <div className="bg-[#f4f0e8] border border-[#e4ded3] rounded-2xl rounded-tl-xs px-4 py-3">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-xs text-[#78736a] mr-1">Weaving terms</span>
                <div className="w-1.5 h-1.5 bg-[#c85a38] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#c85a38] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#c85a38] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center my-2">
            <div className="bg-[#fbf0ec] border border-[#c85a38]/30 text-[#c85a38] rounded-xl px-4 py-2 text-xs font-serif">
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray */}
      <div className="p-4 bg-[#f9f6f0] border-t border-[#e4ded3]">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Express terms, company names, or ask questions in plain words..."
            className="flex-1 px-4 py-2.5 text-xs bg-[#fdfbf7] border border-[#e4ded3] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c85a38] focus:border-[#c85a38] text-[#1c1b18] placeholder:text-[#968f83]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-2.5 bg-[#c85a38] hover:bg-[#b54f30] disabled:bg-[#ece6dc] disabled:text-[#968f83] text-[#fdfbf7] rounded-xl text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 disabled:cursor-not-allowed shadow-xs"
          >
            <span>Transmit</span>
            <span className="text-xs">→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
