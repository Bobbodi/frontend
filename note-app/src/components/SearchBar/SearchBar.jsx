import React from 'react'
import { IoIosSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({value, onChange, handleSearch, onClearSearch, onKeyDown, text}) => {
  return (
    <div className = "w-80 flex items-center px-4 bg-white rounded-full">
        <input 
            type = "text" 
            placeholder = {text} 
            className = "w-full text-s bg-transparent py-[11px] outline-none" 
            value = {value} 
            onChange = {onChange}
            onKeyDown={onKeyDown}
        />

        {value && <IoMdClose className = "text-xl text-slate-400 cursor-pointer hover:text-black" onClick={onClearSearch} />}
        <IoIosSearch className = "text-xl text-slate-400 cursor-pointer hover:text-black" onClick={handleSearch}
        />


    

    </div>
  )
}

export default SearchBar
