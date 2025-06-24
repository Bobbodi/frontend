import React from 'react'

const EmptyCard = ({ imgSrc, message }) => {
return (
    <div className="flex flex-col items-center justify-center m-10">
        <img src={imgSrc} alt="No notes" className="w-30" />
        <p className="w-100 text-m font-medium text-black text-center leading-7">{message}</p>
    </div>
)
}

export default EmptyCard
