import React, { useEffect, useState } from 'react';
import { GET_MOOD, PREDICT } from '../api/endpoint';
import { useMood } from '../Context/MoodContext';
import { useTemp } from '../Hooks/useTemp';
import { usePulse } from '../Hooks/usePulse';
import { useMotion } from '../Hooks/useMotion';
import {
  faHeartPulse,
  faTemperatureThreeQuarters,
  faRunning,
  faSmileBeam,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import catHappy from '../assets/images/cat-happy.png';
import catSad from '../assets/images/cat-sad.png';
import catAngry from '../assets/images/cat-angry.png';
import catDefault from '../assets/images/cat-default.png';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, } from 'recharts';
import axios from 'axios';

interface TempData { Temperature: number; created_at: string; }
interface PulseData { Pulse: number; created_at: string; }
interface MotionData { ActivityLevel: number; created_at: string; }

interface ChartPoint {
  name: string;
  temp?: number;
  pulse?: number;
  motion?: number;
}

function Predict() {
  const { mood, setMood } = useMood();
  const { data: dataTemp } = useTemp();
  const { data: dataPulse } = usePulse();
  const { data: dataMotion } = useMotion();

  // console.log(dataTemp?.data.temperature.Temperature);
  // console.log(dataMotion?.data.activity_level.ActivityLevel);
  // console.log(dataPulse?.data.pulse_rate.Pulse);

  const [tempChartData, setTempChartData] = useState<ChartPoint[]>([]);
  const [pulseChartData, setPulseChartData] = useState<ChartPoint[]>([]);
  const [motionChartData, setMotionChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const fetchTemp = async () => {
      try {
        const [tempRes, pulseRes, motionRes] = await Promise.all([
          axios.get<{ temperature: TempData[] }>('http://localhost:5001/get-temp'),
          axios.get<{ pulse_rate: PulseData[] }>('http://localhost:5001/get-pulse'),
          axios.get<{ activity_level: MotionData[] }>('http://localhost:5001/get-motion'),
        ]);

        const tempData = tempRes.data.temperature.map(item => ({
          name: item.created_at,
          temp: item.Temperature,
        }));

        const pulseData = pulseRes.data.pulse_rate.map(item => ({
          name: item.created_at,
          pulse: item.Pulse,
        }));

        const motionData = motionRes.data.activity_level.map(item => ({
          name: item.created_at,
          motion: item.ActivityLevel,
        }));

        setTempChartData(tempData.reverse());
        setPulseChartData(pulseData.reverse());
        setMotionChartData(motionData.reverse());
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการโหลดอุณหภูมิ:', err);
      }
    };

    fetchTemp();
    const interval = setInterval(fetchTemp, 5000); 

    return () => clearInterval(interval);
  }, []);

  const predict = async () => {
    try {
      await PREDICT();
      alert('ทำนายอารมณ์เรียบร้อย');

      // fetch ใหม่แล้วอัปเดต context
      const res = await GET_MOOD();
      setMood(res.data.Mood.Mood);

    } catch (err) {
      console.error(err);
    }
  };


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

  return (
    <div className="min-h-screen max-h-auto bg-gradient-to-b from-sky-100 via-white to-pink-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-neutral-700">🐾 Cat Health Dashboard</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Temperature */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-4 mb-4">
            <FontAwesomeIcon icon={faTemperatureThreeQuarters} className="text-yellow-500" />
            Temperature
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={tempChartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[30, 37]} />
              <Tooltip />
              <Area type="monotone" dataKey="temp" stroke="#facc15" fill="url(#colorTemp)" />

            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Heart Rate */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-5 mb-4">
            <FontAwesomeIcon icon={faHeartPulse} className="text-red-500" />
            Heart Rate
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pulseChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[120]}/>
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pulse" stroke="#ef4444" activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Motion */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-4 mb-4">
            <FontAwesomeIcon icon={faRunning} className="text-indigo-500 " />
            Activity Level
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={motionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[30, 70]} />
              <Tooltip />
              <Line type="monotone" dataKey="motion" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>


        {/* Mood Section */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-xl p-6 flex flex-col xl:flex-row items-center justify-center text-center hover:shadow-2xl 
        transition border-4 border-yellow-500 ring-4 ring-yellow-300 ring-offset-2 space-x-10">

          <div className="relative w-60 h-60 mb-5">
            <img
              src={mood ? moodImages[mood] || catDefault : catDefault}
              alt="cat mood"
              className="w-full h-full rounded-full border-4 border-yellow-500 object-cover shadow-xl transition-transform duration-300 hover:scale-105"
            />
            <div className={`absolute top-0 left-0 w-full h-full rounded-full animate-ping ${mood === 'Happy' ? 'bg-green-300/30' : mood === 'Sad' ? 'bg-blue-300/30' : mood === 'Angry' ? 'bg-red-300/30' : 'bg-gray-300/30'}`} />
          </div>

          <div className=''>

            {/* Mood text */}
            <div className={`text-3xl font-bold mb-2 tracking-wide ${textMood}`}>
              <span className='text-black'>Mood: </span>{mood || 'ยังไม่ได้ทำนาย'}
            </div>

            {/* Update button */}
            <button
              onClick={predict}
              className="mt-4 px-10 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black text-lg font-bold rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Update Mood
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}

export default Predict;
