import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/logs');
        setLogs(response.data);  // Assuming the logs are returned as an array of log objects
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, []);

  const handleAssignRole = async () => {
    if (!email) {
      alert('Please enter the email of the user');
      return;
    }

    try {
      // Send the email to the backend to assign the admin role
      const response = await axios.put('http://localhost:5000/api/admin/assign-role', { email });
      alert(response.data); // Show success message from backend
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Failed to assign admin role. Please check the email and try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <span className="username">Admin: {localStorage.getItem('email')}</span>
        <button className="logout-button" onClick={() => {
          localStorage.removeItem('token');
          window.location.reload();
        }}>Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="logs-section">
          <h3>Device Detection Logs</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>NRP</th>
                <th>Mata Kuliah</th>
                <th>RSSI</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.deviceId}</td>
                    <td>{log.nrp}</td>
                    <td>{log.mataKuliah}</td>
                    <td>{log.rssi}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No logs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="role-management-section">
          <h3>Assign Admin Role to Lecturer</h3>
          <div className="role-form">
            <input
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-assign-role" onClick={handleAssignRole}>
              Assign Admin Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
