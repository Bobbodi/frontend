import React from 'react'
import Navbarv3 from '../../components/Navbarv3'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { EMOJIS } from '../../utils/constants.js';
import SeeAllMoods from './SeeAllMoods.jsx';
import Modal from "react-modal";


import { RiExpandDiagonalLine } from "react-icons/ri";
import JournalCard from '../../components/Cards/JournalCard';
import AddNotesImg from "../../assets/images/cat.png"
import SmallEmptyCard from "../../components/EmptyCard/SmallEmptyCard";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import  NoData  from "../../assets/images/bear.png";
import AddJournal from "./AddJournal";
import Toast from "../../components/ToastMessage/Toast";
import moment from "moment";
import { MdCheck } from 'react-icons/md';
import SeeAllSleep from './SeeAllSleep.jsx';

const Wellness = () => {

    const [openAddEditModal, setOpenAddEditModal] = React.useState({
        isShown: false, 
        type: "add",
        data: null,
    });
   
    const [newDay, setNewDay] = useState(true); 
    const [allJournal, setAllJournal] = useState([]);
    const [allMoods, setAllMoods] = useState([]);
    const [allMoodsLength, setAllMoodsLength] = useState(0);
    const [orderedMoods, setOrderedMoods] = useState([]);
    const [openAllMoodModal, setOpenAllMoodModal] = useState(false);
    const [openAllSleepModal, setOpenAllSleepModal] = useState(false); 
    const [userInfo, setUserInfo] = useState(null); 
    const [error, setError] = useState(null);

    const [allSleep, setAllSleep] = useState([]); 
    const [allSleepLength, setAllSleepLength] = useState(null); 
    const [weekSleep, setWeekSleep] = useState([]); 
    const [weekSleepLength, setWeekSleepLength] = useState(null); 
    const [sleepStart, setSleepStart] = useState("22:30"); // Default bedtime
    const [sleepEnd, setSleepEnd] = useState("06:15"); // Default wake-up time
    const [dreams, setDreams] = useState(""); // Optional: Add dreams input
    const [weekTimeData, setWeekTimeData] = useState([]);

    const [isSearch, setIsSearch] = useState(false);
    const [hoveredJournalId, setHoveredJournalId] = useState(null);

    const [averageHours, setAverageHours] = useState('-'); 
    const [consistency, setConsistency] = useState('-'); 

    const navigate = useNavigate();

    // Helper function to convert "HH:MM" to decimal hours
    function parseTimeToHours(timeString) {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours + (minutes / 60);
    }

    useEffect(() => {
      const init = async () => {
        await getUserInfo();
        await getAllJournal();
        await getAllMood();
        await setUpSleep(); // Run sequentially
        if (allSleep.length > 0) { 
          calcStats(); 
        }
      };
      init();
    }, []); // Keep empty if no external deps

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
                setAllMoodsLength(response.data.moods.length);
            }
        } catch (error) { 
            console.log("beep boop error time")
        }
    }

    //AddMood 
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

    const seeAllMoods = () => { 
      const sortedMoods = [...allMoods].sort((a, b) => { 
              const aDue = new Date(a.createdOn).setHours(0, 0, 0, 0);
              const bDue = new Date(b.createdOn).setHours(0, 0, 0, 0);
            return bDue - aDue;}) // Sort by createdOn first
      
      const orderedMoods = {}; 

      for (const mood of sortedMoods) { 
        const moodDate = new Date(mood.createdOn).setHours(0, 0, 0, 0); 
        if (!orderedMoods[moodDate]) { 
            orderedMoods[moodDate] = [];
        }
        orderedMoods[moodDate].push(mood); 
      }

      //setOrderedMoods(orderedMoods);
      return orderedMoods;
    }

    // Helper function (should be defined elsewhere in your component)
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const calcStats = () => {
      if (!weekSleep || weekSleep.length === 0) {
        setAverageHours(0);
        setConsistency(0);
        return;
      } 

      // 1. Calculate average sleep hours
      const totalHours = weekSleep.reduce((sum, sleep) => {
        const start = timeToMinutes(sleep.sleepStart);
        const end = timeToMinutes(sleep.sleepEnd);
        let duration = end - start;
        
        // Handle overnight sleeps (end time is next day)
        if (duration < 0) duration += 24 * 60;
        
        return sum + (duration / 60); // Convert minutes to hours
      }, 0);

      const avgHours = totalHours / weekSleep.length;
      setAverageHours(parseFloat(avgHours.toFixed(1))); // Round to 1 decimal

      // 2. Calculate consistency (standard deviation of sleep times)
      const startTimes = weekSleep.map(s => timeToMinutes(s.sleepStart));
      const endTimes = weekSleep.map(s => timeToMinutes(s.sleepEnd));
      
      // Convert all times to "minutes since midnight" (0-1440)
      const normalizedTimes = [...startTimes, ...endTimes].map(t => t % (24 * 60));
      
      const mean = normalizedTimes.reduce((a, b) => a + b, 0) / normalizedTimes.length;
      const squaredDiffs = normalizedTimes.map(t => Math.pow(t - mean, 2));
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / normalizedTimes.length;
      const stdDev = Math.sqrt(variance);
      
      // Convert standard deviation to consistency score (0-100)
      // Lower stdDev = more consistent (higher score)
      const maxPossibleDev = 720; // 12 hours from mean (worst case)
      const consistencyScore = Math.max(0, 100 - (stdDev / maxPossibleDev * 100));
        (Math.round(consistencyScore));
    };

    const setUpSleep = async () => {
      
      try { 
        const response = await axiosInstance.get("/get-all-sleep");
        if (response.data && response.data.sleeps) { 
          setAllSleep(response.data.sleeps);
          setAllSleepLength(response.data.sleeps.length);
        }

        const weekResponse = await axiosInstance.get("/get-this-week-sleep");
        if (weekResponse.data && weekResponse.data.sleeps) { 
          const sleeps = weekResponse.data.sleeps;
          setWeekSleep(sleeps);
          setWeekSleepLength(sleeps.length);

          //set up stats 
        const totalHours = sleeps.reduce((sum, sleep) => {
          const start = timeToMinutes(sleep.sleepStart);
          const end = timeToMinutes(sleep.sleepEnd);
          let duration = end - start;
          
          // Handle overnight sleeps (end time is next day)
          if (duration < 0) duration += 24 * 60;
          
          return sum + (duration / 60); // Convert minutes to hours
        }, 0);

        const avgHours = totalHours / sleeps.length;
        setAverageHours(parseFloat(avgHours.toFixed(1))); // Round to 1 decimal

        // 2. Calculate consistency (standard deviation of sleep times)
        const startTimes = sleeps.map(s => timeToMinutes(s.sleepStart));
        const endTimes = sleeps.map(s => timeToMinutes(s.sleepEnd));
        
        // Convert all times to "minutes since midnight" (0-1440)
        const normalizedTimes = [...startTimes, ...endTimes].map(t => t % (24 * 60));
        
        const mean = normalizedTimes.reduce((a, b) => a + b, 0) / normalizedTimes.length;
        const squaredDiffs = normalizedTimes.map(t => Math.pow(t - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / normalizedTimes.length;
        const stdDev = Math.sqrt(variance);
        
        // Convert standard deviation to consistency score (0-100)
        // Lower stdDev = more consistent (higher score)
        const maxPossibleDev = 720; // 12 hours from mean (worst case)
        const consistencyScore = Math.max(0, 100 - (stdDev / maxPossibleDev * 100));
        setConsistency(Math.round(consistencyScore));
        }
      } catch (error) { 
          console.log("beep boop error time")
      }
    }

    const addNewSleep = async () => {
      
      try { 
        const response = await axiosInstance.post("/add-sleep", { 
          sleepStart, sleepEnd, dreams
        })

        if (response.data && response.data.sleepLog) { 
          setUpSleep()
          showToastMessage("Sleep Added Succesfully", 'add')
        } 

      } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
          setError(error.response.data.message)
        }
      }
    };
  

    

return (
  <div className="min-h-screen bg-gray-50">
    <Navbarv3 userInfo={userInfo} />
    
    <div className="container mx-auto px-3 py-1">
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
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 relative z-0"> 
            Recent moods
          </h3>
          {/* To see all the other moods on other days */}
          {allMoodsLength > 7 ? 
            <button className=""
              onClick={() => {
                setOpenAllMoodModal({
                    isShown: true,
                    type: "see",
                    data: seeAllMoods(),
                });
              
              }}
              aria-label="See all suggested notes schedule"> 
              <h1 className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 bg-purple-100 hover:bg-purple-200 rounded-full px-3 py-1 transition-colors duration-200 cursor-pointer">
                See All <RiExpandDiagonalLine className="w-3.5 h-3.5" />
              </h1>
            </button> 
          : null}
          </div> 
        <div className="grid grid-cols-7 gap-2 relative z-10 mt-3 ml-3 mr-3"> {/* Added z-10 */}
          {allMoodsLength > 0 ? (
            allMoods
              .slice(0, 14)
              .map((moodLog) => (
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
        <h2 className="text-sm font-medium text-gray-500 mb-2">Last night </h2>
        {/* Sleep Time Input */}
        <div className="bg-blue-50 rounded-xl p-3">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-1">Bedtime</label>
            <input
              type="time"
              className="w-full p-2 border border-gray-200 rounded-lg"
              onChange={(e) => setSleepStart(e.target.value)}
              step="900" 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-1">Wake up</label>
            <input
              type="time"
              className="w-full p-2 border border-gray-200 rounded-lg"
              onChange={(e) => setSleepEnd(e.target.value)}
              step="900" 
            />
          </div>
        </div>

        <div className="relative">
        {/* Dreams with tick */}
        <div className="flex flex-col gap-1 relative">
          <textarea
            className="w-full text-sm p-3 pr-10 border border-gray-200 rounded-lg min-h-[80px]"
            placeholder="Any dreams?"
            value={dreams}
            onChange={(e) => setDreams(e.target.value)}
            
          />
          
          <button
            className="absolute right-2 bottom-2 p-1 text-blue-500 hover:text-blue-700 hover:border hover:border-blue-500 hover:rounded-full transition-colors"
            onClick={addNewSleep}
            aria-label="Save dream log"
          >
            <MdCheck className="text-xl" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm my-2 animate-fade">
            {error}
          </p>
        )}
      </div>
      </div> 
       

        {/* Sleep Trends */}
        <div className="mb-6">
          <div className="flex items-center justify-between mt-3 mb-3">
            <h2 className="text-sm font-medium text-gray-500">This week's sleep</h2>
            {/* Open modal to see all sleep logs */}
            <button className=""
              onClick={() => {
                setOpenAllSleepModal({
                    isShown: true,
                    type: "see",
                    data: allSleep,
                });
              
              }}
              aria-label="See all sleep"> 
              <h1 className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full px-3 py-1 transition-colors duration-200 cursor-pointer">
                See All <RiExpandDiagonalLine className="w-3.5 h-3.5" />
              </h1>
            </button> 
          </div> 
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{averageHours}</div>
              <div className="text-xs text-gray-500">hours</div>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{consistency}%</div>
              <div className="text-xs text-gray-500">consistency</div>
            </div>
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

        </div> 

        
        {/* Journal Entries Grid */}
        <h3 className="text-sm font-medium text-gray-500 relative z-0 mt-4 mb-2"> 
            Past Journals
          </h3>
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

    {/* Modal for see all moods */}
    <Modal 
        isOpen={openAllMoodModal.isShown}
        onRequestClose={() => setOpenAllMoodModal({ isShown: false, type: "see", data: null })}
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
        contentLabel="See all Moods"
        className="w-[90%]"
        overlayClassName="fixed inset-0 flex items-center justify-center p-4"  
        ariaHideApp={false}
    >
        <SeeAllMoods
            type={openAllMoodModal.type}
            nodeData={openAllMoodModal.data}
            onClose={() => { 
                setOpenAllMoodModal({ isShown:false, type:"see", data:null});
            }}
            showToastMessage={showToastMessage}
        />
    </Modal>


    {/* Modal for see all sleep */}
    <Modal 
        isOpen={openAllSleepModal.isShown}
        onRequestClose={() => setOpenAllSleepModal({ isShown: false, type: "see", data:null })}
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
        contentLabel="See all Moods"
        className="w-[90%]"
        overlayClassName="fixed inset-0 flex items-center justify-center p-4"  
        ariaHideApp={false}
    >
        <SeeAllSleep
            type={openAllSleepModal.type}
            sleeps={openAllSleepModal.data}
            onClose={() => { 
                setOpenAllSleepModal({ isShown:false, type:"see", data:null});
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
