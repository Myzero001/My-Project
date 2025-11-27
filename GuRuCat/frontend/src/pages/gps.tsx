import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../index.css';
import { GET_MOOD } from '../api/endpoint';
import { useMood } from '../Context/MoodContext';

import catHappy from '../assets/images/cat-happy.png';
import catSad from '../assets/images/cat-sad.png';
import catAngry from '../assets/images/cat-angry.png';
import catDefault from '../assets/images/cat-default.png';

// แก้ปัญหา marker ไม่แสดงใน React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Link } from 'react-router-dom';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function Gps() {
  // พิกัด 
  const { mood, setMood } = useMood();
  const [theme, setTheme] = useState<'default' | 'dark' | 'satellite'>('default');
  const latitude = 13.870311830512136;
  const longitude = 100.55149641422318;
  const position: [number, number] = [latitude, longitude];

  useEffect(() => {
    const fetchMood = async () => {
      try {
        const res = await GET_MOOD();
        setMood(res.data.Mood.Mood);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMood();
  }, []);
  const moodImages: { [key: string]: string } = {
    Happy: catHappy,
    Sad: catSad,
    Angry: catAngry,
  };
  const textMood = (() => {
    switch (mood) {
      case 'Happy':
        return 'text-green-500';
      case 'Sad':
        return 'text-blue-500';
      case 'Angry':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  })();
  const tileLayers = {
    default: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    },
  };
  return (
    <div className="h-screen overflow-hidden">
      <div className='sticky top-0 z-10 bg-white flex justify-center items-center gap-3 py-3'>

        <h1 className="flex text-2xl font-bold text-center ">ติดตามตำแหน่งแมว 🐾</h1>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className="p-2 border rounded"
        >
          <option value="default">✨ โหมดปกติ</option>
          <option value="dark">🌙 โหมดมืด</option>
          <option value="satellite">🛰️ ภาพถ่ายดาวเทียม</option>
        </select>
      </div>




      {/* Map */}
      <div className="h-full relative z-0 shadow overflow-hidden">
        <MapContainer center={position} zoom={15} className="h-full w-full">
          <TileLayer
            url={tileLayers[theme].url}
            attribution={tileLayers[theme].attribution}
          />
          <Marker position={position}>
            <Popup>
              <div className="flex flex-col items-center text-center px-2 pt-2 pb-3">
                <Link to="/">
                  <img
                    src={mood ? moodImages[mood] || catDefault : catDefault}
                    alt="Cat"
                    className="w-full h-full rounded-full border-4 border-yellow-500 object-cover shadow-xl transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <h2 className="text-base font-semibold text-gray-800 mt-3">แมวของคุณ</h2>
                <p className={`text-sm text-gray-600 leading-tight ${textMood}`}>
                  <span className='text-black'>อารมณ์:</span> {mood || 'ยังไม่ได้ทำนาย'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  พิกัด: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </p>
              </div>
            </Popup>

          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default Gps;
