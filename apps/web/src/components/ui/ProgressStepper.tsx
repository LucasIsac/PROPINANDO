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
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {labels?.[currentStep - 1] || `Paso ${currentStep} de ${totalSteps}`}
        </p>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {Math.round(progress)}%
        </p>
      </div>
      <div className="w-full rounded-full bg-gray-200 dark:bg-gray-800 h-2 overflow-hidden">
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
