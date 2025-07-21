import React from 'react'
import Navbarv3 from '../../components/Navbarv3';
import axiosInstance from "../../utils/axiosInstance";
import { useState, useEffect, useRef } from 'react';
import { getGreeting, getInitials } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaTasks, FaBook, FaChartLine, FaUserFriends } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import avatarSample from "../../assets/images/avatar-sample.jpg"
import { TbMoodAngryFilled } from "react-icons/tb";
import { FaBed } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import Friends from "../Friends/Friends"
import Modal from "react-modal";

//components
import { Room1Model } from '../../components/3D models/Room1Model.jsx';
import { Room2Model } from '../../components/3D models/Room2Model.jsx';
import { Room3Model } from '../../components/3D models/Room3Model.jsx';
import { Room4Model } from '../../components/3D models/Room4Model.jsx';
import { Room5Model } from '../../components/3D models/Room5Model.jsx';
import { Room6Model } from '../../components/3D models/Room6Model.jsx';
import { Room7Model } from '../../components/3D models/Room7Model.jsx';

import { BeeModel } from '../../components/3D models/BeeModel.jsx';
import { CamelModel } from '../../components/3D models/CamelModel.jsx';
import { CentaurModel } from '../../components/3D models/CentaurModel.jsx';
import { CowModel } from '../../components/3D models/CowModel.jsx';
import { MonsterModel } from '../../components/3D models/MonsterModel.jsx';
import { PigmanModel } from '../../components/3D models/PigmanModel.jsx';
import { RainbowDragonModel } from '../../components/3D models/RainbowDragonModel.jsx';
import { SharkModel } from '../../components/3D models/SharkModel.jsx';
import { SteveModel } from '../../components/3D models/SteveModel.jsx';
import { CreeperModel } from '../../components/3D models/CreeperModel.jsx';

import { AVATAR_DESC } from '../../utils/constants.js';
//react-three-js
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null); 
  const [allNotesLength, setAllNotesLength] = useState(null);
  const [doneNotesLength, setDoneNotesLength] = useState(null);
  const [allStudyTime, setAllStudyTime] = useState(null); 
  const [allJournalLength, setAllJournalLength] = useState(null); 
  const [allFriendsLength, setAllFriendsLength] = useState(null);
  const [allMoodsLength, setAllMoodsLength] = useState(null); 
  const [allSleepLength, setAllSleepLength] = useState(null); 

  const [isLoading, setIsLoading] = useState(true); 

  const [openAddFriends, setOpenAddFriends] = React.useState({
      isShown: false, 
      type: "add",
      data: null,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
      await getUserInfo();
      await getAllNotes();
      await getAllSleep(); 
      await getAllMood(); 
      await getAllJournal(); 
      await getAllStudyTime(); 
      await getAllFriends();
  };
  fetchData();
  }, []);
     

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
      } finally { 
        setIsLoading(false); 
      }
  }

  //can calc number of notes created
  const getAllNotes = async () => { 
      try { 
          const response = await axiosInstance.get("/get-all-notes");
          if (response.data && response.data.notes) { 
              setAllNotesLength(response.data.notes.length);
              setDoneNotesLength(response.data.notes.filter(note => note.isDone).length);
          }
      } catch (error) { 
          console.log("beep boop error time")
      }
  }

  const getAllJournal = async () => { 
      try { 
          const response = await axiosInstance.get("/get-all-journal");
          if (response.data && response.data.journals) { 
              setAllJournalLength(response.data.journals.length);
          }
      } catch (error) { 
          console.log("beep boop error time")
      }
  }

  const getAllStudyTime = async () => { 
    try { 
      const response = await axiosInstance.get("/get-all-study-time"); 
      if (response.data && response.data.total) { 
        console.log(response.data.total);
        setAllStudyTime(response.data.total); 
      }
    } catch (error) { 
      console.log("Beep boop error time"); 
    }
  }

  const onEditAvatar = async () => {
    navigate("/profile/avatar");
  }

  const onEditRoom = async () => { 
    navigate("/profile/studyroom");
  }

  const onEditProfile = async () => {
    navigate("/profile/editprofile");
  }

  const getAllFriends = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-friends");
            if (response.data && response.data.friends) { 
                setAllFriendsLength(response.data.friends.length);
            }
        } catch (error) { 
            if (error.response.status == 401) { 
                localStorage.clear(); 
                navigate("/login");
            }
        }
    }

  const getAllMood = async () => { 
      try { 
          const response = await axiosInstance.get("/get-all-mood");
          if (response.data && response.data.moods) { 
              setAllMoodsLength(response.data.moods.length);
          }
      } catch (error) { 
          console.log("beep boop error time")
      }
  }

  const getAllSleep = async () => { 
    try { 
      const response = await axiosInstance.get("/get-all-sleep");
      if (response.data && response.data.sleeps) { 
        setAllSleepLength(response.data.sleeps.length);
      }
    } catch (error) { 
      console.log("beep boop error time"); 
    }
  }

  const AVATAR_MODELS = { 
    1: {
      "model": BeeModel, 
      "position": [0, 0, 0], 
      "rotation": [0, -2.5, 0], 
      "scale": [0.7, 0.7, 0.7]
    }, 
    2: {
      "model": CamelModel, 
      "position": [0, -3.8, 0], 
      "rotation": [0, 1, 0], 
      "scale": [2.5, 2.5, 2.5]
    },
    3: {
      "model": CentaurModel, 
      "position": [0, -3.6, 0], 
      "rotation": [0, -2.4, 0], 
      "scale": [2.7, 2.7, 2.7]
    },
    4: {
      "model": CowModel, 
      "position": [0, -2.3, 0], 
      "rotation": [0, 1.5, 0], 
      "scale": [4, 4, 4]
    },
    5: {
      "model": SteveModel, 
      "position": [0, 0, 0], 
      "rotation": [0, 0.5, 0], 
      "scale": [0.2, 0.2, 0.2]
    },
    6: {
      "model": MonsterModel, 
      "position": [0, -3.5, 0], 
      "rotation": [0, 0, 0], 
      "scale": [2, 2, 2]
    },
    7: {
      "model": PigmanModel, 
      "position": [0, -3.5, 0], 
      "rotation": [0, -2.5, 0], 
      "scale": [4, 4, 4]
    },
    8: {
      "model": RainbowDragonModel, 
      "position": [0, -0.5, 0], 
      "rotation": [0, -2.5, 0], 
      "scale": [1, 1, 1]
    },
    9: {
      "model": SharkModel, 
      "position": [2.4, -1.5, 0], 
      "rotation": [0, -2.5, 0], 
      "scale": [0.33, 0.33, 0.33]},
    10: {
      "model": CreeperModel,
      "position": [0, 0, 0], 
      "rotation": [0, 0.5, 0], 
      "scale": [0.30, 0.30, 0.30]
    },
  }

  const ROOM_MODELS = { 
      1: {
        "model": Room1Model, 
        "position": [0, -1, 0], 
        "rotation": [0, -0.8, 0], 
        "scale": [0.27, 0.27, 0.27]
      },
      2: { 
        "model": Room2Model, 
        "position": [0, -1, 0], 
        "rotation": [0, -2.3, 0], 
        "scale": [0.03, 0.03, 0.03]
      },
      3: { 
        "model": Room3Model, 
        "position": [0, -1, 0], 
        "rotation": [0, -2.3, 0], 
        "scale": [0.06, 0.06, 0.06]
      },
      4: { 
        "model": Room4Model, 
        "position": [0, -1, 0], 
        "rotation": [0, -1, 0], 
        "scale": [0.06, 0.06, 0.06]
      },
      5: { 
        "model": Room5Model, 
        "position": [-0.5, -0.5, -0.5], 
        "rotation": [0, -0.8, 0], 
        "scale": [0.12, 0.12, 0.12]
      },
      6: { 
        "model": Room6Model, 
        "position": [0, -1, 0], 
        "rotation": [0, -2.4, 0], 
        "scale": [0.0018, 0.0018, 0.0018]
      },
      7: { 
        "model": Room7Model, 
        "position": [0, -1, 0], 
        "rotation": [0, -2.3, 0], 
        "scale": [0.07, 0.07, 0.07]
      },
      
    }

  const UserAvatar = ({ avatarId }) => { 
    const avatarRef = useRef(); 
    const avatar = avatarId ? AVATAR_MODELS[avatarId] : AVATAR_MODELS[2];
    const AvatarModel = avatar.model || AVATAR_MODELS[1].model; //fallback to default if not specified
    return ( 
      <group ref = {avatarRef} position = {avatar.position} rotation = {avatar.rotation}> 
        <AvatarModel scale={avatar.scale}/>
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
  <>
    <Navbarv3 userInfo={userInfo} />

    <div className="flex flex-col h-[calc(100vh-90px)] md:flex-row bg-gradient-to-br from-gray-100 to-gray-200">
      {/* LEFT SIDE */}
      <div className="w-full md:w-[67%] flex flex-col items-center bg-yellow-50 shadow-inner">
        {/* Avatar */}

            {!isLoading && userInfo && (
              <div className="absolute mt-4 ml-2 left-4 animate-fade-in w-fit">
                <div className="flex flex-col items-start gap-1">
                  {/* Avatar Name */}
                  <div className="flex flex-row gap-3">
                  <h3 className="text-left text-2xl md:text-3xl font-semibold text-yellow-800">
                    {AVATAR_DESC[Number(userInfo.avatar)].name}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-700 font-medium">
                      <span className="text-base">
                        {AVATAR_DESC[Number(userInfo.avatar)].hp}
                      </span>
                      <span className="text-xs tracking-wide">HP</span>
                    </div>
                  </div> 

                  {/* Speciality and HP */}
                  <div className="flex flex-row items-center gap-4 text-sm md:text-base text-yellow-600">
                    <span className="italic">
                      {AVATAR_DESC[Number(userInfo.avatar)].speciality}
                    </span>
                  </div>
                </div>
              </div>
            )}
          
          <Canvas camera={{ fov: 8, position: [0, 2, 70]}}>
            <ambientLight intensity={0.5} />
            <OrbitControls
              enableZoom={true}
              minAzimuthAngle={-Math.PI}
              // maxAzimuthAngle={Math.PI}
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI}
            />
            {console.log(userInfo)}
            {!isLoading && userInfo && (
              <UserAvatar 
              key = {userInfo._id}
              avatarId = {userInfo.avatar}
            />)}
            
            <Environment preset="sunset" />
            
            {/* <ContactShadows
              opacity={0.5}
              scale={100}
              blur={1}
              far={10}
              resolution={256}
              color="#000000"
            /> */}
          </Canvas>

          <div className="absolute bottom-8 left-123 w-[200px] h-[200px]">
            {!isLoading && userInfo && (
            <Canvas camera={{ fov: 9, position: [0, 20, 0]}}>
            <ambientLight intensity={0.5} />
            <OrbitControls
              enableZoom={true}
              minAzimuthAngle={-Math.PI}
              // maxAzimuthAngle={Math.PI}
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI}
            />
            <UserRoom 
              roomId = {userInfo.studyroom}
            />
            <Environment preset="sunset" />
            </Canvas>
            )}
          </div> 
        {/*button to lead to change profile avatar page*/}
          <div className="absolute bottom-20 left-8 w-full flex">
            <button
              onClick={onEditAvatar}
              className="group px-3 py-2 bg-white/90 backdrop-blur-xl rounded-full shadow-lg hover:shadow-xl 
              transition-all duration-300 hover:bg-yellow-50 border border-yellow-100 hover:border-yellow-200"
            >
              <span className="flex items-center justify-center gap-2 text-yellow-600 group-hover:text-yellow-700 transition-colors">
                <MdCreate className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Change Avatar</span>
              </span>
            </button>
          </div>

          <div className="absolute bottom-8 left-8 w-full flex">
            <button
              onClick={onEditRoom}
              className="group px-4 py-2 bg-white/90 backdrop-blur-xl rounded-full shadow-lg hover:shadow-xl 
              transition-all duration-300 hover:bg-yellow-50 border border-yellow-100 hover:border-yellow-200"
            >
              <span className="flex items-center justify-center gap-2 text-yellow-600 group-hover:text-yellow-700 transition-colors">
                <MdCreate className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Change Room</span>
              </span>
            </button>
          </div>

      </div> 

        {/* Profile Info
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg space-y-6 border border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              {userInfo?.fullName || 'User'}
            </h2>
            <p className="text-sm text-center text-gray-500 italic">Welcome to your dashboard ✨</p>
          </div>
          <button
            onClick={onEditAvatar}
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-200"
          >
            Save
          </button>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-gray-800 font-medium">{userInfo?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-gray-800 font-medium">
                {new Date(userInfo?.createdOn).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[33%] p-3 md:p-8 bg-gray-50">
        
        <h2 className="text-2xl mb-5 font-bold"> {getGreeting()} {userInfo?.fullName} </h2>

        <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-77 overflow-x-hidden" style = {{scrollbarWidth: "none"}}>
          {/* CARD TEMPLATE */}
          {[
            {
              icon: <FaTasks className="text-blue-500 text-xl" />,
              bg: "bg-blue-100",
              count: doneNotesLength,
              label: "Tasks Completed",
              color: "text-blue-500",
            },
            {
              icon: <FaChartLine className="text-purple-500 text-xl" />,
              bg: "bg-purple-100",
              count: allStudyTime,
              label: "Study Hours",
              color: "text-purple-500",
            },
            {
              icon: <FaUserFriends className="text-yellow-500 text-xl" />,
              bg: "bg-yellow-100",
              count: allFriendsLength,
              label: "Buddies Made",
              color: "text-yellow-500",
              action: (
                <button
                  className="ml-2 w-9 h-9 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 text-white transition"
                  onClick={() =>
                    setOpenAddFriends({ isShown: true, type: "add", data: null })
                  }
                  aria-label="Add Friend"
                >
                  <MdAdd className="text-2xl" />
                </button>
              ),
            },
            {
              icon: <TbMoodAngryFilled className="text-red-500 text-xl" />,
              bg: "bg-red-100",
              count: allMoodsLength,
              label: "Moods Tracked",
              color: "text-red-500",
            },
            {
              icon: <FaBook className="text-green-500 text-xl" />,
              bg: "bg-green-100",
              count: allJournalLength,
              label: "Journals Written",
              color: "text-green-500",
            },
            {
              icon: <FaBed className="text-pink-500 text-xl" />,
              bg: "bg-pink-100",
              count: allSleepLength,
              label: "Sleep Entries",
              color: "text-pink-500",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-md hover:shadow-xl transition transform hover:scale-[1.01]"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${card.bg}`}>{card.icon}</div>
                <div>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.count}</p>
                  <p className="text-sm text-gray-700 font-medium">{card.label}</p>
                </div>
              </div>
              {card.action}
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={openAddFriends.isShown}
          onRequestClose={() =>
            setOpenAddFriends({ isShown: false, type: "add", data: null })
          }
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            content: {
              width: "90%",
              maxWidth: "1000px",
              maxHeight: "100vh",
              borderRadius: "0.75rem",
              padding: "0",
              border: "none",
              boxShadow:
                "0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 8px rgba(0, 0, 0, 0.05)",
              inset: "auto",
            },
          }}
          contentLabel="Friends Management"
          ariaHideApp={false}
        >
          <Friends />
        </Modal>
      </div>
    </div>
  </>
);
}

export default Profile
// return (
//   <>
//     <Navbarv3 userInfo={userInfo} />

//     <div className="flex flex-col md:flex-row">
//       {/* Left Side */}
//       <div className="w-full md:w-[60%] bg-gray-200 h-full p-8 flex flex-col items-center">
//         <div className="relative group">
//           <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
//             <img src={avatarSample} alt="User Avatar" className="w-full h-full object-cover" />
//           </div>
//           <button
//             onClick={onEditAvatar}
//             className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//           >
//             Edit
//           </button>
//         </div>

//         <div className="bg-white rounded-xl p-6 w-full shadow-md mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">
//             {userInfo?.fullName || 'User'}
//           </h2>

//           <div className="space-y-3">
//             <div>
//               <p className="text-sm text-gray-500">Email</p>
//               <p className="text-gray-800">{userInfo?.email}</p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">Member Since</p>
//               <p className="text-gray-800">
//                 {new Date(userInfo?.createdOn).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="w-full md:w-[40%] bg-gray-50 p-4">
//         <div className="grid grid-cols-1 gap-3 mb-8">
//           {/* Task Stats Card */}
//           <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex flex-row items-center">
//                 <div className="p-2 bg-blue-100 rounded-full mr-4">
//                   <FaTasks className="text-blue-500 text-xl" />
//                 </div>
//                 <div className="flex flex-row items-center gap-3">
//                   <h3 className="text-2xl font-bold text-blue-500">{doneNotesLength}</h3>
//                   <h3 className="text-xl font-semibold">Tasks Completed</h3>
//                 </div>
//               </div>

//             </div>
//           </div>

//           {/* Journal Stats Card */}
//           <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex flex-row items-center">
//                 <div className="p-2 bg-green-100 rounded-full mr-4">
//                   <FaBook className="text-green-500 text-xl" />
//                 </div>
//                 <div className="flex flex-row items-center gap-3">
//                   <h3 className="text-2xl font-bold text-green-500">{allJournalLength}</h3>
//                   <h3 className="text-xl font-semibold">Journals Written</h3>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Study Stats Card */}
//           <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex flex-row items-center">
//                 <div className="p-2 bg-purple-100 rounded-full mr-4">
//                   <FaChartLine className="text-purple-500 text-xl" />
//                 </div>
//                 <div className="flex flex-row items-center gap-3">
//                   <h3 className="text-2xl font-bold text-purple-500">{allStudyTime}</h3>
//                   <h3 className="text-xl font-semibold">Studied</h3>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Mood Stats Card */}
//           <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex flex-row items-center">
//                 <div className="p-2 bg-violet-100 rounded-full mr-4">
//                   <TbMoodAngryFilled className="text-violet-500 text-xl" />
//                 </div>
//                 <div className="flex flex-row items-center gap-3">
//                   <h3 className="text-2xl font-bold text-purple-500">{allMoodsLength}</h3>
//                   <h3 className="text-xl font-semibold">Moods Felt</h3>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Friends Stats Card */}
//           <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex flex-row items-center">
//                 <div className="p-2 bg-yellow-100 rounded-full mr-4">
//                   <FaUserFriends className="text-yellow-500 text-xl" />
//                 </div>
//                 <div className="flex flex-row items-center gap-3">
//                   <h3 className="text-2xl font-bold text-yellow-500">{allFriendsLength}</h3>
//                   <h3 className="text-xl font-semibold">Buddies Made</h3>
//                   <button
//                     className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl transition-all"
//                     onClick={() => {
//                       setOpenAddFriends({
//                         isShown: true,
//                         type: "add",
//                         data: null,
//                       });
//                     }}
//                     aria-label="Add new note"
//                   >
//                     <MdAdd className="text-3xl" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sleep Stats Card */}
//           <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex flex-row items-center">
//                 <div className="p-2 bg-pink-100 rounded-full mr-4">
//                   <FaBed className="text-pink-500 text-xl" />
//                 </div>
//                 <div className="flex flex-row items-center gap-3">
//                   <h3 className="text-2xl font-bold text-pink-500">{allSleepLength}</h3>
//                   <h3 className="text-xl font-semibold">Sleep Entries</h3>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <Modal
//           isOpen={openAddFriends.isShown}
//           onRequestClose={() => setOpenAddFriends({ isShown: false, type: "add", data: null })}
//           style={{
//             overlay: {
//               backgroundColor: "rgba(0, 0, 0, 0.5)",
//               zIndex: 1000,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             },
//             content: {
//               width: "90%",
//               maxWidth: "1000px",
//               maxHeight: "100vh",
//               borderRadius: "0.5rem",
//               padding: "0",
//               border: "none",
//               boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//               inset: "auto",
//             },
//           }}
//           contentLabel="Friends Management"
//           ariaHideApp={false}
//         >
//           <Friends />
//         </Modal>
//       </div>
//     </div>
//   </>
// );

// }

// export default Profile