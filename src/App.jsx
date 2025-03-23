import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import IndexPage from './pages/IndexPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';     // Add this
import ResultsPage from './components/ResultsPage';   // Add this
import Home from './components/Home';
import StatePage from './components/StatePage';
import CityPage from './components/CityPage';
import Dashboard from './components/Dashboard';
import StateResultsPage from './components/StateResultsPage'; 
import TimerProtectedRoute from './components/TimerProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/register" element={
          <TimerProtectedRoute>
            <RegisterPage />
          </TimerProtectedRoute>
        } />
        <Route path="/login" element={
          <TimerProtectedRoute>
            <LoginPage />
          </TimerProtectedRoute>
        } />
        <Route path="/home" element={<Home />} />
        <Route path="/state/:stateName" element={<StatePage />} />
        <Route path="/state/:stateName/city/:cityName" element={<CityPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<ResultsPage />} /> {/* Add this */}
        <Route path="/results-by-state" element={<StateResultsPage />} /> {/* Add the new route */}
        
        </Routes>
    </Router>
  );
};

export default App;