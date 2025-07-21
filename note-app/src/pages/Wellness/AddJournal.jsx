import React from 'react'
import TagInput from '../../components/Input/TagInput'
import { useState } from 'react'
import { MdClose } from "react-icons/md"
import { MdCheck } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance'
import { useEffect } from 'react';
import Toast from '../../components/ToastMessage/Toast';

const AddNotes = ({ nodeData, getAllJournal, onClose }) => {
    //Show date when adding 
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();
    const weekday = today.toLocaleString('default', { weekday: 'long' });


    const nodeData2 = nodeData || {}

    const [entry, setEntry] = useState(nodeData2.entry || ""); 
    const [error, setError] = useState(null); 
    let added = false; 

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

    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError(null);
        }, 3000); // 3000ms = 3 seconds
        
        // Clean up the timer when component unmounts or error changes
        return () => clearTimeout(timer);
      }
    }, [error]);

    const onKeyDown = (e) => { 
        if (e.key === 'Enter') { 
            handleAddNode();
        }
    } 

    //AddNote 
    const addNewJournal = async () => {
      
      try { 
        const response = await axiosInstance.post("/add-journal", { 
          entry,
        })

        if (response.data && response.data.journal) { 
          getAllJournal()
          showToastMessage("Journal Added Succesfully", 'add')
          onClose()
        } 

      } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
          setError(error.response.data.message)
        }
      }
    };


    const handleAddNode = () => { 
      if (!entry) { 
        setError("Please enter some text");
        return;
      }
      setError("");
      setEntry("");
      added = true; 
      addNewJournal();
    }

return (
  <div className="relative bg-white rounded-lg max-w-lg mx-auto">
    {/* Close Button */}
    {/* <button
      className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
      onClick={onClose}
      aria-label="Close modal"
    >
      <MdClose className="text-xl text-gray-500 hover:text-red-500" />
    </button> */}

    <div className="space-y-1">
      {/* Date Display */}
      {/* <div className="flex flex-col gap-1">
        {/*<label className="text-sm font-medium text-gray-700">Date</label>}
        <p className="text-lg font-medium text-blue-500">
          {weekday}, {month} {day}, {year}
        </p>
      </div> */}
      
      {/* Journal Entry */}
      <div className="flex flex-col gap-1">
        {/*<label className="text-sm font-medium text-gray-700">Yap Time</label>*/}
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
          placeholder="What's on your mind today?"
          value={added ? "" : entry}
          onChange={({ target }) => setEntry(target.value)}
          onKeyDown={onKeyDown}
          
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="absolute bottom-1 left-4 text-red-500 text-sm my-2 animate-fade">
          {error}
        </p>
      )}

      {/* Submit Button */}
      <button
        className="absolute bottom-2 right-2 p-1 hover:border hover:border-green text-white rounded-full transition-colors"
        onClick={handleAddNode}
        aria-label="Save"
      >
        <MdCheck className="text-xl text-amber-500" />
      </button>
    </div>

    <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
    />
  </div>
)
}

export default AddNotes
