'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function Navbar() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-[#DC143C] hover:text-[#B01030] transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver</span>
        </button>
        
        <h1 className="text-lg font-bold text-[#DC143C]">
          PROPINANDO
        </h1>
        
        <div className="w-10" />
      </div>
    </nav>
  );
}
