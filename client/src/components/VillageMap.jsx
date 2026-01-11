import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // <--- THIS IMPORT IS CRITICAL FOR THE MAP TO SHOW
import L from 'leaflet';

// --- FIX: Default Marker Icons ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const VillageMap = ({ issues = [] }) => {
  // Default Center (Nagpur)
  const defaultCenter = [21.1458, 79.0882]; 

  return (
    // We use inline style for height to guarantee it works even if Tailwind fails
    <div style={{ height: '100%', width: '100%', minHeight: '500px' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", borderRadius: '12px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {issues.map((issue) => {
          // FIX: Handle both _id (MongoDB) and id, and check for valid coordinates
          const uniqueKey = issue._id || issue.id || Math.random();
          
          // If the issue has real lat/lng, use it. Otherwise, generate a random offset near Nagpur for demo.
          const position = (issue.lat && issue.lng) 
            ? [issue.lat, issue.lng] 
            : [21.1458 + (Math.random() * 0.04 - 0.02), 79.0882 + (Math.random() * 0.04 - 0.02)];

          return (
            <Marker key={uniqueKey} position={position}>
              <Popup>
                <div style={{ padding: '5px', minWidth: '150px' }}>
                  <span style={{ 
                    fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '10px', 
                    background: issue.status === 'Resolved' ? '#dcfce7' : '#ffedd5',
                    color: issue.status === 'Resolved' ? '#166534' : '#9a3412'
                  }}>
                    {issue.status || 'Pending'}
                  </span>
                  <h3 style={{ margin: '8px 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>{issue.title}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    {issue.location?.address || issue.location || "Unknown Location"}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default VillageMap;