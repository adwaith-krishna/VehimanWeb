import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Update path if needed
import { FaArrowLeft, FaExclamationTriangle, FaCar } from 'react-icons/fa';
import './Vehicle.css';

const Vehicle = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'vehicles'));
      const now = new Date();
      const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

      const vehicleList = snapshot.docs.map(doc => {
        const data = doc.data();
        const pollutionDate = data.pollutionDate?.toDate?.() || null;
        const insuranceDate = data.insuranceDate?.toDate?.() || null;

        const isExpiringSoon =
          (pollutionDate && pollutionDate < fiveDaysLater) ||
          (insuranceDate && insuranceDate < fiveDaysLater);

        return {
          id: doc.id,
          ...data,
          isExpiringSoon,
        };
      });

      setVehicles(vehicleList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCardClick = (vehicle) => {
    navigate('/vehicle-view', { state: { vehicle } });
  };

  return (
    <div className="vehicle-container">
      {/* Header */}
      <header className="vehicle-header">
        <button onClick={handleBack} className="back-button">
          <FaArrowLeft />
        </button>
        <h2>Vehicle Grid</h2>
      </header>

      {/* Main Content */}
      <main className="vehicle-content">
        {loading ? (
  <div className="loader"></div>
) : vehicles.length === 0 ? (
  <p>No vehicles found.</p>
) : (
  <div className="vehicle-grid">
    {vehicles.map((vehicle) => (
      <div
        key={vehicle.id}
        className="vehicle-card"
        onClick={() => handleCardClick(vehicle)}
      >
        {vehicle.isExpiringSoon && (
          <div className="warning-icon">
            <FaExclamationTriangle />
          </div>
        )}
        {vehicle.imagePath ? (
          <img src={vehicle.imagePath} alt="Vehicle" />
        ) : (
          <FaCar className="vehicle-placeholder" />
        )}
        <div className="vehicle-info">
          <h3>{vehicle.vehicleName || 'Unknown'}</h3>
          <p>{vehicle.vehicleNumber || 'N/A'}</p>
          <p
            style={{
              color: vehicle.status === 'Available' ? 'green' : 'red',
            }}
          >
            {vehicle.status || 'Unknown'}
          </p>
        </div>
      </div>
    ))}
  </div>
)}
      </main>

      {/* Footer */}
      <footer className="vehicle-footer">
        <p>Made by Vehiman developers with ❤️</p>
        <p>© 2025 Vehiman. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Vehicle;
