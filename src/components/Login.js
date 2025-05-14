import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Login = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'guests'));
      const found = querySnapshot.docs.find(doc => doc.id === code);

      if (found) {
        localStorage.setItem('guestCode', code);
        navigate('/home', { state: { guestCode: code } });
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
  <div className={styles.container}>
    <div className={styles.card}>
      <h2 className={styles.title}>Welcome to Vehiman Guest Login</h2>
      <input
        type="text"
        placeholder="Enter Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLogin} className={styles.button}>
        Login as Guest
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  </div>
);

};

export default Login;
