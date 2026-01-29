'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  onComplete: () => void;
  companyId?: number | null;
}

export default function CompanySelection({ onComplete, companyId }: Props) {
  const router = useRouter();

  const handleCompleteCompanyProfile = (): void => {
    router.push(`/employer/company-profile`);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 text-center space-y-6">
      <h2 className="text-2xl font-bold text-yellow-700">
        Step 3: Company Profile
      </h2>

      <p className="text-gray-700 leading-relaxed">
        Please complete your company profile before proceeding to the next step.
      </p>

      <button
        type="button"
        onClick={handleCompleteCompanyProfile}
        className="w-full px-6 py-3 rounded-lg bg-yellow-600 text-white font-semibold shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition active:scale-95"
        aria-label="Complete Company Profile"
      >
        Complete Company Profile
      </button>
    </div>
  );
}
