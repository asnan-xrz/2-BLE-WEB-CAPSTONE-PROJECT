import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LecturerDashboard = () => {
  const [devices, setDevices] = useState([]);

  // Fungsi untuk melakukan clear log dan update data setiap 5 detik
  const fetchData = async () => {
    try {
      // Clear log (Reset data)
      setDevices([]);  // Ini akan memastikan data dihapus di state frontend

      // Menambahkan random query parameter untuk cache busting (menjamin data baru ditarik)
      const response = await axios.get('http://localhost:5000/api/lecturer/devices', {
        params: { cacheBuster: new Date().getTime() }
      });

      // Update state dengan data terbaru
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  // Effect untuk melakukan scan setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(); // Scan and update data every 5 seconds
    }, 5000); // 5000ms = 5 seconds

    // Clean up interval ketika komponen unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Lecturer Dashboard</h2>

      <div className="devices-section">
        <h3>Detected Devices</h3>
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
            {devices.length > 0 ? (
              devices.map((device, index) => (
                <tr key={index}>
                  <td>{device.deviceId}</td>
                  <td>{device.nrp}</td>
                  <td>{device.mataKuliah}</td>
                  <td>{device.rssi}</td>
                  <td>{new Date(device.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No devices detected</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LecturerDashboard;
