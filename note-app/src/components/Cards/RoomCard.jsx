import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarv3 from '../Navbarv3.jsx'
import axiosInstance from '../../utils/axiosInstance.js';

//components
import { Room1Model } from '../3D models/Room1Model.jsx';
import { Room2Model } from '../../components/3D models/Room2Model.jsx';
import { Room3Model } from '../../components/3D models/Room3Model.jsx';
import { Room4Model } from '../../components/3D models/Room4Model.jsx';
import { Room5Model } from '../../components/3D models/Room5Model.jsx';
import { Room6Model } from '../../components/3D models/Room6Model.jsx';
import { Room7Model } from '../../components/3D models/Room7Model.jsx';

import { ROOM_DESC } from '../../utils/constants.js';

//react-three-js
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"

import { TbSwitch3 } from "react-icons/tb";

const RoomCard = ({model, onChangeRoom}) => {

    const ROOM_MODELS = { 
    1: {
        "model": Room1Model, 
        "position": [0, -3.3, 0], 
        "rotation": [0, -0.5, 0], 
        "scale": [0.9, 0.9, 0.9]
    },
    2: { 
    "model": Room2Model, 
    "position": [0, -3.5, 0], 
    "rotation": [0, -2, 0], 
    "scale": [0.1, 0.1, 0.1]
    },
    3: { 
    "model": Room3Model, 
    "position": [0, -3.5, 0], 
    "rotation": [0, -2.3, 0], 
    "scale": [0.2, 0.2, 0.2]
    },
    4: { 
    "model": Room4Model, 
    "position": [1, -3.5, 0], 
    "rotation": [0, -2.3, 0], 
    "scale": [0.2, 0.2, 0.2]
    },
    5: { 
    "model": Room5Model, 
    "position": [-2.3, -0.5, 2], 
    "rotation": [0, -0.8, 0], 
    "scale": [0.4, 0.4, 0.4]
    },
    6: { 
    "model": Room6Model, 
    "position": [0, -3, 0], 
    "rotation": [0, -2.4, 0], 
    "scale": [0.0055, 0.0055, 0.0055]
    },
    7: { 
    "model": Room7Model, 
    "position": [0, -4, 0], 
    "rotation": [0, -2.1, 0], 
    "scale": [0.21, 0.21, 0.21]
    },
        
        
    }

    const UserRoom = ({ roomId }) => { 
        const roomRef = useRef(); 
        const room = ROOM_MODELS[roomId];
        const RoomModel = room.model || ROOM_MODELS[1].model; //fallback to default if not specified
        return ( 
        <group ref = {roomRef} position = {room.position} rotation = {room.rotation}> 
            <RoomModel scale={room.scale}/>
        </group>
        )
    }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-107px)] p-4">
        <div className="bg-yellow-50 rounded-2xl shadow-2xl border-4 border-yellow-100 w-[370px] overflow-hidden relative">
            
            <div className="w-[370] h-[270px]">
            <Canvas camera={{ fov: 8, position: [0, 2, 70]}}>
                <ambientLight intensity={0} />
                <OrbitControls
                enableZoom={true}
                minAzimuthAngle={-Math.PI}
                // maxAzimuthAngle={Math.PI}
                minPolarAngle={Math.PI / 2.5}
                maxPolarAngle={Math.PI}
                />
                <UserRoom roomId={Number(model)} />
                <Environment preset="apartment" />
            </Canvas>
            </div> 

            <div className="ml-5 mr-5 mb-5">
                <h3 className="text-center text-xl text-yellow-700 font-bold"> 
                    {ROOM_DESC[Number(model)].name}
                </h3>

                <div className="flex flex-row items-center justify-between gap-2">
                    <div className="text-sm">
                        {ROOM_DESC[Number(model)].speciality}
                    </div> 
                    <div className="flex flex-col items-center justify-between"> 
                        <div className="text-xl"> 
                        {ROOM_DESC[Number(model)].hp}
                        </div> 
                        <div className="text-md">
                            HP
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-2 ">
                    <button
                    onClick={() => onChangeRoom(Number(model))}
                    className="group px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg 
                    transition-all duration-200 hover:bg-yellow-100 border border-yellow-100 hover:border-yellow-200
                    flex items-center gap-2"
                    >
                    <TbSwitch3 className="w-4 h-4 group-hover:rotate-360 transition-transform" />
                    <span className="text-xs font-medium">Change</span>
                    </button>
                </div>

            </div> 
        </div> 
    </div>
  )
}

export default RoomCard
