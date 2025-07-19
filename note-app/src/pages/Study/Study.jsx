import React, { useState, useEffect, useRef } from 'react';
import Navbarv3 from '../../components/Navbarv3';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { getSuggestions } from '../../utils/helper.js';
import { EMOJIS } from '../../utils/constants.js';

//components
import { Room1Model } from '../../components/3D models/Room1Model.jsx';
import { DogModel } from '../../components/3D models/DogModel.jsx';
import { BeeModel } from '../../components/3D models/BeeModel.jsx';
import { AxolotlModel } from '../../components/3D models/AxolotlModel.jsx';
import { CamelModel } from '../../components/3D models/CamelModel.jsx';
import { CentaurModel } from '../../components/3D models/CentaurModel.jsx';
import { CowModel } from '../../components/3D models/CowModel.jsx';
import { GoatModel } from '../../components/3D models/GoatModel.jsx';
import { MonsterModel } from '../../components/3D models/MonsterModel.jsx';
import { PigmanModel } from '../../components/3D models/PigmanModel.jsx';
import { RainbowDragonModel } from '../../components/3D models/RainbowDragonModel.jsx';
import { SharkModel } from '../../components/3D models/SharkModel.jsx';

import Modal from "react-modal";
import AddEditNotes from '../Home/AddEditNotes';
import StudySuggested from './StudySuggested';

//images
import Toast from '../../components/ToastMessage/Toast';

//icons
import { MdAdd } from "react-icons/md";
import { FaPause, FaPlay } from "react-icons/fa6";
import { IoCaretBackOutline, IoCaretForwardOutline } from "react-icons/io5"

//SHOW STUDY ROOM (just sample file)
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"


const Study = () => {
    const [userInfo, setUserInfo] = useState(null); 
    const [allNotes, setAllNotes] = useState([]);
    const [suggestedNotes, setSuggestedNotes] = useState([]); 
    const [avgStartSleep, setAvgStartSleep] = useState(23);
    const [avgEndSleep, setAvgEndSleep] = useState(9);
    const [productivity, setProductivity] = useState(8);
    
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
    const [allFriends, setAllFriends] = useState([]);

    //FOR STUDY ROOM CANVASES
    const canvases = [
      {id: 1, component: <Room1Model/>, position:[100, 0, 100]}, 
      // {id: 2, component: <Model/>, position:[0, 0, 100]}, 
      // {id: 3, component: <Model/>, position:[100, 0, 0]}, 
      // {id: 4, component: <Model/>, position:[0, 0, 0]}, 
      // {id: 5, component: <Model/>, position:[100, 100, 100]}
    ]

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
        await getAllFriends();
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

    // TODO: Add session record to database 

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
                studyRoom: currentIndex, //index of the studyroom
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

    const Dog = () => {
      const dogRef = useRef();

      return (
        <group ref={dogRef} position={[1, 0.5, 2]} rotation={[0, 1, 0]}>
          <DogModel scale={[7, 7, 7]} />
        </group>
      );
    };

    const Bee = () => {
      const beeRef = useRef();

      return (
        <group ref={beeRef} position={[3, 8, 0]} rotation={[0, -2.5, 0]}>
          <BeeModel scale={[0.3, 0.3, 0.3]} />
        </group>
      );
    };

    const Axolotl = () => {
      const axoRef = useRef();

      return (
        <group ref={axoRef} position={[0, 0, 0]} rotation={[0, -2.5, 0]}>
          <AxolotlModel scale={[0.05, 0.05, 0.05]} />
        </group>
      );
    };

    const Camel = () => {
      const camRef = useRef();

      return (
        <group ref={camRef} position={[7, 0, -2]} rotation={[0, -2.4, 0]}>
          <CamelModel scale={[2, 2, 2]} />
        </group>
      );
    };

    const Centaur = () => {
      const cenRef = useRef();

      return (
        <group ref={cenRef} position={[-4, 0, 6]} rotation={[0, -2.5, 0]}>
          <CentaurModel scale={[2, 2, 2]} />
        </group>
      );
    };

    const Cow = () => {
      const cowRef = useRef();

      return (
        <group ref={cowRef} position={[1, 0, 5]} rotation={[0, 1.5, 0]}>
          <CowModel scale={[2, 2, 2]} />
        </group>
      );
    };


    const Goat = () => {
      const goatRef = useRef();

      return (
        <group ref={goatRef} position={[0, 0, 0]} rotation={[0, -2.5, 0]}>
          <GoatModel scale={[0.1, 0.1, 0.1]} />
        </group>
      );
    };


    const Monster = () => {
      const beeRef = useRef();

      return (
        <group ref={beeRef} position={[0, 0.2, 0]} rotation={[0, -2.5, 0]}>
          <MonsterModel scale={[2, 2, 2]} />
        </group>
      );
    };


    const Pigman = () => {
      const beeRef = useRef();

      return (
        <group ref={beeRef} position={[-4, 7, 0]} rotation={[0, -2.5, 0]}>
          <PigmanModel scale={[1, 1, 1]} />
        </group>
      );
    };


    const RainbowDragon = () => {
      const beeRef = useRef();

      return (
        <group ref={beeRef} position={[0, 8, 0]} rotation={[0, -2.5, 0]}>
          <RainbowDragonModel scale={[1, 1, 1]} />
        </group>
      );
    };

    const Shark = () => {
      const beeRef = useRef();

      return (
        <group ref={beeRef} position={[-3, 0, 8]} rotation={[0, -2.5, 0]}>
          <SharkModel scale={[0.3, 0.3, 0.3]} />
        </group>
      );
    };

    const getAllFriends = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-friends");
            if (response.data && response.data.friends) { 
                setAllFriends(response.data.friends);
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
        <StudySuggested 
          nodeData={suggestedNotes}
          
        />

        {/* Middle Column - Timer */}
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

      <div className="flex items-center justify-center h-120 w-full">
        {/* Canvas */}
        <div className={`${isTimerRunning ? 'ml-21' : 'w-full h-full overflow-hidden rounded'}`}>

          <Canvas camera={{ fov: 10, position: canvases[currentIndex].position }}>
            <ambientLight intensity={0.5} />
            <OrbitControls
              enableZoom={true}
              minAzimuthAngle={-Math.PI}
              // maxAzimuthAngle={Math.PI}
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI}
            />
            <Room1Model/>
             {/* Dog model (to replace with friends avatars) */}
            <Bee/> {/* Bee model*/}
            <Camel/>
            <Centaur/>
            <Cow/>
            <Monster/>
            <Pigman/>
            <RainbowDragon/>
            <Shark/>
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
      
          {/* left arrow */}
          
          
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

 {/* Completed task list
                      
                        {completedTasks.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Tasks completed:</h3>
                                <ul className="list-disc pl-5">
                                    {completedTasks.map((task, index) => (
                                        <li key={index} className="text-gray-700">{task}</li>
                                    ))}
                                </ul>
                            </div>
                        )} */}



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