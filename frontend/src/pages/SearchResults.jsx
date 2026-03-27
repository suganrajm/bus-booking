import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { busService } from '../services/busService';
import { Clock, Users } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state;
  
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!searchParams) {
      navigate('/');
      return;
    }

    const fetchBuses = async () => {
      try {
        const data = await busService.searchBuses(searchParams);
        setBuses(data);
      } catch (err) {
        setError('Failed to fetch buses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [searchParams, navigate]);

  if (loading) return <div className="page-container" style={{ textAlign: 'center', marginTop: '5rem' }}><h3>Searching for available buses...</h3></div>;
  if (error) return <div className="page-container" style={{ textAlign: 'center', color: 'var(--danger)', marginTop: '5rem' }}><h3>{error}</h3></div>;

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Available Buses</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {searchParams?.source} to {searchParams?.destination} on {searchParams?.travelDate}
        </p>
      </div>

      {buses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No buses found for this route and date.</h3>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
            Modify Search
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {buses.map((busRoute) => {
            const departure = new Date(busRoute.departureTime);
            const arrival = new Date(busRoute.arrivalTime);
            
            return (
              <div key={busRoute.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem' }}>{busRoute.bus.operatorName}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={16} /> 
                      {departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>|</span>
                    <span>{busRoute.bus.type}</span>
                    <span>|</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={16}/> {busRoute.bus.totalSeats} seats total</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                    ${busRoute.fare}
                  </div>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => navigate(`/book/${busRoute.id}`, { state: { busRoute } })}
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
