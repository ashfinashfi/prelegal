'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';

interface UserMenuProps {
  user: User;
  onOpenDocuments: () => void;
}

export function UserMenu({ user, onOpenDocuments }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignout = async () => {
    await signout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#f4f0e8] border border-[#e4ded3] transition-colors bg-[#fdfbf7]"
      >
        <div className="w-7 h-7 bg-[#1c1b18] rounded-lg flex items-center justify-center text-[#fdfbf7] font-serif font-bold text-xs">
          {user.email[0].toUpperCase()}
        </div>
        <span className="text-xs font-serif text-[#1c1b18] hidden sm:inline max-w-32 truncate">
          {user.email}
        </span>
        <span className="text-[10px] text-[#78736a]">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-[#fdfbf7] rounded-2xl shadow-xl border border-[#e4ded3] py-2 z-50 animate-in fade-in duration-150">
          <div className="px-4 py-2.5 border-b border-[#e4ded3]">
            <p className="text-[10px] font-serif uppercase tracking-widest text-[#78736a]">Active Atelier</p>
            <p className="text-xs font-serif font-semibold text-[#1c1b18] truncate mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={() => {
              onOpenDocuments();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-xs font-serif text-[#36332e] hover:bg-[#f4f0e8] flex items-center gap-2"
          >
            <span>書</span>
            <span>My Preserved Contracts</span>
          </button>
          <button
            onClick={handleSignout}
            className="w-full text-left px-4 py-2 text-xs font-serif text-[#c85a38] hover:bg-[#fbf0ec] flex items-center gap-2"
          >
            <span>離</span>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
