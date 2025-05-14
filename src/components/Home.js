import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCar, FaTools } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    if (window.unsubscribeFirestoreListeners) {
      window.unsubscribeFirestoreListeners.forEach((unsub) => unsub());
      window.unsubscribeFirestoreListeners = [];
    }

    navigate('/');
  };

  const handleTileClick = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <span>Vehiman - Guest</span>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <main className="home-content">
        <div className="tiles-container">
          <div className="tile" onClick={() => handleTileClick('/profile')}>
            <FaUser className="tile-icon" />
            <span className="tile-label">Profile</span>
          </div>
          <div className="tile" onClick={() => handleTileClick('/vehicles')}>
            <FaCar className="tile-icon" />
            <span className="tile-label">Vehicles</span>
          </div>
          <div className="tile" onClick={() => handleTileClick('/damages')}>
            <FaTools className="tile-icon" />
            <span className="tile-label">Damages</span>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <div className="footer-top">
          Made by Vehiman developers with <span className="heart">❤️</span>
        </div>
        <div className="footer-bottom">
          © 2025 Vehiman. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
