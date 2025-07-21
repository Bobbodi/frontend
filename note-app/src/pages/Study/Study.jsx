import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbarv3 from '../../components/Navbarv3';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { getSuggestions } from '../../utils/helper.js';
import { EMOJIS } from '../../utils/constants.js';

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

import { useGLTF } from '@react-three/drei';

import Modal from "react-modal";
import AddEditNotes from '../Home/AddEditNotes';
import StudySuggested from './StudySuggested';

//images
import Toast from '../../components/ToastMessage/Toast';

//icons
import { MdAdd } from "react-icons/md";
import { FaPause, FaPlay } from "react-icons/fa6";
import { IoCaretBackOutline, IoCaretForwardOutline } from "react-icons/io5"

//SHOW STUDY ROOM
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Text, ContactShadows } from "@react-three/drei"


const Study = () => {
    const [userInfo, setUserInfo] = useState(null); 
    const [allNotes, setAllNotes] = useState([]);
    const [suggestedNotes, setSuggestedNotes] = useState([]); 
    const [avgStartSleep, setAvgStartSleep] = useState(23);
    const [avgEndSleep, setAvgEndSleep] = useState(9);
    const [productivity, setProductivity] = useState(8);
    const [studyroom, setStudyRoom] = useState(1);
    
    const [hoveredNoteId, setHoveredNoteId] = useState(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [completedTasks, setCompletedTasks] = useState([]);
    const timerRef = useRef(null);
    const tasksContainerRef = useRef(null);
    const [error, setError] = useState(null); 

    const navigate = useNavigate();
    const [isPaused, setIsPaused] = useState(false);

    const [studyStart, setStudyStart] = useState(null); 
    const [studyEnd, setStudyEnd] = useState(null); 
    const [allFriendsAvatar, setAllFriendsAvatar] = useState([]);

    const [todayStudyTime, setTodayStudyTime] = useState("0h 0m");
    const [allStudyTime, setAllStudyTime] = useState("0h 0m");
    const [completedToday, setCompletedToday] = useState(0);

    //FOR STUDY ROOM CANVASES

    const AVATAR_MODELS = { 
      1: {
        "model": "bee/scene.gltf", 
        "position": {
          0: [-2, 3, -1],  // Slightly right and forward
          1: [0, 3.5, 0],       // Original good position (center)
          2: [2, 4, 0.5],   // Slightly left and back
          3: [4, 3.5, 1],     // Higher and slightly right
          4: [6, 3, -1]      // Lower and slightly left
        },
        "rotation": [0, -2.5, 0], 
        "scale": [0.3, 0.3, 0.3],
        "textpos": [0, 1.4, 0], 
        "textrot": [0, Math.PI, 0],
      }, 
      2: {
        "model": "camel/scene.gltf", //Change to Camel
        "position": {
          0: [5.5, -4.9, -7], 
          1: [7, -5.5, -2], 
          2: [6, -5.5, 0], 
          3: [-1, -4.9, -1], 
          4: [3, -4.9, -8], 
        },
        "rotation": [0, -2.4, 0], 
        "scale": [2, 2, 2],
        "textpos": [0, 5.6, 0], 
        "textrot": [0, Math.PI, 0],
      },
      3: {
        "model": "centaur/scene.gltf", 
        "position": {
          0: [-6, -4.5, 4],
          1: [-4, -4.5, 6],
          2: [-2, -4.5, 5],
          3: [-5, -4.5, 3],
          4: [-3, -4.5, 7]
        },
        "rotation": [0, -2, 0], 
        "scale": [2, 2, 2],
        "textpos": [0, 5.5, 0], 
        "textrot": [0, Math.PI, 0],
      },
      4: {
        "model": "cow/scene.gltf", 
        "position": {
          0: [0, -4.5, 6],
          1: [1, -4.5, 5],
          2: [2, -4.5, 4],
          3: [3, -4.5, 7],
          4: [-1, -4.5, 5]
        },
        "rotation": [0, 1.8, 0], 
        "scale": [2, 2, 2],
        "textpos": [0, 3.5, 0], 
        "textrot": [0, -0.8, 0]
      },
      5: {
        "model": "steve/scene.gltf", 
        "position": {
          0: [4, -2.5, 2],
          1: [5, -2.5, 3],
          2: [6, -2.5, 4],
          3: [3, -2.5, 5],
          4: [7, -2.5, 1]
        },
        "rotation": [0, 0.5, 0], 
        "scale": [0.15, 0.15, 0.15],
        "textpos": [0, 3, 0], 
        "textrot": [0, 0, 0]
      },
      6: {
        "model": "monster/scene.gltf", 
        "position": {
          0: [-6, -4.5, 1],
          1: [-5, -4.5, 2],
          2: [-4, -4.5, 3],
          3: [-7, -4.5, 0],
          4: [-3, -4.5, 4]
        },
        "rotation": [0, -2, 0], 
        "scale": [2.5, 2.5, 2.5],
        "textpos": [0, 9.6, 0], 
        "textrot": [0, Math.PI, -0.2]
      },
      7: {
        "model": "pigman/scene.gltf", 
        "position": {
          0: [-4, 3, -1],
          1: [-3, 3, 0],
          2: [-2, 3, 1],
          3: [-5, 3, -2],
          4: [-1, 3, 2]
        },
        "rotation": [0, -1.7, 0], 
        "scale": [1, 1, 1],
        "textpos": [0, 2.2, 0], 
        "textrot": [0, Math.PI, 0]
      },
      8: {
        "model": "rainbowDragon/scene.gltf", 
        "position": {
          0: [-1, 3.7, -0.5], 
          1: [0, 3.9, 0],     
          2: [1, 4.1, 0.5],   
          3: [-0.5, 3.8, 1], 
          4: [0.5, 4.0, -1] 
        },
        "rotation": [-0.2, -2, -0.2], 
        "scale": [1, 1, 1],
        "textpos": [0, 2.5, 0], 
        "textrot": [0, Math.PI, 0]
      },
      9: {
        "model": "shark/scene.gltf", 
        "position": {
          0: [-1, -4.0, 0.5],  
          1: [0, -4.2, 1],     
          2: [1, -4.1, 1.5],   
          3: [0.5, -4.3, 0],    
          4: [-0.5, -4.1, 2]  
        },
        "rotation": [0, -1, 0], 
        "scale": [0.2, 0.2, 0.2],
        "textpos": [1.6, 2.5, 0], 
        "textrot": [0, Math.PI, 0]
      },
      10: {
        "model": "creeper/scene.gltf",
        "position": {
          0: [2.5, -2.3, -0.5],  
          1: [3, -2.5, 0],     
          2: [3.5, -2.4, 0.5],  
          3: [2.0, -2.6, 0.3],   
          4: [4.0, -2.5, -0.3]
        },
        "rotation": [0, 0.5, 0], 
        "scale": [0.15, 0.15, 0.15],
        "textpos": [0, 2.7, 0], 
        "textrot": [0, 0, 0]
      },
    }

    const ROOM_MODELS = { 
      1: {
        "model": Room1Model, 
        "position": [0, -4.5, 0], 
        "rotation": [0, 0, 0], 
        "scale": [1, 1, 1]
      },
      2: { 
        "model": Room2Model, 
        "position": [0, -5, 0], 
        "rotation": [0, -1.5, 0], 
        "scale": [0.1, 0.1, 0.1]
      },
      3: { 
        "model": Room3Model, 
        "position": [0, -5, 0], 
        "rotation": [0, -1.5, 0], 
        "scale": [0.2, 0.2, 0.2]
      },
      4: { 
        "model": Room4Model, 
        "position": [0, -5, 0], 
        "rotation": [0, -1.5, 0], 
        "scale": [0.2, 0.2, 0.2]
      },
      5: { 
        "model": Room5Model, 
        "position": [-2, -2, 2], 
        "rotation": [0, 0, 0], 
        "scale": [0.5, 0.5, 0.5]
      },
      6: { 
        "model": Room6Model, 
        "position": [0, -4, 0], 
        "rotation": [0, -1.5, 0], 
        "scale": [0.008, 0.008, 0.008]
      },
      7: { 
        "model": Room7Model, 
        "position": [0, -5, 0], 
        "rotation": [0, -1.5, 0], 
        "scale": [0.25, 0.25, 0.25]
      },
      
    }

    const UserAvatar = React.memo(({ userId, avatarId, name }) => { 
      const avatar = AVATAR_MODELS[avatarId];
      const posNum = hashUserIdToPosition(userId, 5); 

      console.log(`User ${userId} (Avatar ${avatarId}) - PosIndex: ${posNum}, Position: ${JSON.stringify(avatar.position[posNum])}`);

      

      const model = useGLTF(avatar.model).scene.clone(); //avatar.model

      return ( 
        <group position={avatar.position[posNum]} rotation={avatar.rotation}> 
          <primitive object={model} scale={avatar.scale}/>
          <Text 
            position={avatar.textpos}
            rotation={avatar.textrot}
            fontSize={0.5}
            color="black"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="white"
          > 
            {name}
          </Text> 
        </group>
      )
    });

    function hashUserIdToPosition(userId, maxPos) {
      // Simple hash: Sum character codes and mod by maxPos
      if (userId == null) return null; 
      let hash = 0;
      for (let i = 0; i < userId.length; i++) {
        hash = (hash + userId.charCodeAt(i)) % maxPos;
      }
      return hash;
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

    const [currentIndex, setCurrentIndex] = useState(0); 
    const goBack = () => {
      setCurrentIndex((prev) => {
        const newIndex = prev === 0 ? canvases.length - 1 : prev - 1;
        console.log("goBack becomes " + newIndex);
        return newIndex;
      });
    };

    const goForward = () => {
      setCurrentIndex((prev) => {
        const newIndex = prev === canvases.length - 1 ? 0 : prev + 1;
        console.log("goForward becomes " + newIndex);
        return newIndex;
      });
    };

    useEffect(() => {
    const fetchData = async () => {
        await getUserInfo();
        await getAllNotes();
        await getAllSleep(); 
        await getAllMood(); 
        await getAllFriendsAvatar();
        await getTodayStudyTime(); 
        await getAllStudyTime(); 
    };
    fetchData();
    }, []);

    useEffect(() => {
      if (allNotes.length > 0) {
        callGetSuggestions();
      }
    }, [allNotes]);  // Runs when `allNotes` changes


    const getUserInfo = async () => { 
        try { 
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) { 
                setUserInfo(response.data.user);
                setStudyRoom(response.data.user.studyroom);
            }
        } catch (error) { 
            if (error.response.status == 401) { 
                localStorage.clear(); 
                navigate("/login");
            }
        }
    };

    //Modal and Taost 
    const [openAddEditModal, setOpenAddEditModal] = React.useState({
            isShown: false, 
            type: "add",
            data: null,
        });
    
    const [showToastMsg, setShowToastMsg] = useState({ 
        isShown: false, 
        type: "add",
        message: ""
    })

    //EDIT and DELETE note 
    const handleEdit = (noteDetails) => { 
        setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
    }

    //delete Notes
    const deleteNote = async (data) => {
      const noteId = data._id;
      try { 
        
        const response = await axiosInstance.delete("/delete-note/" + noteId)

        if (response.data && response.data.error === false) { 
          
          showToastMessage("Task Deleted Succesfully", 'delete')
          getAllNotes()
          onClose()
        } 

      } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
          setError("beep boop error time")
        }
      }
    };

    const handleCloseToast = () => { 
        setShowToastMsg({
            isShown: false, 
            message: "",
        })
    };

    const showToastMessage = (message, type) => { 
        setShowToastMsg({
            isShown: true, 
            message,
            type
        })
    };

    const getAllNotes = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data && response.data.notes) { 
                setAllNotes(response.data.notes);
                setCompletedToday(response.data.notes.filter(note => new Date(note.whenDone).getDate() == new Date().getDate() && note.isDone).length);
            }
        } catch (error) { 
            console.log("Error fetching notes:", error);
        }
    };

    const getAllSleep = async () => { 
      try { 
        const response = await axiosInstance.get("/get-all-sleep");
        if (response.data && response.data.sleeps) { 
          const sleepData = response.data.sleeps; 
          if (sleepData.length > 0) {
            const numRecords = sleepData.length > 0 ? sleepData.length : 1;
            setAvgStartSleep(sleepData.reduce((total, record) => { 
              const sleepStart = new Date(record.sleepStart).getHours();
              return total + sleepStart; 
            }, 0) / numRecords); 
            setAvgEndSleep(sleepData.reduce((total, record) => { 
              const sleepEnd = new Date(record.sleepEnd).getHours();
              return total + sleepEnd; 
            }, 0) / numRecords); 
          } else {
            setAvgStartSleep(23); // Default value if no records  
            setAvgEndSleep(9); // Default value if no records
          }
        }
      } catch (error) { 
          console.log("beep boop error time", error); 
      }
    }

    const getAllMood = async () => { 
      try { 
          const response = await axiosInstance.get("/get-all-mood");
          if (response.data && response.data.moods) { 
              const moodData = response.data.moods; 
              setProductivity(moodData.reduce((total, record) => {
                const moodEmoji = record.mood; 
                const moodScore = EMOJIS[moodEmoji]?.score || 0; 
                return total + moodScore
              }, 0) / moodData.length);
          }
      } catch (error) { 
          console.log("beep boop error time")
      }
    }

    //can use updateIsDone to format the whenDone of the Note 
    const updateIsDone = async (note) => {
        const noteId = note._id;
        try {
            const response = await axiosInstance.put("/update-note-done/" + noteId, { 
                isDone: true
            });
            if (response.data && response.data.note) {
                setAllNotes(prev => prev.map(n => 
                    n._id === note._id ? { ...n, isDone: true } : n
                ));
                if (isTimerRunning) {
                    setCompletedTasks(prev => [...prev, note]);
                }
            }
        } catch (error) {
            console.log("Error updating note:", error);
        }
    };

    const startTimer = () => {
        setIsTimerRunning(true);
        setStudyStart(Date.now()); 
        setCompletedTasks([])
        setIsPaused(false);
        setElapsedTime(0);
        timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        setIsTimerRunning(false);
        setIsPaused(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const togglePause = () => {
        if (isPaused) {
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            setIsPaused(true);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const addStudySession = async () => { 
        try { 
            const studyEnd = Date.now(); 
            // console.log("studyStart: " + studyStart);
            // console.log("studyEnd: " + studyEnd);
            // console.log("elapsedTime: " + elapsedTime);
            // console.log("completedTasks: " + completedTasks);
            // console.log("currentIndex: " + currentIndex)
            const response = await axiosInstance.post("/add-study-session", { 
                studyStart, 
                studyEnd,
                elapsedTime,
                completedTasks,
                studyRoom: studyroom, //index of the studyroom
            })

            if (response.data && response.data.studyLog) { 
                //getAllJournal()
                showToastMessage("Study Session Logged Succesfully", 'add')
            } 

        } catch (error) { 
          console.log(error);
            if (error.response && error.response.data && error.response.data.message) { 
                setError(error.response.data.message)
            }
        }
        
    } 

    const endSession = () => { 
        stopTimer();
        addStudySession(); 
    }

    const callGetSuggestions = () => { 
      setSuggestedNotes(getSuggestions(allNotes.filter(note => !note.isDone), avgStartSleep, avgEndSleep, productivity));
    }

    const getAllFriendsAvatar = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-friends-avatar");
            if (response.data && response.data.friends) { 
                setAllFriendsAvatar(response.data.friends);
            }
        } catch (error) { 
            if (error.response.status == 401) { 
                localStorage.clear(); 
                navigate("/login");
            }
        }
    }


    const getTodayStudyTime = async () => { 
        try { 
            const response = await axiosInstance.get("/get-today-study-time");
            if (response.data && response.data.total) { 
                setTodayStudyTime(response.data.total);
            }
        } catch (error) { 
            if (error.response.status == 401) { 
                localStorage.clear(); 
                navigate("/login");
            }
        }
    }


    const getAllStudyTime = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-study-time/");
            if (response.data && response.data.total) { 
                setAllStudyTime(response.data.total);
            }
        } catch (error) { 
            if (error.response.status == 401) { 
                localStorage.clear(); 
                navigate("/login");
            }
        }
    }



return (
  <>
    <Navbarv3 userInfo={userInfo} />

    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-row gap-4 w-full">
        {/* Left Column - Tasks (25%) */}
        <div className="flex flex-col">
          <div className="space-x-4 flex flex-row">
            <div className="ml-8 p-4 bg-amber-50 rounded-xl shadow-sm border border-amber-100">
              <h3 className="text-sm font-medium text-amber-600 mb-1">All time</h3>
              <p className="text-2xl font-semibold text-amber-700">
                {allStudyTime}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl shadow-sm border border-purple-100">
              <h3 className="text-sm font-medium text-purple-600 mb-1">Today</h3>
              <p className="text-2xl font-semibold text-purple-800">
                {todayStudyTime}
              </p>
            </div>

            <div className="p-4 bg-pink-50 rounded-xl shadow-sm border border-pink-100">
              <h3 className="text-sm font-medium text-pink-600 mb-1">Tasks Done</h3>
              <p className="text-2xl font-semibold text-pink-800">
                {completedToday}
              </p>
            </div>
          </div> 
          <div> 
            <StudySuggested nodeData={suggestedNotes} />
          </div> 
        </div> 

        {/* Right Column - Canvas */}
        <div className="relative flex-1 h-[calc(100vh-130px)] overflow-hidden">
          {/* Full-screen Canvas */}
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ fov: 9, position: [30, 80, 30] }}>
              <ambientLight intensity={0} />
              <OrbitControls
                enableZoom={true}
                minAzimuthAngle={-Math.PI}
                minPolarAngle={Math.PI / 2.5}
                maxPolarAngle={Math.PI}
              />
              <UserRoom roomId={studyroom} />
              {allFriendsAvatar
                .filter(friend => friend?._id)
                .map((friend) => (
                
                  <UserAvatar
                    key={friend._id}
                    avatarId={friend.avatar ?? 1}
                    name={friend.fullName}
                    userId={friend._id}
                  />
                
              ))}
              <Environment preset="apartment" />
            </Canvas>
          </div>

          <div className="absolute top-0 right-0 z-10">
            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg flex flex-col">
              <div className="flex flex-row items-center justify-between gap-4">
                <span className="text-3xl font-mono font-bold text-gray-800">
                  {formatTime(elapsedTime)}
                </span>

                {!isTimerRunning ? (
                  <button
                    onClick={startTimer}
                    className="px-4 py-2 bg-blue-500/90 hover:bg-blue-600/90 text-white text-sm font-semibold rounded-full shadow transition duration-200"
                  >
                    START
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={togglePause}
                      className={`px-3 py-2 ${
                        isPaused ? "bg-green-500/90 hover:bg-green-600/90" : "bg-gray-500/90 hover:bg-gray-600/90"
                      } text-white text-sm font-medium rounded-full flex items-center gap-1 shadow transition duration-200`}
                    >
                      {isPaused ? <FaPlay size={12} /> : <FaPause size={12} />}
                      {isPaused ? "RESUME" : "PAUSE"}
                    </button>

                    <button
                      onClick={endSession}
                      className="px-3 py-2 bg-red-500/90 hover:bg-red-600/90 text-white text-sm font-semibold rounded-full shadow transition duration-200"
                    >
                      END
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal */}
    <Modal
      isOpen={openAddEditModal.isShown}
      onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000
        },
        content: {
          maxHeight: "90vh",
          borderRadius: "0.5rem",
          padding: "0",
          border: "none",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }
      }}
      contentLabel="Add/Edit Note"
      className="w-[45%] max-w-3xl overflow-scroll"
      overlayClassName="fixed inset-0 flex items-center justify-center p-4"
    >
      <AddEditNotes
        type={openAddEditModal.type}
        nodeData={openAddEditModal.data}
        getAllNotes={getAllNotes}
        onClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        showToastMessage={showToastMessage}
      />
    </Modal>

    <Toast
      isShown={showToastMsg.isShown}
      message={showToastMsg.message}
      type={showToastMsg.type}
      onClose={handleCloseToast}
    />
  </>
);
}


export default Study; 


{/* Middle Column - Timer
        <div className={`p-6 bg-white rounded-2xl flex flex-col items-center ${isTimerRunning ? "w-1/2" : "w-2/3"}`}>
          
          <div className="flex flex-row items-center justify-between gap-6"> 
            <span className="text-6xl font-mono font-bold text-gray-800">
              {formatTime(elapsedTime)}
            </span>

            
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-full shadow transition duration-200"
                >
                  START
                </button>
              ) : (
                <>
                  <button
                    onClick={togglePause}
                    className={`px-6 py-3 ${
                      isPaused ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                    } text-white text-lg font-medium rounded-full flex items-center gap-2 shadow transition duration-200`}
                  >
                    {isPaused ? <FaPlay /> : <FaPause />}
                    {isPaused ? "RESUME" : "PAUSE"}
                  </button>

                  <button
                    onClick={endSession}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-full shadow transition duration-200"
                  >
                    END
                  </button>
                </>
              )}
        </div> 

      <div className="flex items-center justify-center w-full">
 
        <div className={`${isTimerRunning ? 'ml-21' : 'w-full h-[calc(100vh-300px)] overflow-hidden rounded'}`}>

          <Canvas camera={{ fov: 1, position: [0, 20, 2] }}>
            <ambientLight intensity={0.5} />
            <OrbitControls
              enableZoom={true}
              minAzimuthAngle={-Math.PI}
              // maxAzimuthAngle={Math.PI}
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI}
            />
            <UserRoom 
              roomId={studyroom}
            />
             {/* Dog model (to replace with friends avatars) 
            {allFriendsAvatar.map((friend) => {
              return (
                <UserAvatar
                  key={friend._id}
                  avatarId={friend.avatar ?? 1}
                />
              )

            })}
            <Environment preset="sunset" />
            <ContactShadows
              opacity={0.5}
              scale={100}
              blur={1}
              far={10}
              resolution={256}
              color="#000000"
            />
          </Canvas>
      
          left arrow
          
          
        </div> 
      </div>
      </div> 
      </div>
    </div> 

 Completed task list
                      
                        {completedTasks.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Tasks completed:</h3>
                                <ul className="list-disc pl-5">
                                    {completedTasks.map((task, index) => (
                                        <li key={index} className="text-gray-700">{task}</li>
                                    ))}
                                </ul>
                            </div>
                        )} 



// import React from 'react'
// import Navbarv3 from '../../components/Navbarv3'
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../utils/axiosInstance';
// import EmptyCard from '../../components/EmptyCard/EmptyCard';
// import NoteCard from '../../components/Cards/NoteCard';
// import AddNotesImg from "../../assets/images/cat.png"

// const Study = () => {
//     const [userInfo, setUserInfo] = useState(null); 
//     const [allNotes, setAllNotes] = useState([]);
//     const [hoveredNoteId, setHoveredNoteId] = useState(null);

//     const navigate = useNavigate();

//     useEffect(() => { 
//         getUserInfo(); 
//         getAllNotes();
//         return () => {};
//     }, [])
        

//     const getUserInfo = async () => { 
//         try { 
//             const response = await axiosInstance.get("/get-user");
//             if (response.data && response.data.user) { 
//                 setUserInfo(response.data.user);
//             }
//         } catch (error) { 
//             if (error.response.status == 401) { 
//                 localStorage.clear(); 
//                 navigate("/login");
//             }
//         }
//     }

//     //Get All notes
//     const getAllNotes = async () => { 
//         try { 
//             const response = await axiosInstance.get("/get-all-notes");
//             if (response.data && response.data.notes) { 
//                 setAllNotes(response.data.notes);
//             }
//         } catch (error) { 
//             console.log("beep boop error time")
//         }
//     }

//   return (
//     <>
//         <Navbarv3 userInfo={userInfo}  />
//         <div>
//         Study with friends

//             <button className="">
//                 Join a study room
//             </button>

//         </div> 

//         <div> 
//         Solo study 

// {isTimerRunning ? null : <>
//           <button 
//             className={`absolute right-120 top-2/3 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all 
//               duration-200 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 hover:scale-110`}
//             onClick={()=>goBack()}
//             disabled={isTimerRunning}> {/* button disabled (cannot change studyroom once timer starts)*/}
//             <IoCaretBackOutline size={30}/>
//           </button>
          
          
//           <button 
//             className={`absolute right-[60px] top-2/3 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all 
//               duration-200 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 hover:scale-110`}
//             onClick={()=>goForward()}
//             disabled={isTimerRunning}> {/* button disabled (cannot change studyroom)*/}
//             <IoCaretForwardOutline size={30} />
//           </button>
//           </>

//             {/*let user see all tasks and can mark them as completed */}
//             {allNotes.filter(note => !note.isDone).length > 0 ? (
//                 <div className="grid grid-cols-1 sm:w-1/2 lg:w-1/3 gap-6">
//                 {allNotes
//                     .filter(note => !note.isDone)
//                     .map((item) => (
//                     <div key={item._id} className="h-full">
//                         <NoteCard 
//                         title={item.title}
//                         date={item.createdOn}
//                         content={item.content}
//                         priority={item.priority}
//                         deadline={item.dueDate}
//                         tags={item.tags}
//                         isDone={item.isDone}
//                         onEdit={() => handleEdit(item)}
//                         onDelete={() => deleteNote(item)}
//                         onDoneNote={() => updateIsDone(item)}
//                         hovered={hoveredNoteId===item._id}
//                         onMouseEnter={() => setHoveredNoteId(item._id)}
//                         onMouseLeave={() => setHoveredNoteId(null)}
//                         />
//                     </div>
//                     ))}
//                 </div>
//                 ) : (
//                     <EmptyCard 
//                     imgSrc={AddNotesImg} 
//                     message="No upcoming tasks - add a new task or check your completed tasks below!"
//                     />
//                 )}
                
//             {/* Show a timer */}
//             <button className="">
//                 Start timer
//             </button>

//             <p> Time elapsed </p>
//             <p> Tasks completed </p> 
//             {/*Show list of tasks that were completed when the timer started*/}


//         </div>
        
//     </>
//   )
// }

// export default Study
// {allNotes.filter(note => !note.isDone).length > 0 ? (
// <div 
//     ref={tasksContainerRef}
//     className="grid grid-cols-1 gap-4 max-h-70 overflow-y-auto p-2"
//     style={{ scrollbarWidth: 'none' }}
// >
//     {allNotes
//         .filter(note => !note.isDone)
//         .map((item) => (
//             <div key={item._id} className="h-full">
//                 <NoteCard 
//                     title={item.title}
//                     date={item.createdOn}
//                     content={item.content}
//                     priority={item.priority}
//                     dueDate={item.dueDate}
//                     tags={item.tags}
//                     isDone={item.isDone}
//                     onEdit={() => handleEdit(item)}
//                     onDelete={() => deleteNote(item)}
//                     onDoneNote={() => updateIsDone(item)}
//                     hovered={hoveredNoteId===item._id}
//                     onMouseEnter={() => setHoveredNoteId(item._id)}
//                     onMouseLeave={() => setHoveredNoteId(null)}
//                 />
//             </div>
//         ))}
// </div>
// ) : (
// <SmallEmptyCard 
// imgSrc={Star} 
// message="All done!"
// />
// )}

// {isTimerRunning ? (
//     <div className="w-1/6 bg-white rounded-xl shadow-md p-4">
//         <h3 className="text-xl font-semibold mb-4">History</h3>
//         {completedTasks.length > 0 ? (
//             <div className="mt-4">
//                 <h3 className="font-semibold mb-2">Tasks completed:</h3>
//                 <ul className="list-disc pl-5 space-y-1">
//                     {completedTasks.map((task, index) => (
//                         <li key={index} className="text-gray-700">{task.title}</li>
//                     ))}
//                 </ul>
//             </div>
//         ) : (
//             <p className="text-gray-500">No tasks completed yet</p>
//         )}
//     </div>
// ) : null;