import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';

const Home = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (source && destination && travelDate) {
      navigate('/search', { state: { source, destination, travelDate } });
    }
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Your Journey Starts Here</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            Book bus tickets anywhere, anytime with ease.
          </p>
          
          <div className="card glass-panel" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '1.5rem 2rem' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label className="form-label">Leaving From</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ paddingLeft: '2.5rem' }} 
                    placeholder="Source City"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '200px' }}>
                <label className="form-label">Going To</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ paddingLeft: '2.5rem' }} 
                    placeholder="Destination City"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '180px' }}>
                <label className="form-label">Date of Journey</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="date" 
                    className="form-control" 
                    style={{ paddingLeft: '2.5rem' }} 
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                <Search size={18} /> Search Buses
              </button>
            </form>
          </div>
        </div>
      </section>
      
      <section className="page-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Why Choose Us?</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
          <div className="card" style={{ flex: 1, minWidth: '250px' }}>
            <h3 style={{ color: 'var(--primary)' }}>Secure Booking</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Your transactions are safe and encrypted.</p>
          </div>
          <div className="card" style={{ flex: 1, minWidth: '250px' }}>
            <h3 style={{ color: 'var(--primary)' }}>Real-time Tracking</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Track your bus location and ETA accurately.</p>
          </div>
          <div className="card" style={{ flex: 1, minWidth: '250px' }}>
            <h3 style={{ color: 'var(--primary)' }}>24/7 Support</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>We are here to help you anytime, anywhere.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
