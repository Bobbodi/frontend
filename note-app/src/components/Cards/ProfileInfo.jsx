import React from 'react'
import { getInitials } from '../../utils/helper'
import { FaTasks, FaUserFriends, FaBook } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { BiBookHeart } from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { BiHelpCircle } from "react-icons/bi";

const ProfileInfo = ({ userInfo, onLogout, onProfile, onWellness, onStudy, onTasks, isWellness, isTasks, isStudy, isProfile }) => {
  
  const TabItem = ({ icon: Icon, label, isActive, onClick }) => (
  <div 
    className={`
      relative
      flex flex-col items-center
      p-2
      text-xl
      rounded-lg
      cursor-pointer
      transition-all
      duration-200
      ${isActive 
        ? 'bg-dark text-white shadow-md' 
        : 'text-yellow-700 hover:bg-yellow-50 hover:text-dark'
      }
      group
    `}
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="text-2xl" />
      <span className="sr-only">{label}</span>
      <div className="
        absolute
        top-full
        left-1/2
        transform
        -translate-x-1/2
        mt-3
        hidden
        group-hover:block
        bg-dark
        text-white
        text-xs
        py-1
        px-2
        rounded
        whitespace-nowrap
        z-10
      ">
        {label}
      </div>
    </div>
  </div>
);

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">

        <TabItem 
          icon={FaTasks} 
          label="Tasks" 
          isActive={isTasks} 
          onClick={onTasks} 
        />
        
        {/* <TabItem 
          icon={FaUserFriends} 
          label="Friends" 
          isActive={isFriends} 
          onClick={onFriends} 
        /> */}
        
        <TabItem 
          icon={FaBook} 
          label="Study" 
          isActive={isStudy} 
          onClick={onStudy} 
        />

        <TabItem 
          icon={BiBookHeart} 
          label="Wellness" 
          isActive={isWellness} 
          onClick={onWellness} 
        />

        
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button 
          onClick={onProfile}
          className="relative group"
        >
          <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-medium transition-colors duration-200
          ${
            isProfile 
            ? 'bg-dark'
            : 'bg-yellow-700 hover:bg-dark'
          }`}>
            {getInitials(userInfo?.fullName)}
          </div>
          <div className="absolute top-full mt-2 hidden group-hover:block bg-dark text-white text-xs py-1 px-2 rounded whitespace-nowrap">
            Profile
          </div>
        </button>
        
        <div>
          <p className="text-sm font-medium">{userInfo?.fullName}</p>
          <button 
            className="text-sm text-slate-700 hover:text-dark underline transition-colors"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo

// import React from 'react'
// import { getInitials } from '../../utils/helper'
// import { BsFillJournalBookmarkFill } from "react-icons/bs";
// import { BiBookHeart } from "react-icons/bi";
// import { PiStudentBold } from "react-icons/pi";
// import { FaBook } from "react-icons/fa";
// import { FaTasks } from "react-icons/fa";
// import { FaUserFriends } from "react-icons/fa";
// import { FaBookOpenReader } from "react-icons/fa6";


// const ProfileInfo = ({ userInfo, onLogout, onProfile, onFriends, onWellness, onStudy, onTasks, isFriends, isWellness, isTasks, isStudy }) => {
  
//   return (
//     //add feature where if you hover on the tab it will show text displaying what it is
//     <div className="flex items-center gap-4">

//       <div className={`
//         text-2xl 
//         ${isTasks ? 'p-1 border-0.5 border-transparent shadow-[0_0_0_4px] rounded-sm' : ''} 
//         ${isTasks ? 'text-dark' : 'text-yellow-700'}
//         ${isTasks ? 'hover:text-dark': 'hover:text-dark'}
//       `}
//       onClick={onTasks}> Tasks </div>

//       <div className={`
//         text-2xl 
//         ${isWellness ? 'p-1 border-0.5 border-transparent shadow-[0_0_0_4px_var(--color-dark)] rounded-sm' : ''} 
//         ${isWellness ? 'text-dark' : 'text-yellow-700'}
//         ${isWellness ? 'hover:text-dark': 'hover:text-dark'}
//       `}
      
//       onClick={onWellness}> Wellness </div>

//       <div className={`
//         text-2xl 
//         ${isFriends ? 'p-1 border-0.5 border-transparent shadow-[0_0_0_4px_var(--color-dark)] rounded-sm' : ''} 
//         ${isFriends ? 'text-dark' : 'text-yellow-700'}
//         ${isFriends ? 'hover:text-dark': 'hover:text-dark'}
//       `}  onClick={onFriends}> Friends </div>

//       <div className={`
//         text-2xl 
//         ${isStudy ? 'p-1 border-b-0.5 border-transparent shadow-[0_0_0_4px_var(--color-dark)] rounded-sm' : ''} 
//         ${isStudy ? 'text-dark' : 'text-yellow-700'}
//         ${isStudy ? 'hover:text-dark':   'hover:text-dark'}
//       `} onClick={onStudy}> Study </div>

//       <button className = "" onClick={onProfile}>
//           <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-medium bg-yellow-700 hover:bg-dark hover:text-white"> 
//             {getInitials(userInfo?.fullName)} 
//           </div> 
//       </button>
        
//       <div>  
//           <p className = "text-sm font-medium"> {userInfo?.fullName} </p> 
//           <button className = "text-sm text-slate-700 underline" onClick={onLogout}>
//               Logout
//           </button>
    
//       </div>

//     </div>
//   )
// }

// export default ProfileInfo
