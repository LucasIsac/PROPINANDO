import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="w-32 h-32 relative animate-pulse">
        <Image
          src="/images/isotipo/isotipo.png"
          alt="Cargando..."
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}