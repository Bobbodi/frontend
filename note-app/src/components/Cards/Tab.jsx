import React from 'react'
import { FaArrowLeft } from "react-icons/fa";

const Tab = ({userInfo, onNote }) => {
  return (
    <div>
      <button className = "" onClick={onNote}>
        <div className="w-40 flex items-center p-1.5 bg-slate-100 rounded-full hover:bg-green"> 
            <FaArrowLeft className="mx-4"/>
            Tasks
        </div> 
      </button>

    </div>
  )
}

export default Tab
