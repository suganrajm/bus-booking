import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { User, Mail, Phone, Calendar, Bus, Trash2 } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await bookingService.getUserBookings();
        // Sort bookings by date descending
        data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setBookings(data);
      } catch (err) {
        setError('Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchHistory();
    }
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancelBooking(bookingId);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
    } catch(err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Permanently delete this cancelled booking?')) return;
    try {
      await bookingService.deleteBooking(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch(err) {
      alert('Failed to delete: ' + (err.response?.data || err.message));
    }
  };

  if (!user) return null;

  return (
    <div className="page-container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Sidebar Profile Info */}
      <div className="card glass-panel" style={{ flex: 1, minWidth: '300px', height: 'fit-content' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ marginTop: '1rem' }}>{user.name}</h2>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem' }}>{user.role}</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
            <Mail size={18} /> <span>{user.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
            <Phone size={18} /> <span>+1 234 567 890</span> {/* Hardcoded phone for now or user.phone if added to token */}
          </div>
        </div>
      </div>

      {/* Main Content Booking History */}
      <div style={{ flex: 3, minWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={24} color="var(--primary)" /> Booking History
        </h2>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
        
        {loading ? (
          <p>Loading history...</p>
        ) : bookings.length === 0 ? (
          <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No bookings found.</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Start your journey by making a new booking!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map(booking => (
              <div key={booking.id} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${booking.status === 'CONFIRMED' ? 'var(--success)' : 'var(--danger)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                   <div style={{ fontWeight: 'bold' }}>Booking ID: #{booking.id}</div>
                   <div style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: booking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: booking.status === 'CONFIRMED' ? 'var(--success)' : 'var(--danger)' }}>
                     {booking.status}
                   </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Route</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bus size={16}/> {booking.busRoute.route.source} → {booking.busRoute.route.destination}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Travel Date</div>
                    <div>{booking.busRoute?.departureTime ? new Date(booking.busRoute.departureTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Seats</div>
                    <div>{booking.seats.map(s => s.seatNumber).join(', ')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>${booking.totalAmount.toFixed(2)}</div>
                  </div>
                </div>

                {booking.status === 'CONFIRMED' && new Date(booking.busRoute.departureTime) > new Date() && (
                  <div style={{ textAlign: 'right', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleCancel(booking.id)}>
                      Cancel Booking
                    </button>
                  </div>
                )}
                {booking.status === 'CANCELLED' && (
                  <div style={{ textAlign: 'right', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button className="btn" style={{ color: '#888', borderColor: '#555', border: '1px solid #555', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'transparent' }} onClick={() => handleDelete(booking.id)}>
                      <Trash2 size={15} /> Remove from History
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
