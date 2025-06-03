import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResearchBoardPage from './pages/ResearchBoardPage';
import DorkingLabPage from './pages/DorkingLabPage';
import { ResearchBoardProvider } from './context/ResearchBoardContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ResearchBoardProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="research-board" element={<ResearchBoardPage />} />
            <Route path="dorking-lab" element={<DorkingLabPage />} />
            <Route path="category/:categoryName" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ResearchBoardProvider>
    </BrowserRouter>
  );
}

export default App; 