import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Mode from './components/Mode';
import PeerMode from './components/PeerMode';
import ContestMode from './components/ContestMode';
import ContestPage from './components/ContestPage';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Excluded routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/mode/contest-mode/contest-page/:id" element={<ContestPage />} />

        {/* Routes with NavBar */}
        <Route element={<Layout />}>
          <Route path="/mode" element={<Mode />} />
          <Route path="/mode/contest-mode" element={<ContestMode />} />
          <Route path="/mode/peer-mode" element={<PeerMode />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
