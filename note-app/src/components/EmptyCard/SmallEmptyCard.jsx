import React from 'react'

const EmptyCard = ({ imgSrc, message }) => {
return (
    <div className="flex flex-col items-center">
        <img src={imgSrc} alt="No notes" className=" w-20" />
        <p className="w-50 text-xs font-medium text-gray-400 text-center leading-7">{message}</p>
    </div>
)
}

export default EmptyCard
