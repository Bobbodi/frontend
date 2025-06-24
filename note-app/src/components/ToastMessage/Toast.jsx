import React, { useEffect } from 'react'
import { LuCheck } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'

const Toast = ({ isShown, message, type, onClose }) => {

  useEffect(() => { 
    const timeoutId = setTimeout(() => { 
      onClose();
    }, 3000);

    return () => { 
      clearTimeout(timeoutId);
    };
  }, [onClose])

  return (
    <div
      className={`fixed left-1/2 bottom-10 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isShown ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ minWidth: '13rem' }}
    >
      <div
        className={`relative bg-white border shadow-2xl rounded-md after:w-[5px] after:h-full 
        ${type === "delete" ? "after:bg-red-500" : "after:bg-green-500"}
        after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
      >
        <div className="flex items-center gap-3 py-2 px-4">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              type === "delete" ? "bg-red-50" : "bg-green-50"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-500" />
            ) : (
              <LuCheck className="text-xl text-green-500" />
            )}
          </div>
          <p className="text-sm text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default Toast
