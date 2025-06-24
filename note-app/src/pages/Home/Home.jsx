import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import AddEditNotes from "./AddEditNotes";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

import Toast from "../../components/ToastMessage/Toast";
import Modal from "react-modal";
import Loading from "../../components/Loading/Loading";

import { MdAdd } from "react-icons/md";
import { RiExpandDiagonalLine } from "react-icons/ri";
import Calendar from "../../components/Calender/Calender";
import SeeAllSuggested from "./SeeAllSuggested";
import { getRelativeDate } from "../../utils/helper.js"


const Home = () => {

    
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

    const [openAllSuggestedModal, setAllSuggestedModal] = React.useState({
        isShown: false, 
        type: "see",
        data: null,
    });
    
    const [allNotes, setAllNotes] = useState([]);
    const [allDoneNotes, setAllDoneNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null); 
    const [error, setError] = useState(null);
    const [suggestedNotes, setSuggestedNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    //used when i was doing deepseek api const [newDay, setNewDay] = useState(false);

    //for calendar
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [isSearch, setIsSearch] = useState(false);
    const [hoveredNoteId, setHoveredNoteId] = useState(null);

    const navigate = useNavigate(); 

    const handleEdit = (noteDetails) => { 
        setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
    }

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


    //getUserInfo
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

    //Get All notes
    const getAllNotes = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data && response.data.notes) { 
                setAllNotes(response.data.notes);
                setAllDoneNotes(response.data.notes.filter((note) => note.isDone))
            }
        } catch (error) { 
            console.log("beep boop error time")
        }
    }


    //delete Notes
    const deleteNote = async (data) => {
      const noteId = data._id;
      try { 
        console.log("deleteing")
        const response = await axiosInstance.delete("/delete-note/" + noteId)

        if (response.data && response.data.error === false) { 
          console.log("here3")
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

    //Search for a note 
    const onSearchNote = async (query) => { 
        if (!query || query.trim() === "") {
            setIsSearch(false);
            getAllNotes();
            return;
        }
        try { 
            const response = await axiosInstance.get('/search-notes', {
                params: { query },
            })

            if (response.data && response.data.notes) { 
                setIsSearch(true); 
                setAllNotes(response.data.notes);
            }
        } catch (error) { 
            console.log(error);
        }
    }

    const updateIsDone = async (nodeData) => { 
        const noteId = nodeData._id;
        try { 
            console.log("here2")
            const response = await axiosInstance.put("/update-note-done/" + noteId, { 
                "isDone": !nodeData.isDone
            })

            if (response.data && response.data.note) { 
                console.log("here3")
                showToastMessage("Task Updated Succesfully")
                getAllNotes()
            
            } 

        } catch (error) { 
            if (error.response && error.response.data && error.response.data.message) { 
                setError(error.response.data.message)
            }
        }
    }


    const handleClearSearch = () => { 
        setIsSearch(false);
        getAllNotes(); 
    }

    useEffect(() => { 
        getAllNotes();
        getUserInfo(); 
    }, [])

    useEffect(() => {
        // Only run if allNotes has loaded and is not empty and Is New Day
        if (allNotes.length > 0) {
            getSuggestions();
        }
    }, [allNotes]);
    
    
    //AI suggested tasks 
    const getSuggestions = async () => {
        setIsLoading(true);
        try {
            const tasks = allNotes.filter(note => !note.isDone);
            const response = await axiosInstance.post('/api/suggest-priority-notes', { tasks:  tasks });
                // notes: incompleteNotes.map(note => ({
                //     title: note.title,
                //     priority: note.priority,
                //     dueDate: note.dueDate,
                //     content: note.content
                // }))
                
            //});
    
            
            if (response.data.result) {
                // set the full note objects for the suggested titles
                setSuggestedNotes(response.data.result);
            }
        } catch (error) {
            console.error("Error getting suggestions:", error);
        } finally { 
            setIsLoading(false);
        }
    };


    return (
    <>
        <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

        <div className="min-h-screen bg-gray-50">
            <div className="container gap-4 mx-auto px-4 py-8 flex flex-col lg:flex-row justify-center">

                {/* Main Content Area */}

                <div className="flex justify-center items-center w-full lg:w-[40%] rounded-xl shadow-lg p-6 mb-6">
                    {/* Today's suggested tasks section */}
                    {/*<h1 className="text-2xl font-bold text-gray-800 mb-6">Calender</h1>*/}
                    {/* Show loading page while fetching data */}
                    <Calendar 
                        selectedDate={selectedDate} 
                        setSelectedDate={setSelectedDate}
                        highlightDates={Object.keys(suggestedNotes)}
                        />
                </div> 
                

                
            <div className="max-h-100 w-full lg:w-[40%] rounded-xl shadow-lg p-6 mb-6">
            {/* Tasks Section Header */}
            <div className="flex flex-row justify-between items-center mb-3">
                <p className="text-2xl font-bold text-gray-800">
                {getRelativeDate(selectedDate)}
                </p>
                {/* See all Button - now properly contained */}
                <div className="relative">
                <button
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl transition-all"
                    onClick={() => {
                    setAllSuggestedModal({
                        isShown: true,
                        type: "see",
                        data: suggestedNotes,
                    });
                    }}
                    aria-label="See all suggested notes schedule"
                >
                    <RiExpandDiagonalLine className="text-2xl" />
                </button>
                </div>
            </div>

            {/* Combined notes container with proper scrolling */}
            <div className="mt-3 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]" style={{ scrollbarWidth: 'thin' }}>
                {/* Completed notes for selected day */}
                {selectedDate && allDoneNotes
                .filter((task) => {
                    const noteDate = new Date(task.whenDone).toDateString();
                    const selectedDateStr = new Date(selectedDate).toDateString();
                    return noteDate === selectedDateStr;
                })
                .map((task) => (
                    <div key={task._id} className="h-full">
                    <NoteCard 
                        title={task.title}
                        date={task.createdOn}
                        content={task.content}
                        priority={task.priority}
                        dueDate={task.dueDate}
                        tags={task.tags}
                        isDone={task.isDone}
                        isEvent={task.isEvent}
                        onEdit={() => handleEdit(task)}
                        onDelete={() => deleteNote(task)}
                        onDoneNote={() => updateIsDone(task)}
                        hovered={hoveredNoteId === task._id}
                        onMouseEnter={() => setHoveredNoteId(task._id)}
                        onMouseLeave={() => setHoveredNoteId(null)}
                    />
                    </div>
                ))
                }

                {/* Tasks due on selected day */}
                {Object.entries(suggestedNotes)
                .filter(([dateString]) => {
                    if (!selectedDate) return true;
                    const noteDate = new Date(dateString).toDateString();
                    const selectedDate2 = new Date(selectedDate).toDateString();
                    return noteDate === selectedDate2;
                })
                .map(([dateString, tasks]) => (
                    tasks.map((item) => (
                    <div key={item._id} className="h-full">
                        <NoteCard 
                        title={item.title}
                        date={item.createdOn}
                        content={item.content}
                        priority={item.priority}
                        dueDate={item.dueDate}
                        tags={item.tags}
                        isDone={item.isDone}
                        isEvent={item.isEvent}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => deleteNote(item)}
                        onDoneNote={() => updateIsDone(item)}
                        hovered={hoveredNoteId===item._id}
                        onMouseEnter={() => setHoveredNoteId(item._id)}
                        onMouseLeave={() => setHoveredNoteId(null)}
                        />
                    </div>
                    ))
                ))
                }
            </div>
            </div> 
        
                    
                    
            
        {/* Add Button */}
        <button
            className="fixed w-16 h-16 flex items-center justify-center rounded-full bottom-10 right-10 bg-yellow-500 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl transition-all z-50"
            onClick={() => {
            setOpenAddEditModal({
                isShown: true,
                type: "add",
                data: null,
            })
            }}
            aria-label="Add new note"
        >
            <MdAdd className="text-3xl" />
        </button>
        
        {/* Modal for see all suggested notes schedule */}
        <Modal 
            isOpen={openAllSuggestedModal.isShown}
            onRequestClose={() => setAllSuggestedModal({ isShown: false, type: "see", data: null })}
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
                    boxShadow: "0 10px 0px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }
            }}
            contentLabel="See all Note schedule"
            className="w-[90%]"
            overlayClassName="fixed inset-0 flex items-center justify-center p-4"  
            ariaHideApp={false}
        >
            <SeeAllSuggested
                type={openAllSuggestedModal.type}
                nodeData={openAllSuggestedModal.data}
                getSuggestions={getSuggestions}
                onClose={() => { 
                    setAllSuggestedModal({ isShown:false, type:"see", data:null});
                }}
                showToastMessage={showToastMessage}
            />
        </Modal>

        {/* Modal for AddEditModal */}
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
                    boxShadow: "0 10px 0px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }
            }}
            contentLabel="Add/Edit Note"
            className="lg:w-[45%] md:w-[60%] w-[90%]"
            overlayClassName="fixed inset-0 flex items-center justify-center p-4"
            ariaHideApp={false}  
        >

        
            <AddEditNotes 
                type={openAddEditModal.type}
                nodeData={openAddEditModal.data}
                getAllNotes={getAllNotes}
                onClose={() => { 
                    setOpenAddEditModal({ isShown:false, type:"add", data:null});
                }}
                showToastMessage={showToastMessage}
            />

        </Modal>
        </div>

        <Toast
            isShown={showToastMsg.isShown}
            message={showToastMsg.message}
            type={showToastMsg.type}
            onClose={handleCloseToast}
        />
    
    </div> {/* closes the container div */}
    
</>
)
}

export default Home

{/* //<div> 
                        {/* Filter for on this day tasks}
                        {Object.entries(suggestedNotes)
                        .map(([dateString, tasks]) =>  (
                        <div className="bg-yellow p-5 m-3 rounded-3xl border-2 border-gray-200 shadow-xl"> 
                            <p className="text-2xl font-bold text-gray-800 mb-5">
                                {getRelativeDate(dateString)}
                            </p>
            
                            <div key={dateString} className="mb-6 overflow-y-auto max-h-60"
                            style={{ scrollbarWidth: 'none' }}>
                            
                            <div className="space-y-3">
                                {tasks.map((item) => (
                                    <div key = {item._id} className="h-full">
                                        <NoteCard 
                                            title={item.title}
                                            date={item.createdOn}
                                            content={item.content}
                                            priority={item.priority}
                                            dueDate={item.dueDate}
                                            tags={item.tags}
                                            isDone={item.isDone}
                                            onEdit={() => handleEdit(item)}
                                            onDelete={() => deleteNote(item)}
                                            onDoneNote={() => updateIsDone(item)}
                                            hovered={hoveredNoteId===item._id}
                                            onMouseEnter={() => setHoveredNoteId(item._id)}
                                            onMouseLeave={() => setHoveredNoteId(null)}
                                        />
                                    </div> 
                                ))}
                            </div>
                            </div>
                           
                        
                      
                        ) : (
                            <EmptyCard 
                            imgSrc={AddNotesImg} 
                            message="No upcoming tasks - add a new task or check your completed tasks below!"
                            />
                        )}
                        </div> 
                </div> 
            </div> 
        </div></div>}
// allNotes.filter(note = !note.isDone).length  0 ? (
//                         <div className="grid grid-cols-1 gap-6 max-h-80 overflow-y-auto p-2"
//                                     style={{ scrollbarWidth: 'none' }}>
//                             {allNotes
//                                 .filter(note => !note.isDone)
//                                 .map((item) => (
//                                 <div key={item._id} className="h-full">
//                                     <NoteCard 
//                                     title={item.title}
//                                     date={item.createdOn}
//                                     content={item.content}
//                                     priority={item.priority}
//                                     dueDate={item.dueDate}
//                                     tags={item.tags}
//                                     isDone={item.isDone}
//                                     onEdit={() => handleEdit(item)}
//                                     onDelete={() => deleteNote(item)}
//                                     onDoneNote={() => updateIsDone(item)}
//                                     hovered={hoveredNoteId===item._id}
//                                     onMouseEnter={() => setHoveredNoteId(item._id)}
//                                     onMouseLeave={() => setHoveredNoteId(null)}
//                                     />
//                                 </div>
//                                 ))}
{/* <div className="w-full bg-gray-300 rounded-xl shadow-lg p-6 my-6">
                {/* Completed Tasks Section }
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Completed Tasks</h1>
                
                {/* Filter for completed tasks (isDone = true) }
                {allNotes.filter(note => note.isDone).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allNotes
                        .filter(note => note.isDone)
                        .map((item) => (
                        <div key={item._id} className="h-full opacity-80">
                            <NoteCard 
                            title={item.title}
                            date={item.createdOn}
                            content={item.content}
                            priority={item.priority}
                            dueDate={item.dueDate}
                            tags={item.tags}
                            isDone={item.isDone}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => deleteNote(item)}
                            onDoneNote={() => updateIsDone(item)}
                            hovered={hoveredNoteId===item._id}
                            onMouseEnter={() => setHoveredNoteId(item._id)}
                            onMouseLeave={() => setHoveredNoteId(null)}
                            />
                        </div>
                        ))}
                    </div>
                ) : (
                    <EmptyCard 
                    imgSrc={NoData} 
                    message="No tasks completed yet - keep going!"
                    />
                )}
                </div> 
            */}

// {selectedDate === new Date() ? "Today" : new Date(selectedDate).toLocaleDateString('en-US', {
//                             weekday: 'long',
//                             year: 'numeric',
//                             month: 'long',
//                             day: 'numeric'
//                         })}
//fixed w-16 h-16 flex items-center justify-center rounded-full bottom-10 right-10 bg-yellow-500 hover:bg-red text-white shadow-lg hover:shadow-xl transition-all z-50

// { isLoading ? (
//                     <Loading/> 
//                     ) : (
//                     /* Filter for incomplete tasks (isDone = false) */
//                     suggestedNotes.length > 0 ? (
//                         <div className="grid grid-cols-1 gap-6">
//                         {suggestedNotes
//                             // .filter(note => !note.isDone)
//                             // .slice(0, 3)
//                             .map((item) => (
//                             <div key={item._id} className="h-full">
//                                 <NoteCard 
//                                 title={item.title}
//                                 date={item.createdOn}
//                                 content={item.content}
//                                 priority={item.priority}
//                                 dueDate={item.dueDate}
//                                 tags={item.tags}
//                                 isDone={item.isDone}
//                                 onEdit={() => handleEdit(item)}
//                                 onDelete={() => deleteNote(item)}
//                                 onDoneNote={() => updateIsDone(item)}
//                                 hovered={hoveredNoteId===item._id}
//                                 onMouseEnter={() => setHoveredNoteId(item._id)}
//                                 onMouseLeave={() => setHoveredNoteId(null)}
//                                 />
//                             </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <EmptyCard 
//                         imgSrc={Star} 
//                         message="Fabulous! You've finished everything!"
//                         />
//                     )
//                 )}
//                 </div>

//grid grid-cols-3 gap-5 m-5

//sm:grid-cols-2 lg:grid-cols-3
// return (
//         <>
//         <Navbar userInfo={userInfo} onSearchNote = {onSearchNote} handleClearSearch = {handleClearSearch}/>

//         <div className="container mx-auto"> 
//                 {allNotes.length > 0 ? 
//                     (<div className="grid grid-cols-3 gap-5 m-5">
//                         {allNotes.map((item) => (
//                         <NoteCard 
//                             key={item._id}
//                             title={item.title}
//                             date={item.createdOn}
//                             content={item.content}
//                             priority={item.priority}
//                             deadline={item.dueDate}
//                             tags={item.tags}
//                             isDone={item.isDone}
//                             onEdit={() => handleEdit(item)}
//                             onDelete={() => deleteNote(item)}
//                             onDoneNote={() => updateIsDone(item)}
//                             hovered={hoveredNoteId===item._id}
//                             onMouseEnter={() => setHoveredNoteId(item._id)}
//                             onMouseLeave={() => setHoveredNoteId(null)}
//                         />
//                     ))} 
//                     </div>)
//                 : <EmptyCard 
//                 imgSrc = {isSearch ? NoData : AddNotesImg} 
//                 message = {isSearch 
//                     ? "Oops! No notes match your search"
//                     : "Click the '+' button at the bottom to keep track of your tasks and thoughts!"
//                 }
//                 />
//             }
            
//         </div>

//         <button
//             className="fixed w-16 h-16 flex items-center justify-center rounded-full bottom-10 right-10 bg-yellow hover:bg-red hover:shadow-2xl transition-shadow z-50"
//             onClick={() => {
//                 setOpenAddEditModal({
//                     isShown: true,
//                     type: "add",
//                     data: null,
//                 });
//             }}>
//             <MdAdd className="text-2xl text-green" />
//         </button>

//         <Modal 
//             isOpen={openAddEditModal.isShown}
//             onRequestClose={() => {}}
//             style={{
//                 overlay: {
//                     backgroundColor: "rgba(0, 0, 0, 0.5)",
//                 }
//             }}
//             contentLabel=""
//             className="w-[50%] max-h-6/7 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
//         >
//             <AddEditNotes 
//                 type={openAddEditModal.type}
//                 nodeData={openAddEditModal.data}
//                 getAllNotes={getAllNotes}
//                 onClose={() => { 
//                     setOpenAddEditModal({ isShown:false, type:"add", data:null});
//                 }}
//                 showToastMessage={showToastMessage}
//             />
//         </Modal>

//         <Toast
//             isShown = {showToastMsg.isShown}
//             message = {showToastMsg.message}
//             type = {showToastMsg.type}
//             onClose = {handleCloseToast}
//         />

//         </>  
//     )



//adding the completedTasks area

                // {/* Main Content Area */}
                // <div className="bg-white rounded-xl shadow-lg p-6">
                //     <h1 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Tasks</h1>
                    
                //     {/* Notes Grid */}
                //     {allNotes.length > 0 ? (
                //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                //             {allNotes.map((item) => ( 
                //                 <div key={item._id}
                //                     className="h-full" // Ensure consistent height
                //                     >
                //                 <NoteCard 
                //                     key={item._id}
                //                     title={item.title}
                //                     date={item.createdOn}
                //                     content={item.content}
                //                     priority={item.priority}
                //                     deadline={item.dueDate}
                //                     tags={item.tags}
                //                     isDone={item.isDone}
                //                     onEdit={() => handleEdit(item)}
                //                     onDelete={() => deleteNote(item)}
                //                     onDoneNote={() => updateIsDone(item)}
                //                     hovered={hoveredNoteId===item._id}
                //                     onMouseEnter={() => setHoveredNoteId(item._id)}
                //                     onMouseLeave={() => setHoveredNoteId(null)}
                //                 />
                //                 </div> 
                //             ))}
                //         </div>
                //     ) : (
                //         <EmptyCard 
                //             imgSrc={isSearch ? NoData : AddNotesImg} 
                //             message={isSearch 
                //                 ? "Oops! No notes match your search"
                //                 : "Click the '+' button below to create your first note!"
                //             }
                //         />
                //     )}


                //     <h1 className="text-2xl font-bold text-gray-800 my-6">Completed Tasks</h1>

                // </div>