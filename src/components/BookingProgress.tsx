import { Check } from 'lucide-react';

interface BookingProgressProps {
  currentStep: number;
}

export default function BookingProgress({ currentStep }: BookingProgressProps) {
  const steps = [
    { id: 1, name: 'Select Room' },
    { id: 2, name: 'Guest Details' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Confirmation' },
  ];

  return (
    <div className="w-full py-6 bg-white border-b border-gray-100 sticky top-[72px] z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Bar Background */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full hidden sm:block" />
          
          {/* Active Progress Bar */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-ocean-500)] rounded-full transition-all duration-500 hidden sm:block"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="relative flex flex-col items-center gap-2 z-10">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300
                    ${isCompleted ? 'bg-[var(--color-ocean-500)] text-white' : 
                      isActive ? 'bg-[var(--color-ocean-600)] text-white ring-4 ring-[var(--color-ocean-100)]' : 
                      'bg-white border-2 border-gray-200 text-gray-400'}`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                </div>
                <span 
                  className={`text-xs sm:text-sm font-medium hidden sm:block transition-colors duration-300
                    ${isActive ? 'text-[var(--color-ocean-900)]' : 
                      isCompleted ? 'text-[var(--color-ocean-600)]' : 
                      'text-gray-400'}`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Mobile current step text */}
        <div className="text-center mt-3 sm:hidden">
          <span className="text-sm font-semibold text-[var(--color-ocean-900)]">
            Step {currentStep}: {steps[currentStep - 1].name}
          </span>
        </div>
      </div>
    </div>
  );
}
