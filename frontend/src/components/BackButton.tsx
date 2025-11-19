import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 left-4 z-10">
      <button
        onClick={() => navigate('/')}
        className="back-button flex items-center gap-3 bg-red-600 text-white px-6 py-4 rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all"
      >
        <ArrowLeft />
        Voltar
      </button>
    </div>
  );
};

export default BackButton;
