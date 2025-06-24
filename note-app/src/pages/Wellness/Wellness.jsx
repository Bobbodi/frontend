import React from 'react'
import Navbarv3 from '../../components/Navbarv3'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { EMOJIS } from '../../utils/constants.js';

import Modal from "react-modal";


import { MdAdd, MdCheck, MdMoodBad } from "react-icons/md";
import JournalCard from '../../components/Cards/JournalCard';
import AddNotesImg from "../../assets/images/cat.png"
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddJournal from "./AddJournal";
import Toast from "../../components/ToastMessage/Toast";
import moment from "moment";

const Wellness = () => {

    const [openAddEditModal, setOpenAddEditModal] = React.useState({
        isShown: false, 
        type: "add",
        data: null,
    });
   
    const [newDay, setNewDay] = useState(true); 
    const [allJournal, setAllJournal] = useState([]);
    const [allMoods, setAllMoods] = useState([]);
    const [userInfo, setUserInfo] = useState(null); 
    const [error, setError] = useState(null);

    const [isSearch, setIsSearch] = useState(false);
    const [hoveredJournalId, setHoveredJournalId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => { 
        getUserInfo(); 
        getAllJournal();
        checkNewDay();
        getAllMood();
        return () => {};
    }, [])

    // Use for enforcing one Sleep log per day 
    const checkNewDay = () => {
      const today = new Date();
      const todayDateString = today.toDateString(); 
      
      // Get the last stored date from localStorage or use today's date if not found
      const lastStoredDateString = localStorage.getItem('lastVisitedDate') || todayDateString;
    
      if (todayDateString !== lastStoredDateString) {
        setNewDay(true);
        localStorage.setItem('lastVisitedDate', todayDateString);
      } else {
        setNewDay(false);
      }
    }
    
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

    //JOURNAL -------------------------------Get All journal
    const getAllJournal = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-journal");
            if (response.data && response.data.journals) { 
                setAllJournal(response.data.journals);
            }
        } catch (error) { 
            console.log("beep boop error time")
        }
    }

    //delete Notes
    const deleteJournal = async (data) => {
      const journalId = data._id;
      try { 
        
        const response = await axiosInstance.delete("/delete-journal/" + journalId)

        if (response.data && response.data.error === false) { 
          
          showToastMessage("Journal Deleted Succesfully", 'delete')
          getAllJournal()
          onClose()
        } 

      } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
          setError("beep boop error time")
        }
      }
    };

    //MOOD -----------------------------------
    //get all mood
    const getAllMood = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-mood");
            if (response.data && response.data.moods) { 
                setAllMoods(response.data.moods);
            }
        } catch (error) { 
            console.log("beep boop error time")
        }
    }

    //AddNote 
    const addNewMood = async (mood) => {
      
      try { 
        const response = await axiosInstance.post("/add-mood", { 
          mood,
        })

        if (response.data && response.data.moodLog) { 
          getAllMood()
          showToastMessage("Mood Added Succesfully", 'add')
        } 

      } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
          setError(error.response.data.message)
        }
      }
    };


    const handleAddMood = (mood) => { 
      if (!mood) { 
        setError("Please enter a mood");
        return;
      }
  
      addNewMood(mood);
    }

return (
  <div className="min-h-screen bg-gray-50">
    <Navbarv3 userInfo={userInfo} />
    
    <div className="container mx-auto px-4 py-8">
      {/*The three sections: MOOD, SLEEP, JOURNALING */}
      <div className="flex flex-col lg:flex-row gap-3">

      {/* MOOD SECTION */}
      <div className="lg:w-1/3 w-full bg-white rounded-xl shadow-lg p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-3 ">Mood</h1>
        
        {/* Mood Rating */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-3">How are you feeling today?</h2>
          <div className="flex justify-between grid grid-cols-5 gap-5">
            {Object.entries(EMOJIS).map(([emoji, desc]) => (
              <div key={desc} className="relative inline-block group"> {/* Container with group class */}
                <button 
                  className="text-3xl hover:scale-110 hover:bg-gray-100 hover:rounded-full transition-transform"
                  onClick={() => handleAddMood(emoji)}
                  aria-label={desc}
                >
                  {emoji}
                </button>
                
                {/* Tooltip */}
                <div className="
                  absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                  px-2 py-1 text-xs bg-purple-500 text-white rounded
                  opacity-0 group-hover:opacity-100 transition-opacity
                  whitespace-nowrap pointer-events-none
                ">
                  {desc}
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-purple-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

       
      {/* Recent Moods */}
      <div className="mt-6" style={{ contain: 'paint' }}> 
        <h3 className="text-sm font-medium text-gray-500 relative z-0"> 
          Recent moods
          
          <div className="absolute -top-8 -left-4 -right-4 h-16 z-0"></div>
        </h3>
        <div className="grid grid-cols-7 gap-2 relative z-10 mt-3 ml-3 mr-3"> {/* Added z-10 */}
          {allMoods.length > 0 ? (
            allMoods.map((moodLog) => (
              <div 
                key={moodLog._id} 
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center relative group"
              >
                <span className="text-xl relative z-10">{moodLog.mood}</span>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50
                  px-2 py-1 text-xs bg-purple-500 text-white rounded shadow-md
                  opacity-0 group-hover:opacity-100 transition-opacity
                  whitespace-nowrap pointer-events-none"
                >
                  {moment(moodLog.createdOn).format("MMM D")}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                    border-l-4 border-r-4 border-b-0 border-t-4 
                    border-l-transparent border-r-transparent border-t-purple-500"></div>
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>
      </div> 

      {/* SLEEP SECTION */}
      <div className="lg:w-1/3 w-full bg-white rounded-xl shadow-lg p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Sleep</h1>
        
        {/* Sleep Duration */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Last night's sleep</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">7.5</div>
              <div className="text-xs text-gray-500">hours</div>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <div className="text-xs text-gray-500">quality</div>
            </div>
          </div>
        </div>

        {/* Sleep Time Input */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-1">Bedtime</label>
            <input 
              type="time" 
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              defaultValue="22:30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-1">Wake up</label>
            <input 
              type="time" 
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              defaultValue="06:15"
            />
          </div>
        </div>

        {/* Sleep Notes */}
        <div>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
            placeholder="Any sleep notes or dreams?"
          />
        </div>

        {/* Sleep Trend */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">This week's sleep</h3>
          <div className="h-20 bg-gray-50 rounded-lg flex items-end">
            {[5, 6, 7, 8, 7.5, 6.5, 7].map((hours, i) => (
              <div 
                key={i} 
                className="flex-1 bg-blue-100 mx-0.5 rounded-t-sm"
                style={{ height: `${hours * 10}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* journaling section */}
      <div className="lg:w-1/3 w-full bg-white rounded-xl shadow-lg p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Journal</h1>

        {/*Add a new journal entry*/}
        <div> 
          <AddJournal
            type={openAddEditModal.type}
            nodeData={openAddEditModal.data}
            getAllJournal={getAllJournal} //edited () => 
            onClose={() => { 
              setOpenAddEditModal({ isShown:false, type:"add", data:null});
            }}
            showToastMessage={showToastMessage}
            
          />
          {/* <div 
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
            contentEditable
            placeholder="Write your journal entry here..."
          >
            
          </div> */}

        </div> 

        
        {/* Journal Entries Grid */}
        <div className="mt-2 max-h-40 overflow-y-auto ">
        {allJournal.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mb-3">
            {allJournal.map((item) => (
              <JournalCard 
                key={item._id}
                date={item.createdOn}
                entry={item.entry}
                hovered={hoveredJournalId===item._id}
                onMouseEnter={() => setHoveredJournalId(item._id)}
                onMouseLeave={() => setHoveredJournalId(null)}
                onDelete={() => deleteJournal(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard 
            imgSrc={AddNotesImg} 
            message="Feeling things? Click the '+' button below to write down your thoughts!"
          />
        )}
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
          maxHeight: "70vh",
          width: "90%",
          maxWidth: "600px",
          margin: "auto",
          borderRadius: "0.5rem",
          padding: "0",
          border: "none",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }
      }}
      contentLabel="Add Journal Entry"
      overlayClassName="fixed inset-0 flex items-center justify-center p-4"
    >
      <AddJournal
        type={openAddEditModal.type}
        nodeData={openAddEditModal.data}
        getAllJournal={getAllJournal} //edited () => 
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
  </div>
)
}

export default Wellness

// {/* Floating Add Button */}
//     <button
//       className="fixed w-16 h-16 flex items-center justify-center rounded-full bottom-10 right-10 bg-yellow-500 hover:bg-red-500 text-white shadow-lg hover:shadow-xl transition-all z-50"
//       onClick={() => {
//         setOpenAddEditModal({
//           isShown: true,
//           type: "add",
//           data: null,
//         });
//       }}
//       aria-label="Add new journal entry"
//     >
//       <MdAdd className="text-3xl" />
//     </button>

//MOOD JOURNAL
{/* Mood Journal */}
        {/* <div className="relative">
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
            placeholder="What's influencing your mood today?"
          />
          <button className="absolute bottom-2 right-2 p-1 text-purple-500 hover:text-purple-700">
            <MdCheck className="text-xl" />
          </button>
        </div> */}
