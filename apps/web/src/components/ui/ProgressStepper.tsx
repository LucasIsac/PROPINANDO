'use client';

import { clsx } from 'clsx';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function ProgressStepper({
  currentStep,
  totalSteps,
  labels,
}: ProgressStepperProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-[#6B7280]">
          {labels?.[currentStep - 1] || `Paso ${currentStep} de ${totalSteps}`}
        </p>
        <p className="text-sm font-bold text-[#1A1A1A]">
          {Math.round(progress)}%
        </p>
      </div>
      <div className="w-full rounded-full bg-gray-200 h-2 overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-out',
            'bg-[#FDDC41]'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
