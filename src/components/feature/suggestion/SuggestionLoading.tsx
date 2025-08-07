import React from 'react';
import { LoaderCircle } from 'lucide-react';

export const SuggestionLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <LoaderCircle size={40} className="animate-spin text-blue-600" />
    </div>
  );
};
