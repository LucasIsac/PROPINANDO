'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
  Zap, 
  Shield, 
  Banknote, 
  Coins,
  CircleDollarSign 
} from 'lucide-react';
import { FloatingIcon, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn';
import { Button } from '@/components/ui';

const floatingIcons = [
  { icon: Banknote, delay: 0 },
  { icon: Coins, delay: 0.2 },
  { icon: CircleDollarSign, delay: 0.4 },
  { icon: CreditCard, delay: 0.6 },
];

const benefits = [
  {
    icon: CreditCard,
    title: 'Conexión directa',
    description: 'Recibe propinas sin intermediarios',
  },
  {
    icon: Zap,
    title: 'Pagos instantáneos',
    description: 'Transacciones en segundos',
  },
  {
    icon: Shield,
    title: '100% seguro',
    description: 'Tus datos protegidos siempre',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <FadeIn delay={0} className="pt-8 px-4">
        <h1 className="text-4xl font-bold text-center text-[#DC143C] tracking-tight">
          PROPINANDO
        </h1>
      </FadeIn>

      {/* Floating Icons */}
      <div className="flex-1 flex items-center justify-center py-8 overflow-hidden">
        <div className="relative w-64 h-32 flex items-center justify-center gap-4">
          {floatingIcons.map((item, index) => (
            <FloatingIcon 
              key={index} 
              delay={item.delay}
              className="text-[#DC143C]/80"
            >
              <item.icon size={index % 2 === 0 ? 48 : 40} strokeWidth={1.5} />
            </FloatingIcon>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-8">
        {/* Main Text */}
        <FadeIn delay={0.3} className="text-center mb-2">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">
            Gestiona tus propinas
          </h2>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">
            digitales
          </h2>
        </FadeIn>

        <FadeIn delay={0.5} className="text-center mb-8">
          <p className="text-[#4B5563]">
            Recibe pagos de forma instantánea y segura
          </p>
        </FadeIn>

        {/* Benefits Cards - Stagger */}
        <StaggerContainer className="max-w-md mx-auto mb-8">
          {benefits.map((benefit, index) => (
            <StaggerItem key={index}>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#DC143C]/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="text-[#DC143C]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A]">{benefit.title}</h3>
                  <p className="text-sm text-[#4B5563]">{benefit.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Buttons */}
        <div className="max-w-md mx-auto space-y-3">
          <FadeIn delay={0.9}>
            <Link href="/login" className="block">
              <Button fullWidth size="lg">
                Iniciar Sesión
              </Button>
            </Link>
          </FadeIn>

          <FadeIn delay={1.1}>
            <Link href="/register" className="block">
              <Button fullWidth size="lg" variant="outline">
                Registrarse
              </Button>
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* Footer */}
      <FadeIn delay={1.3} className="py-4 text-center">
        <p className="text-sm text-[#6B7280]">
          © 2026 Propinando
        </p>
      </FadeIn>
    </main>
  );
}
