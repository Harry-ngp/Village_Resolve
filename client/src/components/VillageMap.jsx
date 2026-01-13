import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  const defaultCenter = [21.1458, 79.0882];

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px' }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: '12px' }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Standard">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {issues.map((issue) => {
          const uniqueKey = issue._id || issue.id || Math.random();

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