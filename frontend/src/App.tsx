import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Continentes from './pages/Continentes';
import Paises from './pages/Paises';
import Cidades from './pages/Cidades';
import AdicionarCidade from './pages/AdicionarCidade';
import AdicionarContinente from './pages/AdicionarContinente';
import AdicionarPais from './pages/AdicionarPais';
import VisualizarCidade from './pages/VisualizarCidade'; 
import VisualizarPais from './pages/VisualizarPaises';
import VisualizarContinente from './pages/VisualizarContinente';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/continentes" element={<Continentes />} />
        <Route path="/continentes/adicionar" element={<AdicionarContinente />} />
        <Route path="/continentes/editar/:id" element={<AdicionarContinente />} />
        <Route path="/continentes/visualizar/:id" element={<VisualizarContinente />}/>

        <Route path="/paises" element={<Paises />} />
        <Route path="/paises/adicionar" element={<AdicionarPais />} />
        <Route path="/paises/editar/:id" element={<AdicionarPais />} />
        <Route path="/paises/visualizar/:id" element={<VisualizarPais/>}/>

        <Route path="/cidades" element={<Cidades />} />
        <Route path="/cidades/adicionar" element={<AdicionarCidade />} />
        <Route path="/cidades/editar/:id" element={<AdicionarCidade />} />
        <Route path="/cidades/visualizar/:id" element={<VisualizarCidade />} /> 
      </Routes>
    </Router>
  );
};

export default App;
