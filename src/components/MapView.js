import React, { useEffect, useRef, memo } from 'react';

const MapView = memo(({ coordinates }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!coordinates) return;

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.onload = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      mapInstanceRef.current = window.L.map(mapRef.current).setView(
        [coordinates.lat, coordinates.lng],
        13
      );

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      window.L.marker([coordinates.lat, coordinates.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup('Target Location')
        .openPopup();
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, [coordinates]);

  if (!coordinates) return null;

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" />
    </div>
  );
});

export default MapView; 