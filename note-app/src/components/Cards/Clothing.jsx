import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import hatImg from '../../assets/images/hat.png';
import shirtImg from '../../assets/images/shirt.png';
import pantsImg from '../../assets/images/pants.png';

const imageMap = {
  hat: hatImg,
  shirt: shirtImg,
  pants: pantsImg,
};

const DraggableClothing = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CLOTHING_ITEM',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 border rounded-md transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100 hover:shadow-md'
      } cursor-grab active:cursor-grabbing bg-white`}
    >
      <img
        src={imageMap[type]}
        alt={type}
        className="w-12 h-12 object-contain mx-auto"
      />
      <p className="text-xs text-center mt-1 text-gray-600 capitalize">{type}</p>
    </div>
  );
};

const AvatarCanvas = ({ children, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CLOTHING_ITEM',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const rect = monitor.getBoundingClientRect();
      const x = offset.x - rect.left;
      const y = offset.y - rect.top;
      onDrop(item.type, x, y);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`relative w-80 h-[500px] rounded-lg border-2 ${
        isOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-dashed border-gray-300 bg-gray-50'
      } transition-colors`}
    >
      {children}
    </div>
  );
};

const Clothing = () => {
  // Ensure all clothing types are present in the state
  const [outfit, setOutfit] = useState({
    hat: { x: 50, y: 20, visible: false },
    shirt: { x: 50, y: 100, visible: false },
    pants: { x: 50, y: 200, visible: false },
  });

  const handleItemDrop = (type, x, y) => {
    // Only update if the type exists in outfit
    if (outfit[type]) {
      setOutfit((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          x: Math.max(0, Math.min(x, 300 - 80)), // 300=canvas width, 80=item width
          y: Math.max(0, Math.min(y, 500 - 80)), // 500=canvas height
          visible: true,
        },
      }));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <AvatarCanvas onDrop={handleItemDrop}>
            {Object.entries(outfit).map(([type, { x, y, visible }]) =>
              visible ? (
                <div
                  key={type}
                  className="absolute z-10 cursor-move"
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <img
                    src={imageMap[type]}
                    alt={type}
                    className="w-20 h-20 object-contain"
                  />
                </div>
              ) : null
            )}
          </AvatarCanvas>

          <div className="w-full md:w-56 p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-medium text-gray-700 mb-3">Wardrobe</h3>
            <div className="grid grid-cols-2 gap-3">
              {['hat', 'shirt', 'pants'].map((type) => (
                <DraggableClothing key={type} type={type} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Clothing;


// <div>
    //   <button className = "grid grid-cols-4 gap-5" onClick={moveTo()}>
    //     <div className="text-6xl p-5 flex items-center p-1.5 bg-slate-100 rounded-xl border-4 border-white hover:bg-yellow hover:border-4 hover:border-black"> 
    //         <BiSolidTShirt/>
    //     </div> 
    //     <div className="text-6xl p-5 flex items-center p-1.5 bg-slate-100 rounded-xl border-4 border-white hover:bg-yellow hover:border-4 hover:border-black"> 
    //         <TbShirt/>
    //     </div> 
    //     <div className="text-6xl p-5 flex items-center p-1.5 bg-slate-100 rounded-xl border-4 border-white hover:bg-yellow hover:border-4 hover:border-black"> 
    //         <GiPoloShirt/>
    //     </div> 
    //     <div className="text-6xl p-5 flex items-center p-1.5 bg-slate-100 rounded-xl border-4 border-white hover:bg-yellow hover:border-4 hover:border-black"> 
    //         <BiSolidTShirt/>
    //     </div> 
    //     <div className="text-6xl p-5 flex items-center p-1.5 bg-slate-100 rounded-xl border-4 border-white hover:bg-yellow hover:border-4 hover:border-black"> 
    //         <BiSolidTShirt/>
    //     </div> 
    //     <div className="text-6xl p-5 flex items-center p-1.5 bg-slate-100 rounded-xl border-4 border-white hover:bg-yellow hover:border-4 hover:border-black"> 
    //         <BiSolidTShirt/>
    //     </div> 
    //   </button>

    // </div>
