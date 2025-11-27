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
    seismicHazard: { status: 'good' | 'warning' | 'bad'; detail: string };
    floodRisk: { status: 'good' | 'warning' | 'bad'; detail: string };
    waterSource: { status: 'good' | 'warning' | 'bad'; detail: string };
    populationDensity: { status: 'good' | 'warning' | 'bad'; detail: string };
    gridConnection: { status: 'good' | 'warning' | 'bad'; detail: string };
    infrastructure: { status: 'good' | 'warning' | 'bad'; detail: string };
  };
}

const myanmarCities = [
  { name: 'Naypyidaw', lat: 19.7633, lng: 96.0785 },
  { name: 'Yangon', lat: 16.8661, lng: 96.1951 },
  { name: 'Mandalay', lat: 21.9588, lng: 96.0891 },
  { name: 'Bago', lat: 17.3355, lng: 96.4807 },
  { name: 'Mawlamyine', lat: 16.4905, lng: 97.6278 },
  { name: 'Myitkyina', lat: 25.3832, lng: 97.3967 },
  { name: 'Taunggyi', lat: 20.7891, lng: 97.0379 },
  { name: 'Sittwe', lat: 20.1483, lng: 92.8998 },
  { name: 'Pathein', lat: 16.7791, lng: 94.7325 },
  { name: 'Meiktila', lat: 20.8781, lng: 95.8578 },
  { name: 'Myeik', lat: 12.4395, lng: 98.6003 },
];

const generateSiteData = (name: string, lat: number, lng: number): SiteData => {
  const scores: Record<string, number> = {
    'Naypyidaw': 72,
    'Yangon': 58,
    'Mandalay': 65,
    'Bago': 54,
    'Mawlamyine': 62,
    'Myitkyina': 68,
    'Taunggyi': 70,
    'Sittwe': 56,
    'Pathein': 52,
    'Meiktila': 75,
    'Myeik': 64,
  };

  const seismicData: Record<string, { status: 'good' | 'warning' | 'bad'; detail: string }> = {
    'Naypyidaw': { status: 'warning', detail: 'Near Sagaing Fault' },
    'Yangon': { status: 'bad', detail: 'Sagaing Fault Zone: High Risk' },
    'Mandalay': { status: 'bad', detail: 'Sagaing Fault: High Risk' },
    'Bago': { status: 'warning', detail: 'Moderate Seismic Zone' },
    'Mawlamyine': { status: 'good', detail: 'Low Seismic Zone' },
    'Myitkyina': { status: 'warning', detail: 'Near Kyaukkyan Fault' },
    'Taunggyi': { status: 'warning', detail: 'Moderate Seismic Activity' },
    'Sittwe': { status: 'good', detail: 'Low Seismic Zone' },
    'Pathein': { status: 'warning', detail: 'Sagaing Fault: Moderate Risk' },
    'Meiktila': { status: 'good', detail: 'Low Risk Zone' },
    'Myeik': { status: 'good', detail: 'Stable Seismic Zone' },
  };

  const floodData: Record<string, { status: 'good' | 'warning' | 'bad'; detail: string }> = {
    'Naypyidaw': { status: 'good', detail: 'Elevated Area: Low Risk' },
    'Yangon': { status: 'bad', detail: 'Ayeyarwady Delta: High Risk' },
    'Mandalay': { status: 'warning', detail: 'Near Ayeyarwady: Moderate Risk' },
    'Bago': { status: 'bad', detail: 'River Basin: High Risk' },
    'Mawlamyine': { status: 'warning', detail: 'Coastal Area: Moderate Risk' },
    'Myitkyina': { status: 'warning', detail: 'Ayeyarwady Headwaters: Moderate Risk' },
    'Taunggyi': { status: 'good', detail: 'Highland Area: Low Risk' },
    'Sittwe': { status: 'bad', detail: 'Coastal Delta: High Risk' },
    'Pathein': { status: 'bad', detail: 'Ayeyarwady Delta: High Risk' },
    'Meiktila': { status: 'good', detail: 'Dry Zone: Low Risk' },
    'Myeik': { status: 'warning', detail: 'Coastal Area: Moderate Risk' },
  };

  const waterData: Record<string, { status: 'good' | 'warning' | 'bad'; detail: string }> = {
    'Naypyidaw': { status: 'good', detail: 'Ayeyarwady River: 5 km' },
    'Yangon': { status: 'good', detail: 'Yangon River: 2 km' },
    'Mandalay': { status: 'good', detail: 'Ayeyarwady River: 3 km' },
    'Bago': { status: 'warning', detail: 'Bago River: 8 km' },
    'Mawlamyine': { status: 'good', detail: 'Thanlwin River: 1 km' },
    'Myitkyina': { status: 'good', detail: 'Ayeyarwady River: 2 km' },
    'Taunggyi': { status: 'good', detail: 'Inle Lake: 4 km' },
    'Sittwe': { status: 'good', detail: 'Kaladan River: 1 km' },
    'Pathein': { status: 'good', detail: 'Pathein River: 1 km' },
    'Meiktila': { status: 'good', detail: 'Meiktila Lake: 3 km' },
    'Myeik': { status: 'good', detail: 'Coastal Water: 2 km' },
  };

  return {
    lat,
    lng,
    name,
    score: scores[name] || 70,
    factors: {
      seismicHazard: seismicData[name] || { status: 'good', detail: 'Low Risk Zone' },
      floodRisk: floodData[name] || { status: 'good', detail: 'Low Risk' },
      waterSource: waterData[name] || { status: 'good', detail: 'River: 5 km' },
      populationDensity: name === 'Yangon' ? 
        { status: 'warning', detail: 'Medium (500k)' } : 
        { status: 'good', detail: 'Low (<100k)' },
      gridConnection: { status: 'good', detail: 'Existing Substation: 20 km' },
      infrastructure: { status: 'good', detail: 'Major Road/Port' },
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

    // Add Sagaing Fault Line (major north-south fault)
    const sagaingFault = L.polyline([
      [23.5, 95.0],
      [22.0, 95.5],
      [21.0, 96.0],
      [19.5, 96.2],
      [18.0, 96.0],
      [16.5, 95.8],
    ], {
      color: '#ef4444',
      weight: 2,
      opacity: 0.7,
      dashArray: '10, 10',
    }).addTo(map);
    sagaingFault.bindPopup('<div class="font-semibold text-sm">Sagaing Fault</div><div class="text-xs">Major Seismic Risk Zone</div>');

    // Add Kyaukkyan Fault Line (eastern fault)
    const kyaukkyanFault = L.polyline([
      [22.5, 97.5],
      [21.0, 97.8],
      [19.5, 98.0],
      [18.0, 97.5],
    ], {
      color: '#f97316',
      weight: 2,
      opacity: 0.6,
      dashArray: '10, 10',
    }).addTo(map);
    kyaukkyanFault.bindPopup('<div class="font-semibold text-sm">Kyaukkyan Fault</div><div class="text-xs">Moderate Seismic Risk</div>');

    // Add Ayeyarwady River Basin flood zone
    const floodBasin = L.polygon([
      [21.5, 94.5],
      [22.0, 96.5],
      [20.5, 96.8],
      [19.0, 96.5],
      [18.5, 95.5],
      [19.5, 94.8],
    ], {
      color: '#3b82f6',
      weight: 1,
      opacity: 0.3,
      fillColor: '#60a5fa',
      fillOpacity: 0.15,
    }).addTo(map);
    floodBasin.bindPopup('<div class="font-semibold text-sm">Ayeyarwady River Basin</div><div class="text-xs">Flood Prone Area</div>');

    // Add Ayeyarwady Delta flood zone
    const floodDelta = L.polygon([
      [17.5, 94.5],
      [17.0, 95.0],
      [16.5, 96.5],
      [16.0, 96.8],
      [15.8, 96.5],
      [16.0, 95.5],
      [16.5, 94.8],
    ], {
      color: '#3b82f6',
      weight: 1,
      opacity: 0.3,
      fillColor: '#60a5fa',
      fillOpacity: 0.2,
    }).addTo(map);
    floodDelta.bindPopup('<div class="font-semibold text-sm">Ayeyarwady Delta</div><div class="text-xs">High Flood Risk Area</div>');

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