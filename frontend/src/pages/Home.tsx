import React from "react";
import { Link } from "react-router-dom";
import { Globe, Map, Building2 } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <h1 className="text-5xl font-bold text-center text-white">GeoHub</h1>

      <p className="mt-4 text-gray-300 text-center text-lg max-w-3xl">
        O GeoHub é uma plataforma de gerenciamento geográfico onde você pode
        explorar e gerenciar dados de continentes, países e cidades. Navegue
        pelas informações detalhadas e visualize os dados de forma simples e
        intuitiva.
      </p>

      <p className="mt-4 text-gray-400 text-center text-md">
        Escolha uma opção abaixo para começar:
      </p>

      <div className="mt-10 flex flex-col md:flex-row gap-6">
        <Link
          to="/continentes"
          className="flex items-center gap-3 bg-blue-500 text-white px-6 py-4 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
        >
          <Globe />
          Continentes
        </Link>

        <Link
          to="/paises"
          className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all"
        >
          <Map />
          Países
        </Link>

        <Link
          to="/cidades"
          className="flex items-center gap-3 bg-yellow-500 text-white px-6 py-4 rounded-xl shadow-md hover:bg-yellow-600 hover:shadow-lg transition-all"
        >
          <Building2 />
          Cidades
        </Link>
      </div>
    </div>
  );
};

export default Home;
