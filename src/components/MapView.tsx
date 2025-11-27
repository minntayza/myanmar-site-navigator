import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SiteInfoCard from './SiteInfoCard';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  // Generate realistic data based on location
  const scores = {
    'Naypyidaw': 72,
    'Yangon': 65,
    'Mandalay': 78,
    'Bago': 68,
    'Mawlamyine': 70,
  };

  const waterData = {
    'Naypyidaw': { status: 'good' as const, detail: 'Ayeyarwady River: 5 km' },
    'Yangon': { status: 'good' as const, detail: 'Yangon River: 2 km' },
    'Mandalay': { status: 'good' as const, detail: 'Ayeyarwady River: 3 km' },
    'Bago': { status: 'warning' as const, detail: 'Bago River: 8 km' },
    'Mawlamyine': { status: 'good' as const, detail: 'Thanlwin River: 1 km' },
  };

  return {
    lat,
    lng,
    name,
    score: scores[name as keyof typeof scores] || 70,
    factors: {
      waterSource: waterData[name as keyof typeof waterData] || { status: 'good', detail: 'River: 5 km' },
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

function MapClickHandler({ onSiteSelect }: { onSiteSelect: (data: SiteData | null) => void }) {
  useMapEvents({
    click(e) {
      // Find nearest city
      const { lat, lng } = e.latlng;
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
      onSiteSelect(siteData);
    },
  });

  return null;
}

export default function MapView({ smrModel }: { smrModel: string }) {
  const [selectedSite, setSelectedSite] = useState<SiteData | null>(null);

  return (
    <div className="relative h-full w-full bg-map-bg rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[21.9162, 95.9560]}
        zoom={6}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {myanmarCities.map((city) => (
          <Marker 
            key={city.name} 
            position={[city.lat, city.lng]}
            eventHandlers={{
              click: () => {
                const siteData = generateSiteData(city.name, city.lat, city.lng);
                setSelectedSite(siteData);
              },
            }}
          >
            <Popup>
              <div className="font-semibold text-sm">{city.name}</div>
            </Popup>
          </Marker>
        ))}

        <MapClickHandler onSiteSelect={setSelectedSite} />
      </MapContainer>

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