
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
    icon?: 'default' | 'emergency' | 'sighting';
  }>;
  height?: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({ 
  center, 
  zoom = 13, 
  markers = [], 
  height = '400px',
  className = '' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create custom icons
    const emergencyIcon = L.divIcon({
      className: 'custom-emergency-marker',
      html: '<div class="w-6 h-6 bg-emergency rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const sightingIcon = L.divIcon({
      className: 'custom-sighting-marker',
      html: '<div class="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Add markers
    markers.forEach(marker => {
      let icon;
      if (marker.icon === 'emergency') {
        icon = emergencyIcon;
      } else if (marker.icon === 'sighting') {
        icon = sightingIcon;
      }

      const mapMarker = L.marker(marker.position, icon ? { icon } : {}).addTo(map);
      
      if (marker.popup) {
        mapMarker.bindPopup(marker.popup);
      }
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers]);

  return (
    <div 
      ref={mapRef} 
      style={{ height }}
      className={`rounded-lg shadow-lg ${className}`}
    />
  );
};

export default Map;
