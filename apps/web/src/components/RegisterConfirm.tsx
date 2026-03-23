'use client';

import { User, Mail, Phone, CreditCard, Lock, MapPin, Edit2 } from 'lucide-react';
import type { RegisterFormData } from '@/schemas/register.schema';
import { Button } from '@/components/ui';

interface RegisterConfirmProps {
  data: RegisterFormData;
  fotoUrl: string;
  onEdit: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SECTOR_LABELS: Record<string, string> = {
  MOZO: 'Mozo',
  COCINA: 'Cocina',
  BARRA: 'Barra',
  DELIVERY: 'Delivery',
  CAJA: 'Caja',
};

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="w-10 h-10 rounded-full bg-[#DC143C]/10 flex items-center justify-center">
        <Icon size={20} className="text-[#DC143C]" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
}

export function RegisterConfirm({
  data,
  fotoUrl,
  onEdit,
  onSubmit,
  isSubmitting,
}: RegisterConfirmProps) {
  const maskedCbu =
    data.cbu.length === 22
      ? `${data.cbu.slice(0, 4)}****${data.cbu.slice(-4)}`
      : `mi.${data.cbu.slice(0, 3)}***`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <img
          src={fotoUrl}
          alt={`Foto de ${data.nombre}`}
          className="w-24 h-24 rounded-full object-cover border-4 border-[#FDDC41] shadow-lg"
        />
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {data.nombre} {data.apellido}
          </h2>
          <p className="text-sm text-gray-500">
            {SECTOR_LABELS[data.sector] || data.sector}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="space-y-1">
          <InfoRow
            icon={User}
            label="Nombre completo"
            value={`${data.nombre} ${data.apellido}`}
          />
          <InfoRow icon={Mail} label="Email" value={data.email} />
          <InfoRow icon={Phone} label="Teléfono" value={data.telefono} />
          <InfoRow icon={MapPin} label="DNI" value={data.dni} />
          <InfoRow icon={CreditCard} label="CBU/Alias" value={maskedCbu} />
          <InfoRow
            icon={Lock}
            label="Sector"
            value={SECTOR_LABELS[data.sector] || data.sector}
          />
        </div>
      </div>

      <div className="bg-[#FDDC41]/20 border border-[#FDDC41]/30 rounded-xl p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
          <strong>Verifica que todos los datos sean correctos.</strong>
          <br />
          No podrás cambiar tu CBU/Alias después de registrarte.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={onSubmit} loading={isSubmitting} fullWidth>
          Finalizar Registro
        </Button>
        <Button variant="outline" onClick={onEdit} fullWidth>
          <Edit2 size={18} className="mr-2" />
          Modificar datos
        </Button>
      </div>
    </div>
  );
}
