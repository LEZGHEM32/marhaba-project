
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  locationName: string;
  locationSeed: string; // Used to generate a consistent map image
}

const Map: React.FC<MapProps> = ({ locationName, locationSeed }) => {
  const mapImageUrl = `https://picsum.photos/seed/${locationSeed}-map/800/400`;

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-md">
      <img 
        src={mapImageUrl} 
        alt={`Map showing ${locationName}`} 
        className="w-full h-full object-cover filter grayscale-75"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center">
          <MapPin size={48} className="text-red-500 drop-shadow-lg mx-auto" style={{ transform: 'translateY(-18px)' }} />
          <div 
            className="bg-white/90 text-dark-blue font-bold py-2 px-4 rounded-lg shadow-xl"
            style={{ transform: 'translateY(-24px)' }}
          >
            {locationName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
