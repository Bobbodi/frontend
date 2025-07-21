import React from 'react'
import TagInput from '../../components/Input/TagInput'
import { useState } from 'react'
//icons

import { MdClose, MdCheck } from 'react-icons/md';

//backend
import axiosInstance from '../../utils/axiosInstance'



const AddEditNotes = ({ nodeData, type, callGetSuggestions, onClose, showToastMessage }) => {

    const nodeData2 = nodeData || {}

    const [title, setTitle] = useState(nodeData2.title || ""); 
    const [content, setContent] = useState(nodeData2.content || ""); 
    const [tags, setTags] = useState(nodeData2.tags || []);
    const [priority, setPriority] = useState(nodeData2.priority || 0);
    const [dueDate, setDueDate] = useState(nodeData2.dueDate);
    const [isEvent, setIsEvent] = useState(nodeData2.isEvent);
    const [error, setError] = useState(null); 

    // Dropdown states
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const priorityOptions = [1, 2, 3];


    const onKeyDown = (e) => { 
        if (type ==='edit' && e.key === 'Enter') { 
            editNote();
        }
        if (type ==='add' && e.key === 'Enter') { 
            addNewNote();
        }
    }

    //AddNote 
    const addNewNote = async () => {
      
      try { 
        const response = await axiosInstance.post("/add-note", { 
          title, content, priority, isEvent, dueDate, tags,
        })

        if (response.data && response.data.note) { 
          showToastMessage("Note Added Succesfully")
          callGetSuggestions()
          onClose()
        } 

      } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
          setError(error.response.data.message)
        }
      }
    };

    //edit note
    const editNote = async () => {
      const noteId = nodeData._id;
      try { 
        console.log("here2")
        const response = await axiosInstance.put("/edit-note/" + noteId, { 
          title, content, priority, dueDate, tags,
        })

        if (response.data && response.data.note) { 
          console.log("here3")
          showToastMessage("Note Edited Succesfully")
          callGetSuggestions()
          onClose()
        } 

      } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
          setError(error.response.data.message)
        }
      }
    };


    const handleAddNode = () => { 
      if (!title) { 
        setError("Please enter the title");
        return;
      }
      setError("");

      if (type ==='edit') { 
        console.log("editing")
        editNote()
      } else { 
        console.log("here")
        addNewNote()
      }
    }
    
return (
  <div className="relative bg-white p-6 rounded-lg border-2 border-gray-200 shadow-md w-full max-w-md">
  {/* Action Buttons (Close and Save) */}
  <div className="absolute top-3 right-3 flex gap-2">
    <button
      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      onClick={handleAddNode}
      aria-label="Save"
    >
      <MdCheck className="text-xl text-green-500 hover:text-green-600" />
    </button>
    <button
      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      onClick={onClose}
      aria-label="Close modal"
    >
      <MdClose className="text-xl text-red-500 hover:text-red-600" />
    </button>
  </div>

  <div className="space-y-4">
    {/* Title */}
    <div className="flex flex-col gap-1">
      <label className="text-yellow-700 font-medium">Title</label>
      <input
        type="text"
        className="w-full p-2 border-b-2 border-gray-400 focus:border-yellow-500 focus:outline-none text-yellow-700"
        placeholder="Study BTT tomorrow"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        onKeyDown={onKeyDown}
      />
    </div>

    {/* Content */}
    <div className="flex flex-col gap-1">
      <label className="text-yellow-700 font-medium">Content</label>
      <textarea
        className="w-full p-2 border-b-2 border-gray-400 focus:border-yellow-500 focus:outline-none text-yellow-700 min-h-[100px]"
        placeholder="Location at Bukit Batok"
        value={content}
        onChange={({ target }) => setContent(target.value)}
        onKeyDown={onKeyDown}
      />
    </div>

    {/* Priority & Due Date */}
    <div className="grid grid-cols-2 gap-4">
      {/* Priority */}
      <div className="flex flex-col gap-1">
        <label className="text-yellow-700 font-medium">Priority</label>
        <div className="flex gap-2">
          {[1, 2, 3, "Event"].map((level) => (
            <button
              key={level}
              className={`${level === "Event" ? 'w-15' : 'w-8'} w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors

                ${priority === level.toString() || level.toString() === "Event"? 
                  level === 3 ? 'bg-red-100 text-red-600' : 
                  level === 2 ? 'bg-amber-100 text-amber-600' : 
                  level === 1 ? 'bg-emerald-100 text-emerald-600': 
                  isEvent ? 'bg-blue-100 text-blue-600' : 
                  'bg-gray-100 text-gray-600 hover:bg-gray-200': 
                  'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
    
              onClick={() => {
                // level.toString() === "Event" ? setIsEvent(!isEvent) : setPriority(level.toString())
                if (level === "Event") {
                  setIsEvent(!isEvent);
                  setPriority(""); // Clear priority when selecting Event
                } else {
                  setPriority(level.toString());
                  setIsEvent(false); // Clear event when selecting priority
                }
              }}
              type="button"
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div className="flex flex-col gap-1">
        <label className="text-yellow-700 font-medium">Due Date</label>
        
        
        <input
          type="date"
          className="w-full p-2 border-b-2 border-gray-400 focus:border-yellow-500 focus:outline-none text-yellow-700"
          value={
            dueDate
              ? new Date(dueDate).toISOString().split('T')[0]
              : ''
          }
          min={new Date().toISOString().split('T')[0]}
          onChange={({ target }) => {
            const date = new Date(target.value);
            date.setHours(23, 59, 0, 0); // 23:59:00.000
            setDueDate(date);
          }}
          onKeyDown={onKeyDown}
        />
        {console.log("dueDate type:", typeof dueDate)}
        
      </div>
    </div>

    {/* Tags */}
    <div className="flex flex-col gap-1">
      <label className="text-yellow-700 font-medium">Tags</label>
      <TagInput tags={tags} setTags={setTags} compact />
    </div>

    {/* Error Message */}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
</div>
);
}

export default AddEditNotes



// return (
//     <div className="relative p-6 bg-white rounded-lg max-w-md mx-auto">
//       {/* Close Button */}
//       <button
//         className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
//         onClick={onClose}
//         aria-label="Close modal"
//       >
//         <MdClose className="text-xl text-gray-500 hover:text-red-500" />
//       </button>

//       <div className="space-y-6">
//         {/* Title */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm font-medium text-gray-700">Title</label>
//           <input
//             type="text"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Study BTT tomorrow"
//             value={title}
//             onChange={({ target }) => setTitle(target.value)}
//             onKeyDown={onKeyDown}
//           />
//         </div>

//         {/* Details */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm font-medium text-gray-700">Details</label>
//           <textarea
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
//             placeholder="Location at Bukit Batok"
//             value={content}
//             onChange={({ target }) => setContent(target.value)}
//             onKeyDown={onKeyDown}
//           />
//         </div>

//         {/* Priority & Due Date Row */}
//         <div className="flex flex-col sm:flex-row gap-4 mt-4">
//         {/* Priority choices */}
//         <div className="flex-1">
//           <div className="flex items-center border-b border-gray-300 py-2">
//             <span className="text-sm font-medium text-gray-700 mr-2">Priority</span>
//             <button 
//               className="ml-auto flex items-center"
//               onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
//             >
//               <span className="mr-1">{priority || '1'}</span>
//               <MdArrowDropDown className="text-xl text-gray-500" />
//             </button>
//           </div>
          
//           {showPriorityDropdown && (
//             <div className="absolute z-10 mt-1 w-[calc(50%-0.5rem)] bg-white border border-gray-300 rounded-lg shadow-lg">
//               {priorityOptions.map(option => (
//                 <div
//                   key={option}
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setPriority(option.toString());
//                     setShowPriorityDropdown(false);
//                   }}
//                   onKeyDown={onKeyDown}
//                 >
//                   {option}
//                 </div>
//               ))}
//               <div
//                 className="p-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
//                 onClick={() => {
//                   setPriority('');
//                   setShowPriorityDropdown(false);
//                 }}
//               >
//                 Clear
//               </div>
//             </div>
//           )}
//         </div>

//       {/* Due Date Dropdown */}
//           <div className="flex-1 relative">
//             <div className="flex items-center border-b border-gray-300 py-2">
//               <span className="text-sm font-medium text-gray-700 mr-2">DueDate</span>
//               <button
//                 className="ml-auto flex items-center"
//                 onClick={() => setShowDateDropdown(!showDateDropdown)}
//                 type="button"
//               >
//                 <span className="mr-1">
//                   {dueDate ? new Date(dueDate).toLocaleDateString() : 'None'}
//                 </span>
//                 <MdArrowDropDown className="text-xl text-gray-500" />
//               </button>
//             </div>
//             {showDateDropdown && (
//               <div className="absolute z-10 mt-1 w-full bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
//                 <input
//                   type="datetime-local"
//                   className="w-full p-2 border border-gray-300 rounded"
//                   min={new Date().toISOString().slice(0, 16)}
//                   value={dueDate || ''}
//                   onChange={({ target }) => setDueDate(target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') setShowDateDropdown(false); onKeyDown();
//                   }}
//                 />
//                 <div className="flex justify-end mt-2 space-x-2">
//                   <button
//                     className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
//                     onClick={() => {
//                       setDueDate('')
//                       setShowDateDropdown(false)
//                     }}
//                     type="button"
//                   >
//                     Clear
//                   </button>
//                   <button
//                     className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
//                     onClick={() => setShowDateDropdown(false)}
//                     type="button"
//                   >
//                     Done
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Tags */}
//         <div className="flex flex-col gap-1">
//           <label className="text-sm font-medium text-gray-700">Tags</label>
//           <TagInput tags={tags} setTags={setTags} />
//         </div>

//         {/* Error Message */}
//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         {/* Submit Button */}
//         <button
//           className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
//           onClick={handleAddNode}
//         >
//           {type === 'edit' ? 'Save Changes' : 'Add Note'}
//         </button>
//       </div>
//     </div>
//   );
// return (
//     <div className='relative'>

//       <button
//         className="p-2 rounded-full flex items-center justify-center absolute -top-3 -right-3"
//         onClick={onClose}
//       >
//         <MdClose className="text-xl text-slate-400 hover:text-red" />
//       </button>

//       <div className="flex flex-col gap-2">
//         <label className="input-label text-2xl">Title</label>
//         <input
//           type="text"
//           className="text-xl text-blue outline-none p-2"
//           placeholder="Study BTT tmr"
//           value={title}
//           onChange={({ target }) => setTitle(target.value)}
//           onKeyDown={onKeyDown}
//         />
//       </div>

//       <div className="flex flex-col gap-2 mt-4">
//         <label className="input-label">Details</label>
//         <textarea
//           type="text"
//           className="text-sm text-blue outline-none bg-slate-50 p-2 rounded-xl"
//           placeholder="Location at Bukit Batok"
//           rows={2}
//           value={content}
//           onChange={({ target }) => setContent(target.value)}
//           onKeyDown={onKeyDown}
//         />
//       </div>

//     <div className="flex flex-row justify-between">
    
//       <div className="flex flex-col gap-2 mt-4">
//         <label className="input-label">Priority (0-5):</label>
//         <input 
//           type="number" 
//           className="text-l text-blue outline-none bg-slate-50  rounded-xl p-2"
//           placeholder='0' 
//           min="0" 
//           max="5"
//           value={priority}
//           onChange={({ target }) => setPriority(target.value)} 
//           onKeyDown={onKeyDown}
//           />
//       </div>

//       <div className="flex flex-col gap-2 mt-4">
//         <label className="input-label">Due Date (if any)</label>
//           <input
//             className="text-l text-blue outline-none bg-slate-50  rounded-xl p-2"
//             placeholder='2025-05-22T22:26'
//             type="datetime-local"
//             id="meeting-time"
//             name="meeting-time"
//             min="2025-05-22T22:26"
//             max="2100-05-22T00:00"
//             value={dueDate}
//             onChange={({ target }) => setDueDate(target.value)}  
//             onKeyDown={onKeyDown}/>
//       </div>
//     </div> 

      

//       <div className="flex flex-col mt-3">
//         <label className="input-label mb-2">Tags</label>
//         <TagInput tags={tags} setTags={setTags} />
//       </div>

//       {error && <p className="text-red-500 text-xs pt-4"> {error} </p>}
//       <button
//         className="btn-secondary"
//         onClick={handleAddNode}
//         onKeyDown={onKeyDown}
//       >
//         {type === 'edit' ? 'Save' : 'Add'}
//       </button>
//     </div>
//   )

// Due Date
//       <div className="flex items-center gap-2">
//         <label className="text-sm font-medium text-gray-700 w-16">Due Date</label>
//         <button
//           className="flex-1 p-2 border border-gray-300 rounded-lg text-left flex items-center justify-between text-sm"
//           onClick={() => setShowDateDropdown(!showDateDropdown)}
//           type="button"
//         >
//           <span>
//             {dueDate ? new Date(dueDate).toLocaleDateString() : 'Select date'}
//           </span>
//           <MdArrowDropDown className="text-xl text-gray-500" />
//         </button>
//       </div>
//     </div>

//     {/* Date Picker Dropdown */}
//     {showDateDropdown && (
//       <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-lg">
//         <input
//           type="datetime-local"
//           className="w-full p-1.5 text-sm border border-gray-300 rounded"
//           min={new Date().toISOString().slice(0, 16)}
//           value={dueDate || ''}
//           onChange={({ target }) => setDueDate(target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') setShowDateDropdown(false); onKeyDown();
//           }}
//         />
//         <div className="flex justify-end mt-2 space-x-2">
//           <button
//             className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
//             onClick={() => {
//               setDueDate('')
//               setShowDateDropdown(false)
//             }}
//             type="button"
//           >
//             Clear
//           </button>
//           <button
//             className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
//             onClick={() => setShowDateDropdown(false)}
//             type="button"
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     )}