import { React } from 'react'

import EmptyCard from '../../components/EmptyCard/EmptyCard.jsx'
import AddNotesImg from "../../assets/images/cat.png"

import { getRelativeDate } from "../../utils/helper.js"
import { useState } from 'react'

import Toast from "../../components/ToastMessage/Toast.jsx";

import axiosInstance from "../../utils/axiosInstance.js";

const SeeAllMoods = ({ nodeData, type, getSuggestions, onClose }) => {

    if (!nodeData) return null; 

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
    
    
    const length = nodeData ? Object.keys(nodeData).length : 0;

    return (
    <>
    <div className="relative justify-center bg-white p-1 rounded-3xl border-2 border-gray-200 shadow-md w-full">
      
      {/*show all notes schedule */}
      {length > 0 
      ? 
      (
<div className="flex flex-col max-h-[80vh] w-full overflow-x-auto p-2 gap-2 scrollbar-thin">
  {Object.entries(nodeData).map(([dateString, moods]) => (
    <div 
      key={dateString} 
      className="bg-gray-100 p-5 m-3 rounded-3xl border-2 border-gray-200 shadow-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold text-gray-800"> 
          {getRelativeDate(new Date(Number(dateString)))}
        </p>
        <span className="text-gray-500 text-sm">
          {moods.length} {moods.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      
      <div className="">
        <div className="flex grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
          {moods.map((item) => (
            <div 
              key={item._id} 
              className="flex flex-col items-center min-w-[80px] p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Mood Icon - replace with your actual icon component */}
              <div className="text-3xl mb-1">
                {(item.mood)} {/* You'll need to implement this function */}
              </div>
              
              {/* Optional time or additional info */}
              {item.createdOn && (
                <span className="text-xs text-gray-500 mt-1">
                    {new Date(item.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}
                </span>
                )}
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
        message="No moods logged!"
      />
      )}

    </div>

    <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
    />
    </>
  )
}

export default SeeAllMoods
