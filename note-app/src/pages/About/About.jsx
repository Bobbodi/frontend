import { React, useState, useEffect, useRef } from 'react'
import Navbarv3 from '../../components/Navbarv3'
import axiosInstance from '../../utils/axiosInstance';
import { getGreeting } from '../../utils/helper';

import { FiTrendingUp, FiCalendar, FiUsers, FiActivity, FiBook, FiBarChart2, FiUser, FiAward, FiHeart } from 'react-icons/fi';
import { Canvas } from '@react-three/fiber';
import { Environment, Text, OrbitControls } from '@react-three/drei';
import Calendar from '../../components/Calender/Calender';

import { Room7Model } from '../../components/3D models/Room7Model.jsx';
import { SharkModel } from '../../components/3D models/SharkModel.jsx';
import SeeAllSleep from '../Wellness/SeeAllSleep.jsx';

import { useNavigate } from 'react-router-dom';

const About = () => {
  const [userInfo, setUserInfo] = useState(null); 

  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = useNavigate();

  const highlightDates = [
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 1)),
    new Date(new Date().setDate(new Date().getDate() + 2))
  ];
	const getUserInfo = async () => { 
    try { 
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) { 
        setUserInfo(response.data.user);
      }
    } catch (error) { 
      if (error.response.status == 401) { 
        localStorage.clear(); 
        navigate("/login");
      }
    }
	}

  useEffect(() => {
    const init = async () => {
      await getUserInfo();
    };
    init();
  }, []); // Keep empty if no external deps


const sleepData = [
  
  {
    _id: '687352bb7996892b474e2d04',
    sleepStart: new Date(new Date().setDate(new Date().getDate() - 3, 23, 0, 0)),  // 11pm 3 days ago
    sleepEnd: new Date(new Date().setDate(new Date().getDate() - 2, 6, 0, 0)),     // 6am next day
    dreams: 'Running in a field of flowers',
    userId: '682fe187a30e0228f39fbdb8',
    createdOn: new Date(new Date().setDate(new Date().getDate() - 2, 6, 45, 0)),
    __v: 0
  },
  {
    _id: '687b9818ebd653428dc17bab',
    sleepStart: new Date(new Date().setDate(new Date().getDate() - 2, 22, 0, 0)),  // 10pm 2 days ago
    sleepEnd: new Date(new Date().setDate(new Date().getDate() - 1, 8, 0, 0)),     // 8am next day
    dreams: 'Underwater city exploration',
    userId: '682fe187a30e0228f39fbdb8',
    createdOn: new Date(new Date().setDate(new Date().getDate() - 1, 8, 15, 0)),
    __v: 0
  },
  {
    _id: '687ced1710fc54aac2d2e050',
    sleepStart: new Date(new Date().setDate(new Date().getDate() - 1, 23, 0, 0)),  // 11pm yesterday
    sleepEnd: new Date(new Date().setDate(new Date().getDate(), 9, 0, 0)),        // 9am today
    dreams: 'Talking animals giving life advice',
    userId: '682fe187a30e0228f39fbdb8',
    createdOn: new Date(new Date().setDate(new Date().getDate(), 9, 30, 0)),
    __v: 0
  },
  {
    _id: '687ced1710fc54aac2d2e051',
    sleepStart: new Date(new Date().setHours(22, 0, 0, 0)),  // Today 10pm
    sleepEnd: new Date(new Date().setDate(new Date().getDate() + 1, 7, 0, 0)),  // Tomorrow 7am
    dreams: 'Solving complex coding problems effortlessly',
    userId: '682fe187a30e0228f39fbdb8',
    createdOn: new Date(),
    __v: 0
  }
];


  const ROOM_MODELS = { 
    7: { 
            "model": Room7Model, 
            "position": [1.5, -5, 0], 
            "rotation": [0, -1.8, 0], 
            "scale": [0.25, 0.25, 0.25]
          },
        }

  const AVATAR_MODELS = { 
    9: {
        "model": SharkModel,
        "position": [0, -4.2, 1],     
        "rotation": [0, -1, 0], 
        "scale": [0.2, 0.2, 0.2],
        "textpos": [1.6, 2.5, 0], 
        "textrot": [0, Math.PI, 0]
      }
    }

  const UserAvatar = ({ avatarId, name, userId }) => { 
    const avatarRef = useRef(); 
    const avatar = avatarId ? AVATAR_MODELS[avatarId] : AVATAR_MODELS[2];
    const AvatarModel = avatar.model || AVATAR_MODELS[1].model; //fallback to default if not specified
    return ( 
      <group ref = {avatarRef} position = {avatar.position} rotation = {avatar.rotation}> 
        <AvatarModel scale={avatar.scale}/>
        <Text 
          position={avatar.textpos}
          rotation={avatar.textrot}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="white"
        > {name} </Text>
      </group>
    )
  }

  const UserRoom = ({ roomId }) => { 
          const roomRef = useRef(); 
          const room = ROOM_MODELS[roomId];
          const RoomModel = room.model || ROOM_MODELS[1].model; //fallback to default if not specified
          return ( 
          <group ref = {roomRef} position = {room.position} rotation = {room.rotation}> 
              <RoomModel scale={room.scale}/>
          </group>
          )
      }

  return (
		<div> 
    <Navbarv3 userInfo={userInfo} />
    
    <div className="max-w-6xl mx-auto px-6 py-6">
  {/* Hero Section */}
  <section className="text-center mb-5">
    <h1 className="text-3xl font-bold text-black-600 mb-2">About SlayFocus</h1>
    <p className="text-lg text-gray-700">
      Your all-in-one platform to make studying productive, social, and enjoyable
    </p>
  </section>

  {/* Feature Sections */}
  <div className="space-y-5">
    {/* Task Prioritization */}
    <section className="grid md:grid-cols-2 gap-2 items-center">
      <div className="space-y-4">
        <div className="flex items-center gap-5">
          <h2 className="text-3xl font-bold text-yellow-600">Task Planning</h2>
          <button 
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
            onClick={() => {
              // Add your button click handler here
              navigate("/dashboard")
            }}
          >
            Try Me!
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <FiTrendingUp className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">Personalized Scheduling</h3>
              <p className="text-gray-600">
                Uses your mood and sleep data to suggest optimal study times and task sequencing
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <FiCalendar className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">Intelligent Calendar</h3>
              <p className="text-gray-600">
                Automatically schedules tasks based on priority, due dates, and estimated completion time
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-100">
         <Calendar 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate}
            highlightDates={highlightDates}
          />
      </div>
    </section>

    {/* Study Rooms */}
    <section className="grid md:grid-cols-2 items-center">
      <div className="order-2 md:order-1 w-[500px] h-[500px]">
        <Canvas camera={{ fov: 9, position: [20, 80, 30] }}>
          <ambientLight intensity={0} />
          <OrbitControls
            enableZoom={true}
            minAzimuthAngle={-Math.PI}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI}
          />
          <UserRoom roomId={7} />
          <UserAvatar
            key={1}
            avatarId={9}
            name={"Babyshark"}
            userId={1}
          />
          <Environment preset="apartment" />
        </Canvas>
      </div>
      <div className="space-y-4 order-1 md:order-2">
        <div className="flex items-center gap-5">
          <h2 className="text-3xl font-bold text-yellow-600">Study Rooms</h2>
          <button 
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
            onClick={() => {
              // Add your button click handler here
              navigate("/study")
            }}
          >
            Try Me!
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <FiUsers className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">Collaborative Learning</h3>
              <p className="text-gray-600">
                Study with friends in customizable 3D rooms with avatars
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <FiActivity className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">Session Analytics</h3>
              <p className="text-gray-600">
                Track study duration, tasks completed, and productivity metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Wellness Tools */}
    <section className="grid md:grid-cols-2 items-center">
      <div className="space-y-4">
        <div className="flex items-center gap-5">
          <h2 className="text-3xl font-bold text-yellow-600">Wellness Tools</h2>
          <button 
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
            onClick={() => {
              // Add your button click handler here
              navigate("/wellness")
            }}
          >
            Try Me!
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <FiBook className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">Journaling</h3>
              <p className="text-gray-600">
                Reflect on your day with our guided journal and view past entries
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <FiBarChart2 className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">Health Tracking</h3>
              <p className="text-gray-600">
                Monitor mood patterns and sleep habits with visual analytics
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-100">
        <SeeAllSleep 
          sleepData={sleepData}
        />
         {/* Interactive mood/sleep charts <WellnessGraphs />*/}
      </div>
    </section>

    {/* Profile Customization */}
    <section className="text-center mb-6 mt-20">
      <div className="flex items-center text-center gap-5 mb-10">
          <h2 className="text-3xl font-bold text-yellow-600">Personalised Profile</h2>
          <button 
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
            onClick={() => {
              // Add your button click handler here
              navigate("/profile")
            }}
          >
            Try Me!
          </button>
        </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 p-6 rounded-lg">
          <FiUser className="text-4xl text-yellow-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Avatar Customization</h3>
          <p className="text-gray-600">
            Choose from dozens of avatars to represent you in study rooms
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <FiAward className="text-4xl text-yellow-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Achievement Tracking</h3>
          <p className="text-gray-600">
            View all your study statistics and milestones in one place
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <FiHeart className="text-4xl text-yellow-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Study Buddies</h3>
          <p className="text-gray-600">
            Connect with friends and motivate each other
          </p>
        </div>
      </div>
      
    </section>
  </div>
</div>

    </div> 
  )
}

export default About
