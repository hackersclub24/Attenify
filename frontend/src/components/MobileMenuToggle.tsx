'use client';

import { Menu, X } from 'lucide-react';
import { useMobileMenu } from '../context/MobileMenuContext';

export function MobileMenuToggle() {
  const { isOpen, toggleMenu } = useMobileMenu();

  return (
    <button
      onClick={toggleMenu}
      className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
      aria-label="Toggle menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
}
