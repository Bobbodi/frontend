import { React } from 'react'

import EmptyCard from '../../components/EmptyCard/EmptyCard'
import AddNotesImg from "../../assets/images/cat.png"

import { getRelativeDate } from "../../utils/helper.js"
import { useState } from 'react'
import Modal from "react-modal";
import NoteCard from "../../components/Cards/NoteCard";
import AddEditNotes from "./AddEditNotes";
import Toast from "../../components/ToastMessage/Toast";

import axiosInstance from "../../utils/axiosInstance";

const SeeAllSuggested = ({ nodeData, onClose }) => {

    if (!nodeData) return null; 

    const [hoveredNoteId, setHoveredNoteId] = useState(null);
    const [allNotes, setAllNotes] = useState([]);

    const handleEdit = (noteDetails) => { 
        setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
    }

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false, 
        type: "add",
        data: null,
    });

    const [showToastMsg, setShowToastMsg] = useState({ 
        isShown: false, 
        type: "add",
        message: ""
    })
    
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
    
    //delete Notes
    const deleteNote = async (data) => {
      const noteId = data._id;
      try { 
        console.log("deleteing")
        const response = await axiosInstance.delete("/delete-note/" + noteId)

        if (response.data && response.data.error === false) { 
          console.log("here3")
          showToastMessage("Task Deleted Succesfully", 'delete')
          onClose()
        } 

      } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
          setError("beep boop error time")
        }
      }
    };

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

    const getAllNotes = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data && response.data.notes) { 
                setAllNotes(response.data.notes);
            }
        } catch (error) { 
            console.log("beep boop error time")
        }
    }
    
    const length = nodeData ? Object.keys(nodeData).length : 0;
    //console.log("SeeAllSuggested nodeData: ", nodeData);
    return (
    <>
    <div className="relative justify-center bg-white p-1 rounded-3xl border-2 border-gray-200 shadow-md w-full">
      
      {/*show all notes schedule */}
      {length > 0 
      ? 
      (
        <div className="flex flex-row w-full overflow-x-auto p-2 gap-2"
        
            style={{ scrollbarWidth: 'thin'}}>
            {Object.entries(nodeData)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .map(([dateString, tasks]) =>  (
            <div className="bg-gray-100 p-5 m-3 rounded-3xl border-2 border-gray-200 shadow-xl"> 
                <p className="text-2xl font-bold text-gray-800 mb-5">
                    {getRelativeDate(dateString)}
                </p>

                <div key={dateString} className="mb-6 overflow-y-auto h-60"
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
                                isEvent={item.isEvent}
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
                </div> 
            ))}
            </div>
         
      ) 
      : 
      (
      <EmptyCard 
        imgSrc={AddNotesImg}
        message="No upcoming tasks!"
      />
      )}

    </div>


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

    <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
    />
    </>
  )
}

export default SeeAllSuggested
