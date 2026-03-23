'use client';

import { clsx } from 'clsx';
import { UtensilsCrossed, ChefHat, Wine, Bike, Calculator } from 'lucide-react';
import type { Sector } from '@/schemas/register.schema';

const SECTORS: { value: Sector; label: string; icon: React.ReactNode }[] = [
  { value: 'MOZO', label: 'Mozo', icon: <UtensilsCrossed size={20} /> },
  { value: 'COCINA', label: 'Cocina', icon: <ChefHat size={20} /> },
  { value: 'BARRA', label: 'Barra', icon: <Wine size={20} /> },
  { value: 'DELIVERY', label: 'Delivery', icon: <Bike size={20} /> },
  { value: 'CAJA', label: 'Caja', icon: <Calculator size={20} /> },
];

interface RoleSelectorProps {
  value: Sector | undefined;
  onChange: (value: Sector) => void;
  error?: string;
}

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-[#1A1A1A]">
        Sector de trabajo
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
        {SECTORS.map((sector) => (
          <button
            key={sector.value}
            type="button"
            onClick={() => onChange(sector.value)}
            className={clsx(
              'flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg transition-all duration-200 min-h-[60px]',
              'text-sm font-medium',
              value === sector.value
                ? 'bg-[#FDDC41] border-2 border-[#FDDC41] shadow-sm text-[#1A1A1A]'
                : 'hover:bg-gray-200 border-2 border-transparent text-[#6B7280]'
            )}
          >
            {sector.icon}
            <span className="text-xs">{sector.label}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
