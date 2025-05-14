import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [issueText, setIssueText] = useState('');
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

  const handleLogout = () => {
    localStorage.removeItem('guestCode');
    navigate('/');
  };

  const handleReportIssue = () => {
    setShowPopup(true);
  };

  const handleSubmitIssue = async () => {
    if (!issueText.trim()) return;

    try {
      await addDoc(collection(db, 'reports'), {
        guestCode: guestCode,
        name: user.name,
        issue: issueText,
        timestamp: serverTimestamp(),
      });

      setIssueSubmitted(true);
      setIssueText('');

      setTimeout(() => {
        setIssueSubmitted(false);
        setShowPopup(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!guestCode) {
        navigate('/login');
        return;
      }

      try {
        const guestsRef = collection(db, 'guests');
        const q = query(guestsRef, where('code', '==', guestCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUser(userData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [guestCode, navigate]);

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h2>Profile</h2>
      </header>

      <main className="profile-content">
        <div className="profile-card">
          <div className="profile-icon">
            <FaUserCircle size={80} color="rgb(108, 189, 181)" />
          </div>
          <h3>{user.name}</h3>
          <p>{user.mobile}</p>
          {user.days && <p>Days: {user.days}</p>}
        </div>

        <div className="profile-buttons">
          <button className="report-issue" onClick={handleReportIssue}>
            Report Issue
          </button>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </main>

      <footer className="profile-footer">
        <p>Made by Vehiman developers with ❤️</p>
        <p>© 2025 Vehiman. All rights reserved.</p>
      </footer>

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal">
            {issueSubmitted ? (
              <div className="submission-success">
                <span className="checkmark">✅</span>
                <p>Submitted</p>
              </div>
            ) : (
              <>
                <h3>Report an Issue</h3>
                <textarea
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder="Describe the issue..."
                />
                <div className="modal-actions">
                  <button onClick={handleSubmitIssue}>Submit</button>
                  <button onClick={() => setShowPopup(false)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
