'use client';

import { clsx } from 'clsx';
import type { Sector } from '@/schemas/register.schema';

const SECTORS: { value: Sector; label: string; icon: string }[] = [
  { value: 'MOZO', label: 'Mozo', icon: 'restaurant' },
  { value: 'COCINA', label: 'Cocina', icon: 'soup' },
  { value: 'BARRA', label: 'Barra', icon: 'local_bar' },
  { value: 'DELIVERY', label: 'Delivery', icon: 'delivery_dining' },
  { value: 'CAJA', label: 'Caja', icon: 'point_of_sale' },
];

interface RoleSelectorProps {
  value: Sector | undefined;
  onChange: (value: Sector) => void;
  error?: string;
}

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Sector de trabajo
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {SECTORS.map((sector) => (
          <button
            key={sector.value}
            type="button"
            onClick={() => onChange(sector.value)}
            className={clsx(
              'flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg transition-all duration-200 min-h-[60px]',
              'text-sm font-medium',
              value === sector.value
                ? 'bg-[#FDDC41] text-gray-900 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <span className="material-symbols-outlined text-xl">
              {sector.icon}
            </span>
            <span className="text-xs">{sector.label}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
