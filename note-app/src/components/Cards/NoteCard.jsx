import React from 'react'
import { LuCircleCheckBig } from "react-icons/lu";
import { MdCreate, MdOutlinePushPin } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import { useState } from 'react';

const NoteCard = ({
    title, date, content, priority, dueDate, tags, isDone, isEvent, onEdit, onDelete, onDoneNote, hovered, onMouseEnter, onMouseLeave}) => { 

    const [isDoneHovered, setIsDoneHovered] = useState(false);

    const displayContent = () => {
        return (
            <span 
                className="text-xs note-hover-text whitespace-pre-wrap break-words"
                style={{
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    display: 'block'
                }}
            >
                {content}
            </span>
        )
    }

    return (
        <div
          className={`w-82 border-l-4 p-3 bg-white hover:shadow-lg rounded-r-lg transition-all duration-200 ease-in-out group flex flex-row relative ${
            priority === 3 ? 'border-red-500' :
            priority === 2 ? 'border-amber-500' :
            priority === 1 ? 'border-emerald-500':  
            isEvent ? 'border-blue-500': 
            'border-gray-400'
          }`}
          style={{ 
    borderLeftWidth: '4px',
    transition: 'max-height 8s ease-in-out, opacity 8s ease-in-out', // Explicitly specify what to transition
    maxHeight: hovered ? '5000px' : '110px', // Make sure there's enough difference
    overflow: 'hidden'
  }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className="hover:bg-gray-100 hover:rounded-full self-start mt-1"
                onMouseEnter={() => setIsDoneHovered(true)}
                onMouseLeave={() => setIsDoneHovered(false)}
            >
                <LuCircleCheckBig
                    className={`icon-btn text-2xl ${
                        (isDone && !isDoneHovered) || (!isDone && isDoneHovered)
                            ? "text-green-500"
                            : "text-gray-300"
                    } m-2 transition-colors`} 
                    onClick={onDoneNote}
                />
            </div>

            <div className="flex flex-col flex-1 ml-1">
                <div className="flex flex-row justify-between items-center gap-1"> 
                    <h6 className="text-sm font-semibold text-gray-800">
                        {hovered ? title : title.length > 32 ? `${title?.slice(0, 32)}...` : title}
                    </h6>
                    
                </div> 
            
                {content.length > 0 && (
                    <p 
                        className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors"
                        style={{
                            height: hovered ? 'auto' : 0,
                            opacity: hovered ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'all 0.3s ease-in-out',
                            transitionDelay: hovered ? '0.2s' : '0s'
                        }}
                    >
                        {displayContent()}
                    </p>
                )}
                
                <div 
                    className="flex flex-wrap gap-1 mb-2"
                    style={{
                        height: hovered ? 'auto' : 0,
                        opacity: hovered ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        transitionDelay: hovered ? '0.3s' : '0s'
                    }}
                >
                    {tags.map((item) => (
                        <span 
                            key={item}
                            className={`text-xs px-2 py-1 rounded-full ${
                                priority === 3 ? 'bg-red-100 text-red-800' :
                                priority === 2 ? 'bg-amber-100 text-amber-800' :
                                'bg-emerald-100 text-emerald-800'
                            }`}
                        >
                            #{item}
                        </span>
                    ))} 
                </div>

                <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        {isEvent ? '' : (
                            <span 
                                className={`text-xs font-medium px-2 py-1 rounded ${
                                    priority === 3 ? 'bg-red-100 text-red-800' :
                                    priority === 2 ? 'bg-amber-100 text-amber-800' :
                                    priority === 1 ? 'bg-emerald-100 text-emerald-800': 
                                    'bg-gray-100 text-gray-800'
                                }`}
                            >
                                {priority === null ? 'No priority' : priority}
                            </span>
                        )}
                        
                        {isEvent && dueDate ? (
                            <div className="gap-1 mb-2 text-xs px-2 rounded-full bg-blue-100 text-blue-800"> 
                                Event
                            </div>
                        ) : (
                            isDone ? '' : (
                                <span 
                                    className={`text-xs font-medium ${
                                        dueDate === null ? 'text-gray-500' : 
                                        moment(dueDate).diff(moment(), 'hours') < 24 
                                            ? 'text-red animate-pulse' 
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {dueDate === null ? 'No deadline' : `Due: ${moment(dueDate).fromNow()}`}
                                </span>
                            )
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span 
                        className='text-xs text-gray-600 font-medium'
                        style={{
                            opacity: hovered ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out',
                            transitionDelay: hovered ? '0.1s' : '0s'
                        }}
                    >
                        {moment(date).format('Do MMM')}
                    </span>
                        <MdCreate 
                            className="text-gray-400 hover:text-red cursor-pointer transition-colors text-medium"
                            onClick={onEdit} 
                        />
                        <MdDelete 
                            className="text-gray-400 hover:text-red cursor-pointer transition-colors text-medium"
                            onClick={onDelete} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteCard

// import React from 'react'
// import { LuCircleCheckBig } from "react-icons/lu";
// import { MdCreate, MdOutlinePushPin } from "react-icons/md";
// import { IoMdCreate } from "react-icons/io";
// import { MdDelete } from "react-icons/md";
// import moment from "moment";
// import { useState } from 'react';

// const NoteCard = ({
//     title, date, content, priority, dueDate, tags, isDone, isEvent, onEdit, onDelete, onDoneNote, hovered, onMouseEnter, onMouseLeave}) => { 

//     const [isDoneHovered, setIsDoneHovered] = useState(false);

//     const displayContent = () => {
//         return (
//             <>
//             {hovered 
//                 ? <span className="text-xs note-hover-text whitespace-pre-wrap break-words">{content}</span>  
//                 : ''
//                 // : content.length > 20 
//                 //     ? <p className="text-xs note-hover-text">{content?.slice(0, 20)}...</p> 
//                 //     : <p className="text-xs note-hover-text">{content}</p>  
//             }
//             </>
//         )
//     }

// return (
//     <div
//   className={`w-82 border-l-4 p-3 bg-white hover:shadow-lg rounded-r-lg transition-all duration-200 ease-in-out group flex flex-row relative ${
//     priority === 3 ? 'border-red-500' :
//     priority === 2 ? 'border-amber-500' :
//     priority === 1 ? 'border-emerald-500':  
//     isEvent ? 'border-blue-500': 
//     'border-gray-400'
//   }`}
//   style={{ borderLeftWidth: '4px' }} // Ensures consistent border width

  
//   onMouseEnter={onMouseEnter}
//   onMouseLeave={onMouseLeave}
// >
//   {/* Vertical accent line */}
  
//   <div
//     className="hover:bg-gray-100 hover:rounded-full self-start mt-1" // Added self-start for better alignment
//     onMouseEnter={() => setIsDoneHovered(true)}
//     onMouseLeave={() => setIsDoneHovered(false)}
//   >
//     <LuCircleCheckBig
//       className={`icon-btn text-2xl ${
//         (isDone && !isDoneHovered) || (!isDone && isDoneHovered)
//           ? "text-green-500"
//           : "text-gray-300"
//       } m-2 transition-colors`} 
//       onClick={onDoneNote}
//     />
//   </div>

//   <div className="flex flex-col flex-1 ml-1">
//     {/* Title with */}
//     <div className = "flex flex-row justify-between items-center gap-1"> 
//         <h6 className="text-sm font-semibold text-gray-800">
//         {hovered ? title : title.length > 24 ? `${title?.slice(0, 24)}...` : title}
//         </h6>
        
//         {hovered && (
//         <span className='text-xs text-gray-600 font-medium'>
//             {moment(date).format('Do MMM YYYY')}
//         </span>
//         )}
//     </div> 
  
//     {/* Content with subtle animation */}
//     {hovered && content.length > 0 ? <p className="text-sm text-gray-600 my-2 group-hover:text-gray-800 transition-colors">
//       {displayContent()}
//     </p> : <></>}
    
//     {hovered ? <div className="flex flex-wrap gap-1 mb-2">
//         {tags.map((item) => (
//           <span 
//             key={item}
//             className=
//             {`text-xs px-2 py-1 rounded-full ${
//               priority === 3 ? 'bg-red-100 text-red-800' :
//               priority === 2 ? 'bg-amber-100 text-amber-800' :
//               'bg-emerald-100 text-emerald-800' // priority=1
//           }`}
//           >
//             #{item}
//           </span>
//         ))} 
//       </div> : <></>}

//     {/* Footer with priority and actions */}
    
//     <div className="flex flex-row items-center justify-between w-full pt-2">
//       <div className="flex items-center gap-3">
//         {/* Priority indicator */}
        
//         {isEvent ? '' : <span className={`text-xs font-medium px-2 py-1 rounded ${
//           priority === 3 ? 'bg-red-100 text-red-800' :
//           priority === 2 ? 'bg-amber-100 text-amber-800' :
//           priority === 1 ? 'bg-emerald-100 text-emerald-800': 
//           'bg-gray-100 text-gray-800' //priority=1
//         }`}>
//           {priority === null ? 'No priority' : priority}
//         </span>}
        
        
//         {/* Due date */}
//         {isEvent && dueDate ? 
//           (<div className="gap-1 mb-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"> 
//             Event
//           </div>)
//           : 
//           (isDone ? '' : <span className={`text-xs font-medium ${
//             dueDate === null ? 'text-gray-500' : 
//             moment(dueDate).diff(moment(), 'hours') < 24 
//               ? 'text-red animate-pulse' 
//               : 'text-gray-500'
//           }`}>
//             {dueDate === null ? 'No deadline' : `Due: ${moment(dueDate).fromNow()}`}
//           </span>)
//         }
        
//       </div>
      
//       {/* Action buttons */}
//       <div className="flex items-center gap-3">
//         <MdCreate 
//           className="text-gray-400 hover:text-red cursor-pointer transition-colors text-lg"
//           onClick={onEdit} 
//         />
//         <MdDelete 
//           className="text-gray-400 hover:text-red cursor-pointer transition-colors text-lg"
//           onClick={onDelete} 
//         />
//       </div>
//     </div>
//   </div>
// </div>
// )

// }

// export default NoteCard

//<p className="text-s note-hover-text">{hovered ? content : content.length > 35 ? `${content?.slice(0, 35)}...` : content}</p>
