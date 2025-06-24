import React from 'react'
import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

const PasswordInput = ({ value, onChange, placeholder }) => { 

    const [isShowPassword, setIsShowPassword] = React.useState(false)

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword)
    };

    return (
        <div className="relative flex items-center">
  <input
    value={value}
    onChange={onChange}
    type={isShowPassword ? "text" : "password"}
    placeholder={placeholder || "Password"}
    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
  <div className="absolute right-3 cursor-pointer">
     {isShowPassword ? <AiFillEye
                onClick = {toggleShowPassword} 
                className = "text-red cursor-pointer" 
                size = {40} 
            /> : <AiFillEyeInvisible
                onClick = {toggleShowPassword} 
                className = "text-yellow cursor-pointer" 
                size = {40}/>}
  </div>
</div>
    )
}

export default PasswordInput

// bg-transparent border-[1.5px] px-5 rounded mb-3 border-red focus-within:border-yellow transition-colors

// className = "w-full text-sm rounded py-3 mr-3 bg-transparent outline-none" />
        