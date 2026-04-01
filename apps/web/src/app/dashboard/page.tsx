'use client';

import { useState } from 'react';
import Image from 'next/image';
import { QrCode, Star, Eye, EyeOff, CheckCircle } from 'lucide-react';

const mockUser = {
  nombre: 'Juan',
  apellido: 'Pérez',
};

const mockStats = {
  hoy: 1250,
  semana: 8750,
  mes: 32500,
};

const mockReviews = [
  { id: 1, estrellas: 5, hora: '14:30 hs', comentario: '¡Excelente servicio! Muy atento y amable.' },
  { id: 2, estrellas: 4, hora: '13:15 hs', comentario: 'Muy amable, recomendado' },
  { id: 3, estrellas: 5, hora: '12:45 hs', comentario: 'Genial, gracias por la recomendación' },
  { id: 4, estrellas: 3, hora: '11:20 hs', comentario: 'Buen servicio' },
];

export default function DashboardPage() {
  const [privacyMode, setPrivacyMode] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const renderAmount = (amount: number) => {
    if (privacyMode) {
      return <span className="blur-sm select-none">$ ****</span>;
    }
    return formatCurrency(amount);
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= count ? 'text-[#FDDC41] fill-[#FDDC41]' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Navbar - Ajustado */}
      <div className="bg-white border-b border-gray-100 px-4 py-6 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative">
              <Image
                src="/images/isotipo/isotipo.png"
                alt="PROPINANDO"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm text-[#0D5C63]">¡Buen turno!</p>
              <p className="text-lg font-semibold text-[#1A1A1A]">{mockUser.nombre} {mockUser.apellido}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setPrivacyMode(!privacyMode)}
            className="p-3 text-[#0D5C63] hover:text-[#DC143C] transition-colors"
            aria-label={privacyMode ? 'Desactivar modo privacidad' : 'Activar modo privacidad'}
          >
            {privacyMode ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        </div>
      </div>

      {/* Contenedor */}
      <div className="max-w-md mx-auto px-4 py-5 space-y-5">
        
        {/* Card Esta semana - primero */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-[#0D5C63] mb-1">Esta semana</p>
          <p className="text-3xl font-extrabold text-[#1A1A1A]">
            {renderAmount(mockStats.semana)}
          </p>
        </div>

        {/* Main Card - Neto Hoy */}
        <div className="bg-[#DC143C] rounded-xl p-5 shadow-lg">
          <p className="text-white/80 text-sm mb-1">NETO GANADO HOY</p>
          <p className="text-3xl font-bold text-white">
            {renderAmount(mockStats.hoy)}
          </p>
        </div>

        {/* Este mes */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-[#0D5C63] mb-1">Este mes</p>
          <p className="text-2xl font-bold text-[#1A1A1A]">
            {renderAmount(mockStats.mes)}
          </p>
        </div>

        {/* Reseñas */}
        <div className="mt-6">
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-3">Reseñas recientes</h3>
          <div className="space-y-3">
            {mockReviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  {renderStars(review.estrellas)}
                  <span className="text-xs text-[#0D5C63] ml-2">{review.hora}</span>
                </div>
                <p className="text-sm text-[#4B5563] leading-relaxed">"{review.comentario}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* QR Section */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mt-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#FDDC41]/20 rounded-full flex items-center justify-center">
              <QrCode className="text-[#DC143C]" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A1A1A]">Tu código QR</h3>
              <p className="text-sm text-[#0D5C63]">Escaneá para recibir propinas</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center">
            <QrCode className="text-gray-400" size={64} />
          </div>
        </div>
      </div>

      {/* Footer - Alias */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <CheckCircle className="text-[#10B981]" size={18} />
          <span className="text-sm text-[#0D5C63]">
            Recibiendo en: <span className="font-medium text-[#1A1A1A]">propinando.juanperez</span>
          </span>
        </div>
      </div>
    </div>
  );
}