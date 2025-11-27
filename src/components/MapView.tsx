import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SiteInfoCard from './SiteInfoCard';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface SiteData {
  lat: number;
  lng: number;
  name: string;
  score: number;
  factors: {
    waterSource: { status: 'good' | 'warning' | 'bad'; detail: string };
    seismicActivity: { status: 'good' | 'warning' | 'bad'; detail: string };
    populationDensity: { status: 'good' | 'warning' | 'bad'; detail: string };
    gridConnection: { status: 'good' | 'warning' | 'bad'; detail: string };
    infrastructure: { status: 'good' | 'warning' | 'bad'; detail: string };
    environmentalImpact: { status: 'good' | 'warning' | 'bad'; detail: string };
  };
}

const myanmarCities = [
  { name: 'Naypyidaw', lat: 19.7633, lng: 96.0785 },
  { name: 'Yangon', lat: 16.8661, lng: 96.1951 },
  { name: 'Mandalay', lat: 21.9588, lng: 96.0891 },
  { name: 'Bago', lat: 17.3355, lng: 96.4807 },
  { name: 'Mawlamyine', lat: 16.4905, lng: 97.6278 },
];

const generateSiteData = (name: string, lat: number, lng: number): SiteData => {
  const scores: Record<string, number> = {
    'Naypyidaw': 72,
    'Yangon': 65,
    'Mandalay': 78,
    'Bago': 68,
    'Mawlamyine': 70,
  };

  const waterData: Record<string, { status: 'good' | 'warning' | 'bad'; detail: string }> = {
    'Naypyidaw': { status: 'good', detail: 'Ayeyarwady River: 5 km' },
    'Yangon': { status: 'good', detail: 'Yangon River: 2 km' },
    'Mandalay': { status: 'good', detail: 'Ayeyarwady River: 3 km' },
    'Bago': { status: 'warning', detail: 'Bago River: 8 km' },
    'Mawlamyine': { status: 'good', detail: 'Thanlwin River: 1 km' },
  };

  return {
    lat,
    lng,
    name,
    score: scores[name] || 70,
    factors: {
      waterSource: waterData[name] || { status: 'good', detail: 'River: 5 km' },
      seismicActivity: { status: 'good', detail: 'Low Risk Zone' },
      populationDensity: name === 'Yangon' ? 
        { status: 'warning', detail: 'Medium (500k)' } : 
        { status: 'good', detail: 'Low (<100k)' },
      gridConnection: { status: 'good', detail: 'Existing Substation: 20 km' },
      infrastructure: { status: 'good', detail: 'Major Road/Port' },
      environmentalImpact: { status: 'good', detail: 'Minimal Impact' },
    },
  };
};

export default function MapView({ smrModel }: { smrModel: string }) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedSite, setSelectedSite] = useState<SiteData | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([21.9162, 95.9560], 6);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add city markers
    myanmarCities.forEach((city) => {
      const marker = L.marker([city.lat, city.lng])
        .addTo(map)
        .bindPopup(`<div class="font-semibold text-sm">${city.name}</div>`);
      
      marker.on('click', () => {
        const siteData = generateSiteData(city.name, city.lat, city.lng);
        setSelectedSite(siteData);
      });

      markersRef.current.push(marker);
    });

    // Add click handler for map
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Find nearest city
      let nearestCity = myanmarCities[0];
      let minDistance = Infinity;

      myanmarCities.forEach(city => {
        const distance = Math.sqrt(
          Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestCity = city;
        }
      });

      const siteData = generateSiteData(nearestCity.name, lat, lng);
      setSelectedSite(siteData);
    });

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full bg-map-bg rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainerRef} className="h-full w-full" />

      {selectedSite && (
        <div className="absolute top-4 right-4 z-[1000]">
          <SiteInfoCard 
            data={selectedSite} 
            onClose={() => setSelectedSite(null)}
            smrModel={smrModel}
          />
        </div>
      )}
    </div>
  );
}