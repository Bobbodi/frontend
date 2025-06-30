import React, { useState, useEffect, useRef } from 'react';
import Navbarv3 from '../../components/Navbarv3';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

//components
import SmallEmptyCard from '../../components/EmptyCard/SmallEmptyCard';
import StudyCard from '../../components/Cards/StudyCard';
import NoteCard from '../../components/Cards/NoteCard';
import Modal from "react-modal";
import AddEditNotes from '../Home/AddEditNotes';
import StudySuggested from './StudySuggested';

//images
import Star from "../../assets/images/star.png"
import Toast from '../../components/ToastMessage/Toast';
import AddNotesImg from "../../assets/images/cat.png";

//icons
import { MdAdd } from "react-icons/md";
import { FaPause, FaPlay } from "react-icons/fa6";



//SHOW STUDY ROOM (just sample file)
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"
import { Model } from "../../../public/3_06AM"; 


const Study = () => {
    const [userInfo, setUserInfo] = useState(null); 
    const [allNotes, setAllNotes] = useState([]);
    const [suggestedNotes, setSuggestedNotes] = useState([]); 
    
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

    useEffect(() => {
    const fetchData = async () => {
        await getUserInfo();
        await getAllNotes();
    };
    fetchData();
    }, []);

    useEffect(() => {
        if (allNotes.length > 0) {
            getSuggestions();
        }
    }, [allNotes]);


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
    const studyRoom = 1; 
    const addStudySession = async () => { 
        try { 
            

            const studyEnd = Date.now(); 

            console.log("HERE2");
            console.log(typeof studyStart);
            console.log(studyStart);
            console.log(typeof studyEnd);
            console.log(studyEnd);
            console.log(typeof elapsedTime);
            console.log(elapsedTime);
            console.log(typeof completedTasks);
            console.log(completedTasks);
            console.log(typeof studyRoom);
            
            const response = await axiosInstance.post("/add-study-session", { 
                studyStart, 
                studyEnd,
                elapsedTime,
                completedTasks,
                studyRoom,
            })

            if (response.data && response.data.studyLog) { 
                //getAllJournal()
                showToastMessage("Study Session Logged Succesfully", 'add')
                onClose()
            } 

        } catch (error) { 
            if (error.response && error.response.data && error.response.data.message) { 
                setError(error.response.data.message)
            }
        }
        
    } 

    const endSession = () => { 
        stopTimer();
        addStudySession(); 
    }

    //to load the your tasks section and use the SeeSuggestedTasks
    const getSuggestions = async () => {
        try {
            const tasks = allNotes.filter(note => !note.isDone);
            const response = await axiosInstance.post('/api/suggest-priority-notes', { tasks:  tasks });
    
            if (response.data.result) {
                // set the full note objects for the suggested titles
                setSuggestedNotes(response.data.result);
                
            }
        } catch (error) {
            console.error("Error getting suggestions:", error);
        } 
    };

    return (
  <>
    <Navbarv3 userInfo={userInfo} />

    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row gap-4 w-full">
        
        {/* Left Column - Tasks (25%) */}
        <StudySuggested 
          nodeData={suggestedNotes}
          getSuggestions={getSuggestions}
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
            
       <div className="flex items-center justify-between h-120 w-full">

        <Canvas camera={{ fov: 7, position: [100, 0, 100] }}>
            <ambientLight intensity={5} />
            <OrbitControls
            enableZoom={false}
            minAzimuthAngle={-Math.PI / 2} // -90 degrees
            maxAzimuthAngle={Math.PI / 2}  // +90 degrees
            minPolarAngle={Math.PI / 2.5}  // optional: limit up/down tilt
            maxPolarAngle={Math.PI / 2.5}  // optional: lock vertical angle
            />
            <Model />
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
// ) : nul