import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import LoginRegisterTabs from './Components/LoginRegisterTabs';
import Homepage from './Components/Homepage';
import CityExplorerApp from './CityExplorerApp';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginRegisterTabs />} />
        <Route path="/app" element={<CityExplorerApp />} />
      </Routes>
    </Router>
  );
};

export default App;