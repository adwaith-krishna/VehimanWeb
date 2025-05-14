import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import './VehicleView.css';

const VehicleView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicleData = location.state?.vehicle;
  const previousPage = location.state?.previousPage;
  const [reservations, setReservations] = useState([]);

  const guestCode = localStorage.getItem('guestCode');
  const guestName = localStorage.getItem('guestName') || 'Guest';

  useEffect(() => {
    if (!vehicleData) {
      navigate('/vehicles');
      return;
    }

    const fetchReservations = async () => {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'reservations'),
        where('vehicle', '==', vehicleData.vehicleNumber)
      );
      const querySnapshot = await getDocs(q);
      const filtered = querySnapshot.docs.filter(doc => {
        const start = doc.data().startDateTime;
        return start?.startsWith(today);
      });
      setReservations(filtered.map(doc => doc.data()));
    };

    fetchReservations();
  }, [vehicleData, navigate]);

  const takeVehicle = async () => {
    const purpose = prompt('Enter purpose (e.g., Work, Personal):');
    if (!purpose || !guestCode) return;

    const guestDisplayName = guestName !== 'Guest' ? guestName : prompt('Enter your name:') || 'Guest';

    try {
      await updateDoc(doc(db, 'vehicles', vehicleData.id), { status: 'Taken' });
      await addDoc(collection(db, 'history'), {
        vehicleName: vehicleData.vehicleName,
        vehicleNumber: vehicleData.vehicleNumber,
        takenBy: `${guestDisplayName} (Guest)`,
        takenByGuestCode: guestCode,
        purpose,
        timestamp: serverTimestamp(),
        deliveredAt: null,
      });
      alert('Vehicle taken successfully.');
      navigate('/vehicles');
    } catch (error) {
      console.error(error);
      alert('Error taking vehicle.');
    }
  };

  const deliverVehicle = async () => {
    try {
      const q = query(
        collection(db, 'history'),
        where('vehicleName', '==', vehicleData.vehicleName),
        where('vehicleNumber', '==', vehicleData.vehicleNumber),
        where('deliveredAt', '==', null),
        where('takenByGuestCode', '==', guestCode)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert('No active record found or unauthorized delivery.');
        return;
      }

      await updateDoc(doc(db, 'vehicles', vehicleData.id), { status: 'Available' });
      await updateDoc(snapshot.docs[0].ref, { deliveredAt: serverTimestamp() });
      alert('Vehicle delivered.');
      navigate('/vehicles');
    } catch (err) {
      console.error(err);
      alert('Error delivering vehicle.');
    }
  };

  if (!vehicleData) return null;

  return (
    <div className="vehicle-view-page">
      {/* Header with Back Button */}
      <header className="vehicle-view-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1>Vehicle Details</h1>
      </header>

      {/* Main Content */}
      <div className="vehicle-view-container">
        {/* Vehicle Card */}
        <div className="vehicle-card">
          <h2 className="vehicle-card-title">{vehicleData.vehicleName}</h2>
          <p className="vehicle-card-number">{vehicleData.vehicleNumber}</p>
          <div className="vehicle-info">
            <p><strong>Fuel Type:</strong> {vehicleData.fuelType || 'N/A'}</p>
            <p><strong>Insurance Date:</strong> {formatDate(vehicleData.insuranceDate)}</p>
            <p><strong>Pollution Date:</strong> {formatDate(vehicleData.pollutionDate)}</p>
            {vehicleData.damage && vehicleData.damage !== '-' && (
              <p><strong>Damage:</strong> {vehicleData.damage}</p>
            )}
          </div>
        </div>

        {/* Reservation Info */}
        <div className="reservations-section">
          <h3>Today's Reservations</h3>
          {reservations.length === 0 ? (
            <p>No reservations for today.</p>
          ) : (
            <ul>
              {reservations.map((res, idx) => (
                <li key={idx}>
                  <p><strong>Reserved By:</strong> {res.reservedFor}</p>
                  <p><strong>Purpose:</strong> {res.purpose}</p>
                  <p><strong>Start:</strong> {formatDateTime(res.startDateTime)}</p>
                  <p><strong>End:</strong> {formatDateTime(res.endDateTime)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buttons */}
        <div className="vehicle-buttons">
          <button
            onClick={takeVehicle}
            disabled={vehicleData.status === 'Taken' && previousPage !== 'admin'}
          >
            Take
          </button>
          <button
            onClick={deliverVehicle}
            disabled={vehicleData.status === 'Available'}
          >
            Deliver
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="vehicle-view-footer">
        <p>Made by Vehiman developers with ❤️</p>
        <p>© 2025 Vehiman. All rights reserved.</p>
      </footer>
    </div>
  );
};

const formatDate = raw => {
  if (!raw) return 'N/A';
  const date = new Date(raw.seconds ? raw.seconds * 1000 : raw);
  return date.toLocaleDateString();
};

const formatDateTime = raw => {
  if (!raw) return 'N/A';
  const date = new Date(raw);
  return date.toLocaleString();
};

export default VehicleView;
