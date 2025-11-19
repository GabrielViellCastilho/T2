import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="sm:absolute sm:top-4 sm:left-4 relative mb-4 sm:mb-0 z-10">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 sm:gap-3 bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-4 rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Voltar</span>
      </button>
    </div>
  );
};

export default BackButton;
