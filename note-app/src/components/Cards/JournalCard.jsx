import React from "react";
import Modal from "react-modal";
import { MdDelete, MdClose } from "react-icons/md";
import moment from "moment";
import { useState } from 'react';
import Toast from '../ToastMessage/Toast';
import { FaEnvelope, FaEnvelopeOpen } from "react-icons/fa6";

const JournalCard = ({
    key, date, entry, hovered, onMouseEnter, onMouseLeave, onDelete }) => {

    const [isDoneHovered, setIsDoneHovered] = useState(false);
    const [openJournal, setOpenJournal] = React.useState({
        isShown: false,
        type: "see",
        data: null,
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        type: "add",
        message: ""
    });

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

    return (
        <>
            <div
                key={key}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                    setOpenJournal({
                        isShown: true,
                        type: "see",
                        data: entry,
                    })
                }}
            >
                {/* Envelope container with subtle animation */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <FaEnvelope className={`absolute text-green-500 text-2xl transition-all duration-300 ${hovered ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} />
                    <FaEnvelopeOpen className={`absolute text-yellow-500 text-2xl transition-all duration-300 ${hovered ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`} />
                </div>

                {/* Date with subtle hover effect */}
                <p className="text-xs text-gray-500 mt-1 transition-colors hover:text-gray-700">
                    {moment(date).format('MMM D, YYYY')}
                </p>
            </div>

            <Modal
                isOpen={openJournal.isShown}
                onRequestClose={() => setOpenJournal({ isShown: false, type: "see", data: null })}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    content: {
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        borderRadius: "0.75rem",
                        padding: "0",
                        border: "none",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        inset: 'auto',
                    }
                }}
                contentLabel="Journal entry"
                ariaHideApp={false}
            >
                <div className="relative bg-white rounded-xl p-6">
                    

                    {/* Header with date and delete */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-blue-500">
                            {moment(date).format('MMMM Do, YYYY')}
                        </h3>
                        <div> 
                            <button
                                onClick={onDelete}
                                className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                aria-label="Delete entry"
                            >
                                <MdDelete className="text-lg text-gray-400 hover:text-red-500" />
                            </button>
                            {/* Close button */}
                            <button
                                onClick={() => setOpenJournal({ isShown: false, type: "see", data: null })}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close"
                            >
                                <MdClose className="text-xl text-gray-500 hover:text-gray-700" />
                            </button>
                        </div> 
                    </div>

                    {/* Journal content */}
                    <div className="py-6">
                        <p className="text-gray-700 whitespace-pre-wrap break-words">
                            {entry}
                        </p>
                    </div>

                    {/* Footer with decorative element */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <div className="text-xs text-gray-400">
                            Journal Entry
                        </div>
                    </div>
                </div>

                <Toast
                    isShown={showToastMsg.isShown}
                    message={showToastMsg.message}
                    type={showToastMsg.type}
                    onClose={handleCloseToast}
                />
            </Modal>
        </>
    )
}

export default JournalCard;

// import React from "react";
// import Modal from "react-modal";
// import { MdDelete } from "react-icons/md";
// import moment from "moment";
// import { useState } from 'react';
// import Toast from '../ToastMessage/Toast';
// import { FaEnvelope, FaEnvelopeOpen  } from "react-icons/fa6";

// const JournalCard = ({
//     key, date, entry, hovered, onMouseEnter, onMouseLeave, onDelete}) => { 

//     const [isDoneHovered, setIsDoneHovered] = useState(false);

//     const [openJournal, setOpenJournal] = React.useState({
//             isShown: false, 
//             type: "see",
//             data: null,
//         });

//     const [showToastMsg, setShowToastMsg] = useState({ 
//         isShown: false, 
//         type: "add",
//         message: ""
//     })

//     const handleCloseToast = () => { 
//         setShowToastMsg({
//             isShown: false, 
//             message: "",
//         })
//     };

//     const showToastMessage = (message, type) => { 
//         setShowToastMsg({
//             isShown: true, 
//             message,
//             type
//         })
//     };

//     const displayContent = () => {
//         return (
//             <>
//             {entry ? (
//                 hovered ? (
//                     <span className="text-s note-hover-text whitespace-pre-wrap break-words">
//                     {entry}
//                     </span>
//                 ) : (
//                     <span className="text-s note-hover-text">
//                     {entry.length > 25 ? `${entry.slice(0, 25)}...` : entry}
//                     </span>
//                 )
//                 ) : (
//                 <span className="text-s text-white">.</span>
//                 )}
//             </>
//         )
//     }

// return (

// <>
    
//         {/* Example for a single entry (repeat for each item in your data) */}
        
//         <div 
//             key={key} 
//             className="flex flex-col items-center"
//             >
//             {/* Envelope button with hover effect */}
//             <button
//                 className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all group"
//                 onClick={() => {
//                 setOpenJournal({
//                     isShown: true,
//                     type: "see",
//                     data: entry,
//                 })}}
//                 // onMouseEnter={() => {
//                 // setOpenJournal({
//                 //     isShown: true,
//                 //     type: "see",
//                 //     data: entry,
//                 // })}}
//                 aria-label="View note"
//             >
//                 {/* Closed envelope (default) */}
//                 <FaEnvelope className="text-yellow-700 text-2xl group-hover:hidden" />
//                 {/* Open envelope (shown on hover) */}
//                 <FaEnvelopeOpen className="text-yellow-700 text-2xl hidden group-hover:block" />
//             </button>

//             {/* Creation date below the envelope */}
//             <p className="text-xs text-gray-600 mt-1">
//                 {new Date(date).toLocaleDateString(undefined, {
//                 day: 'numeric',
//                 month: 'long',
//                 year: 'numeric'
//                 })}
//             </p>
//         </div>
     
    
      
    
    


//     <Modal
//     isOpen={openJournal.isShown}
//         onRequestClose={() => setOpenJournal({ isShown: false, type: "see", data: null })}
//         style={{
//             overlay: {
//                 backgroundColor: "rgba(0, 0, 0, 0.5)",
//                 zIndex: 1000
//             },
//             content: {
//                 maxHeight: "90vh",
//                 borderRadius: "0.5rem",
//                 padding: "0",
//                 border: "none",
//                 boxShadow: "0 10px 0px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//             }
//         }}
//         contentLabel="Open journal"
//         className="w-[90%]"
//         overlayClassName="fixed inset-0 flex items-center justify-center p-4"  
//         ariaHideApp={false}
//     >

//     <div
//         className="border rounded-2xl p-4 bg-white hover:shadow-2xl transition-all duration-200 ease-in-out group"
//         style={{ borderColor: "#ffd166", borderWidth: "3px" }}
//         onMouseEnter={onMouseEnter}
//         onMouseLeave={onMouseLeave}
//     >
//         <style>
//             {`
//                 .group:hover {
//                     border-color: #ef476f !important;
//                 }
//                 .group:hover .note-hover-text {
//                     color: #ef476f !important;
//                 }
//             `}
//         </style>
//         <div className="flex items-center justify-between">
//             <div>
//                 <span className='text-xl text-red'>{moment(date).format('Do MMM YYYY')}</span>
//             </div>

//             <div className="flex items-center gap-2">
//                 <MdDelete className="text-gray-300 cursor-pointer hover:text-red"
//                     onClick={onDelete} />
//             </div>

//         </div>

//         <p className="text-s"> {entry} </p> 


//         <Toast
//             isShown={showToastMsg.isShown}
//             message={showToastMsg.message}
//             type={showToastMsg.type}
//             onClose={handleCloseToast}
//         />
//     </div>

//     </Modal>
// </>
   
// )

// }

// export default JournalCard

// //<p className="text-s note-hover-text">{hovered ? content : content.length > 35 ? `${content?.slice(0, 35)}...` : content}</p>
