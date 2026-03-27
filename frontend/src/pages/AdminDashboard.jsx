import React, { useState, useEffect } from 'react';
import { busService } from '../services/busService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bus');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);

  const [busData, setBusData] = useState({ busNumber: '', operatorName: '', totalSeats: '', type: 'AC SEATER' });
  const [routeData, setRouteData] = useState({ source: '', destination: '', distance: '' });
  const [scheduleData, setScheduleData] = useState({ busId: '', routeId: '', travelDate: '', fare: '' });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [b, r, s, u] = await Promise.all([
        busService.getAllBuses(),
        busService.getAllRoutes(),
        busService.getAllSchedules(),
        busService.getAllUsers()
      ]);
      setBuses(b);
      setRoutes(r);
      setSchedules(s);
      setUsers(u);
    } catch (err) {
      console.error('Failed to load data:', err);
      setMessage({ type: 'error', text: 'Failed to load data from server. Please make sure the backend is running.' });
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleCreateBus = async (e) => {
    e.preventDefault();
    try {
      await busService.addBus({ ...busData, totalSeats: Number(busData.totalSeats) });
      showMessage('success', 'Bus added!');
      setBusData({ busNumber: '', operatorName: '', totalSeats: '', type: 'AC SEATER' });
      loadAll();
    } catch (err) {
      showMessage('error', err.response?.data || 'Failed to add bus');
    }
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    try {
      await busService.addRoute({ ...routeData, distance: Number(routeData.distance) });
      showMessage('success', 'Route added!');
      setRouteData({ source: '', destination: '', distance: '' });
      loadAll();
    } catch (err) {
      showMessage('error', err.response?.data || 'Failed to add route');
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await busService.addSchedule({
        busId: Number(scheduleData.busId),
        routeId: Number(scheduleData.routeId),
        departureTime: scheduleData.travelDate + 'T00:00:00',
        arrivalTime: scheduleData.travelDate + 'T23:59:59',
        fare: Number(scheduleData.fare)
      });
      showMessage('success', 'Schedule published!');
      setScheduleData({ busId: '', routeId: '', travelDate: '', fare: '' });
      loadAll();
    } catch (err) {
      showMessage('error', err.response?.data || 'Failed to create schedule');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      if (type === 'bus') await busService.deleteBus(id);
      else if (type === 'route') await busService.deleteRoute(id);
      else if (type === 'schedule') await busService.deleteSchedule(id);
      else if (type === 'user') await busService.deleteUser(id);
      showMessage('success', `${type.charAt(0).toUpperCase() + type.slice(1)} deleted.`);
      loadAll();
    } catch (err) {
      showMessage('error', err.response?.data || `Failed to delete ${type}`);
    }
  };

  const tabStyle = (tab) => ({
    padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
    backgroundColor: activeTab === tab ? 'var(--primary, #5c6bc0)' : 'transparent',
    color: activeTab === tab ? 'white' : 'var(--text-muted, #888)',
    borderBottom: activeTab === tab ? '3px solid var(--primary, #5c6bc0)' : '3px solid transparent'
  });

  const deleteBtn = { backgroundColor: '#d93025', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 14px', cursor: 'pointer', fontWeight: 600 };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🛠️ Admin Dashboard</h2>

      <div style={{ display: 'flex', gap: '5px', marginBottom: '25px', borderBottom: '1px solid #ddd' }}>
        <button style={tabStyle('bus')} onClick={() => setActiveTab('bus')}>🚌 Buses</button>
        <button style={tabStyle('route')} onClick={() => setActiveTab('route')}>🗺️ Routes</button>
        <button style={tabStyle('schedule')} onClick={() => setActiveTab('schedule')}>📅 Schedules</button>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>👥 Users</button>
      </div>

      {message.text && (
        <div style={{ padding: '12px 18px', marginBottom: '20px', borderRadius: '6px',
          backgroundColor: message.type === 'error' ? '#fbeaea' : '#eafbf0',
          color: message.type === 'error' ? '#d93025' : '#1e8e3e', fontWeight: 500 }}>
          {message.text}
        </div>
      )}

      {/* BUS TAB */}
      {activeTab === 'bus' && (
        <div>
          <form onSubmit={handleCreateBus} style={{ background: 'var(--card-bg, #1e2236)', borderRadius: '10px', padding: '20px', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: 0 }}>Add New Bus</h3>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Bus Number</label>
                <input className="form-control" required placeholder="MH-12-AB-1234" value={busData.busNumber} onChange={e => setBusData({...busData, busNumber: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Operator Name</label>
                <input className="form-control" required placeholder="VRL Travels" value={busData.operatorName} onChange={e => setBusData({...busData, operatorName: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Total Seats</label>
                <input className="form-control" type="number" required min="10" max="60" value={busData.totalSeats} onChange={e => setBusData({...busData, totalSeats: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Bus Type</label>
                <select className="form-control" value={busData.type} onChange={e => setBusData({...busData, type: e.target.value})}>
                  <option>AC SEATER</option><option>NON_AC SEATER</option><option>AC SLEEPER</option><option>NON_AC SLEEPER</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Bus</button>
          </form>
          <h3>Existing Buses ({buses.length})</h3>
          {buses.length === 0 ? <p style={{ color: '#888' }}>No buses added yet.</p> : buses.map(b => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '8px', background: 'var(--card-bg, #1e2236)', marginBottom: '10px' }}>
              <div><strong>{b.operatorName}</strong> &mdash; {b.busNumber} <span style={{ color: '#888', fontSize: '13px' }}>| {b.type} | {b.totalSeats} seats</span></div>
              <button style={deleteBtn} onClick={() => handleDelete('bus', b.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* ROUTE TAB */}
      {activeTab === 'route' && (
        <div>
          <form onSubmit={handleCreateRoute} style={{ background: 'var(--card-bg, #1e2236)', borderRadius: '10px', padding: '20px', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: 0 }}>Add New Route</h3>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Source City</label>
                <input className="form-control" required value={routeData.source} onChange={e => setRouteData({...routeData, source: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Destination City</label>
                <input className="form-control" required value={routeData.destination} onChange={e => setRouteData({...routeData, destination: e.target.value})} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4 }}>Distance (KM)</label>
              <input className="form-control" type="number" required step="0.1" value={routeData.distance} onChange={e => setRouteData({...routeData, distance: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Save Route</button>
          </form>
          <h3>Existing Routes ({routes.length})</h3>
          {routes.length === 0 ? <p style={{ color: '#888' }}>No routes added yet.</p> : routes.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '8px', background: 'var(--card-bg, #1e2236)', marginBottom: '10px' }}>
              <div><strong>{r.source}</strong> → <strong>{r.destination}</strong> <span style={{ color: '#888', fontSize: '13px' }}>| {r.distance} km</span></div>
              <button style={deleteBtn} onClick={() => handleDelete('route', r.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* SCHEDULE TAB */}
      {activeTab === 'schedule' && (
        <div>
          <form onSubmit={handleCreateSchedule} style={{ background: 'var(--card-bg, #1e2236)', borderRadius: '10px', padding: '20px', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: 0 }}>Publish New Schedule</h3>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Bus</label>
                <select className="form-control" required value={scheduleData.busId} onChange={e => setScheduleData({...scheduleData, busId: e.target.value})}>
                  <option value="">-- Choose Bus --</option>
                  {buses.map(b => <option key={b.id} value={b.id}>{b.operatorName} ({b.busNumber})</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Route</label>
                <select className="form-control" required value={scheduleData.routeId} onChange={e => setScheduleData({...scheduleData, routeId: e.target.value})}>
                  <option value="">-- Choose Route --</option>
                  {routes.map(r => <option key={r.id} value={r.id}>{r.source} → {r.destination}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Travel Date</label>
                <input className="form-control" type="date" required value={scheduleData.travelDate} onChange={e => setScheduleData({...scheduleData, travelDate: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Fare (₹)</label>
                <input className="form-control" type="number" required min="1" step="1" value={scheduleData.fare} onChange={e => setScheduleData({...scheduleData, fare: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Publish Schedule</button>
          </form>

          <h3>Published Schedules ({schedules.length})</h3>
          {schedules.length === 0 ? <p style={{ color: '#888' }}>No schedules published yet.</p> : schedules.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '8px', background: 'var(--card-bg, #1e2236)', marginBottom: '10px' }}>
              <div>
                <strong>{s.bus?.operatorName}</strong> &mdash; {s.route?.source} → {s.route?.destination}
                <span style={{ color: '#888', fontSize: '13px', marginLeft: '10px' }}>
                  | {s.departureTime ? new Date(s.departureTime).toLocaleDateString() : 'N/A'}
                  | ₹{s.fare}
                </span>
              </div>
              <button style={deleteBtn} onClick={() => handleDelete('schedule', s.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div>
          <h3>Registered Users ({users.length})</h3>
          {users.length === 0 ? <p style={{ color: '#888' }}>No users found.</p> : users.map(u => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '8px', background: 'var(--card-bg, #1e2236)', marginBottom: '10px' }}>
              <div>
                <strong>{u.name}</strong> 
                <span style={{ color: '#888', fontSize: '13px', marginLeft: '10px' }}>
                  | {u.email} | {u.role} | {u.phone || 'No Phone'}
                </span>
              </div>
              {u.role !== 'ROLE_ADMIN' && (
                <button style={deleteBtn} onClick={() => handleDelete('user', u.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
