import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginRegisterTabs from './LoginComp/LoginRegisterTabs'; // Ensure the path is correct


function App() {
  return (
    <Router>
      <Routes>
        {/* Login/Register page route */}
        <Route path="/login" element={<LoginRegisterTabs />} />
      </Routes>
    </Router>
  );
}

export default App;
