import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartPulse, faTemperatureThreeQuarters, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { GET_MOOD } from "../api/endpoint";
import catHappy from '../assets/images/cat-happy.png';
import catSad from '../assets/images/cat-sad.png';
import catAngry from '../assets/images/cat-angry.png';
import catDefault from '../assets/images/cat-default.png';
import { useMood } from "../Context/MoodContext";

function SideBar() {
  const location = useLocation(); // ดึง path ปัจจุบัน
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const { mood, setMood } = useMood();

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
  return (
    <>
      {/* button bar */}
      <button
        className="md:hidden p-2 bg-neutral-800 text-white rounded-md fixed top-3 right-4 z-100"
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* sidebar */}
      <div
        className={`md:fixed md:top-0 md:left-0 min-h-screen w-full md:w-1/6 bg-neutral-800 text-white p-4 transform z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} transition duration-300 md:translate-x-0`}
      >
        <h2 className="font-bold text-xl mb-5">GuRu Cat</h2>
        <hr className="mb-5" />
  
        {/* Predict */}
        <Link to="/">
          <li
            className={`p-2 pb-7 mb-4 rounded-md cursor-pointer transition duration-300 flex items-center ${location.pathname === "/" ? "bg-[#fffb27] text-black" : "bg-gray-700 hover:bg-gray-500 "
              }`}
          >

            <div className="flex flex-col w-full items-center justify-center">
              <img
                src={mood ? moodImages[mood] || catDefault : catDefault}
                alt="cat mood"
                className="w-20 h-20 mt-2 mb-3 rounded-full object-cover border-2 border-yellow-500 bg-white shadow-md"
              />
              <h2 className={`text-xl font-bold`}> Mood : <span className={`text-xl font-bold ${textMood}`}>{mood || 'Loading...'}</span></h2>

            </div>
          </li>
        </Link>

        {/* GPS */}
        <Link to="/GPS">
          <li
            className={`p-2 mb-4 rounded-md cursor-pointer transition duration-300 flex items-center ${location.pathname === "/GPS" ? "bg-[#fffb27] text-black" : "hover:bg-gray-600"
              }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <span className="ms-2">GPS</span>
          </li>
        </Link>
      </div>
    </>
  );
}

export default SideBar;
