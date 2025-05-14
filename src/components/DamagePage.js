import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { FaArrowLeft, FaCar } from 'react-icons/fa';
import './DamagePage.css';

const DamagePage = ({ previousPage }) => {
  const [vehicles, setVehicles] = useState([]);
  const [damageRecords, setDamageRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [damageText, setDamageText] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const navigate = useNavigate();

  const guestCode = localStorage.getItem('guestCode');

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
        const vehiclesData = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().vehicleName,
          number: doc.data().vehicleNumber
        }));
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    const fetchDamageRecords = async () => {
      try {
        const damageSnapshot = await getDocs(
          query(collection(db, 'vehicles'), where('damage', '!=', '-'))
        );
        const damageData = damageSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDamageRecords(damageData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching damage records:', error);
        setLoading(false);
      }
    };

    fetchVehicles();
    fetchDamageRecords();
  }, []);

  const handleSubmitDamage = async () => {
    if (damageText.trim() && reportedBy.trim()) {
      try {
        const vehicleRef = doc(db, 'vehicles', selectedVehicle);
        await updateDoc(vehicleRef, {
          damage: damageText,
          reportedBy: reportedBy,
          timestamp: serverTimestamp()
        });
        setIssueSubmitted(true);
        setDamageText('');
        setReportedBy('');
        setSelectedVehicle('');
        setTimeout(() => setIssueSubmitted(false), 2000);
        setShowPopup(false);
      } catch (error) {
        console.error('Error submitting damage:', error);
        alert('Failed to submit damage.');
      }
    }
  };

  const handleDeleteDamage = async (id) => {
    try {
      const vehicleRef = doc(db, 'vehicles', id);
      await updateDoc(vehicleRef, {
        damage: '-',
        reportedBy: ''
      });
      alert('Damage record deleted successfully.');
      setDamageRecords(damageRecords.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting damage:', error);
      alert('Failed to delete damage.');
    }
  };

  return (
    <div className="damage-container">
      <header className="damage-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h2>Damages</h2>
      </header>

      <main className="damage-content">
        <div className="damage-list">
          {loading ? (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {damageRecords.length === 0 ? (
                <p>No damage records found.</p>
              ) : (
                damageRecords.map(record => (
                  <div className="damage-item" key={record.id}>
                    <FaCar size={30} color="red" />
                    <div className="damage-details">
                      <h3>{record.vehicleName}</h3>
                      <p>Damage: {record.damage}</p>
                      <p>Reported by: {record.reportedBy || 'Unknown'}</p>
                    </div>
                    <div className="damage-actions">
                      <p>{record.vehicleNumber}</p>
                      {previousPage === 'admin' && (
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteDamage(record.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        <div className="damage-footer">
          <button className="report-issue" onClick={() => setShowPopup(true)}>
            Add Damage
          </button>
        </div>
      </main>

      {/* ✅ Footer element added below */}
      <footer className="footer-bottom">
  <p>Made by Vehiman Developers with love ❤️</p>
  <p>© 2025 Vehiman. All rights reserved.</p>
</footer>


      {showPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter Damage Details</h3>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.number})
                </option>
              ))}
            </select>
            <textarea
              value={damageText}
              onChange={(e) => setDamageText(e.target.value)}
              placeholder="Damage Description"
            />
            <input
              type="text"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              placeholder="Reported By"
            />
            <div className="modal-actions">
              <button onClick={handleSubmitDamage}>Submit</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DamagePage;
