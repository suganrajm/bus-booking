import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { Check, X, ShieldCheck } from 'lucide-react';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const busRoute = location.state?.busRoute;

  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!busRoute) {
      navigate('/');
      return;
    }

    const fetchBookedSeats = async () => {
      try {
        const seats = await bookingService.getBookedSeats(scheduleId);
        setBookedSeats(seats || []);
      } catch (err) {
        setError('Failed to fetch seat availability');
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [scheduleId, busRoute, navigate]);

  if (!busRoute) return null;

  // Simple layout 4 seats per row
  const renderSeats = () => {
    const totalSeats = busRoute.bus.totalSeats;
    const rows = Math.ceil(totalSeats / 4);
    const seatGrid = [];

    for (let r = 1; r <= rows; r++) {
      const rowSeats = [];
      for (let s = 1; s <= 4; s++) {
        const seatNo = `R${r}-S${s}`;
        const isBooked = bookedSeats.includes(seatNo);
        const isSelected = selectedSeats.includes(seatNo);

        rowSeats.push(
          <button
            key={seatNo}
            disabled={isBooked}
            className={`seat-btn ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
            title={seatNo}
            onClick={() => {
              if (isSelected) {
                setSelectedSeats(selectedSeats.filter(sId => sId !== seatNo));
              } else {
                setSelectedSeats([...selectedSeats, seatNo]);
              }
            }}
          >
            {s}
          </button>
        );
        
        if (s === 2) {
          rowSeats.push(<div key={`aisle-${r}`} className="aisle"></div>); // Aisle
        }
      }
      seatGrid.push(<div key={r} className="seat-row">{rowSeats}</div>);
    }
    return seatGrid;
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    
    setBookingLoading(true);
    setError('');
    try {
      await bookingService.createBooking({
        busRouteId: scheduleId,
        seatNumbers: selectedSeats
      });
      setSuccess('Booking successful! Redirecting to your profile...');
      setTimeout(() => navigate('/profile'), 2500);
    } catch (err) {
      setError('Failed to book seats. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const totalFare = selectedSeats.length * busRoute.fare;

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '2rem' }}>Seat Selection</h2>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{success}</div>}

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        
        {/* Seat Map */}
        <div className="card" style={{ flex: 2, minWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="seat-btn available" style={{ width: '24px', height: '24px' }}></div> Available</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="seat-btn selected" style={{ width: '24px', height: '24px' }}></div> Selected</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="seat-btn booked" style={{ width: '24px', height: '24px' }}></div> Booked</div>
          </div>

          {loading ? (
             <p>Loading seat map...</p>
          ) : (
            <div className="bus-layout">
              <div className="driver-wheel" style={{ textAlign: 'right', marginBottom: '1.5rem', paddingRight: '2rem', fontSize: '1.5rem' }}>🛞 DRIVER</div>
              {renderSeats()}
            </div>
          )}
        </div>

        {/* Booking Summary */}
        <div className="card" style={{ flex: 1, minWidth: '300px', height: 'fit-content' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>Booking Summary</h3>
          <div style={{ marginBottom: '1.5rem', lineHeight: '2' }}>
            <div><strong>Bus:</strong> {busRoute.bus.operatorName} ({busRoute.bus.type})</div>
            <div><strong>Route:</strong> {busRoute.route.source} to {busRoute.route.destination}</div>
            <div><strong>Date:</strong> {new Date(busRoute.departureTime).toLocaleString()}</div>
            <div><strong>Fare per seat:</strong> ${busRoute.fare}</div>
          </div>
          
          <div style={{ marginBottom: '1.5rem', minHeight: '50px' }}>
            <strong>Selected Seats:</strong> 
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
               {selectedSeats.length === 0 ? <span style={{ color: 'var(--text-muted)' }}>None selected</span> : 
                 selectedSeats.map(s => <span key={s} style={{ background: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem' }}>{s}</span>)
               }
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span>Total Amount:</span>
            <span>${totalFare.toFixed(2)}</span>
          </div>

          <button 
            className="btn btn-primary btn-block" 
            disabled={selectedSeats.length === 0 || bookingLoading || success}
            onClick={handleBooking}
          >
            {bookingLoading ? 'Processing...' : success ? <><Check size={18} /> Confirmed</> : <><ShieldCheck size={18}/> Pay & Book</>}
          </button>
        </div>
      </div>

      <style>{`
        .bus-layout {
          border: 2px solid var(--border-color);
          border-radius: 20px 20px 10px 10px;
          padding: 2rem;
          background: rgba(0,0,0,0.2);
        }
        .seat-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
          justify-content: center;
        }
        .aisle {
          width: 2.5rem;
        }
        .seat-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px 8px 4px 4px;
          border: none;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
        }
        .available {
          background-color: var(--surface);
          border: 1px solid var(--text-muted);
          color: var(--text-main);
        }
        .available:hover {
          background-color: rgba(255,255,255,0.1);
        }
        .selected {
          background-color: var(--primary);
          color: white;
          border: none;
        }
        .booked {
          background-color: var(--danger);
          color: rgba(255,255,255,0.5);
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default Booking;
