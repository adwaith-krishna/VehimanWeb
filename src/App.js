import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import DamagePage from './components/DamagePage'; // Import the DamagePage component
import Vehicle from './components/Vehicle';
import VehicleView from './components/VehicleView';

// Import other components like Login, Vehicles, etc.

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/damages" element={<DamagePage previousPage="home" />} /> {/* Pass the previousPage prop */}
        <Route path="/vehicles" element={<Vehicle />} />
        <Route path="/vehicle-view" element={<VehicleView />} />
      </Routes>
    </Router>
  );
}

export default App;
