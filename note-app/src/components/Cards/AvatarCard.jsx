import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarv3 from '../../components/Navbarv3'
import axiosInstance from '../../utils/axiosInstance';

//components
import { Room1Model } from '../../components/3D models/Room1Model.jsx';
import { BeeModel } from '../../components/3D models/BeeModel.jsx';
import { CamelModel } from '../../components/3D models/CamelModel.jsx';
import { CentaurModel } from '../../components/3D models/CentaurModel.jsx';
import { CowModel } from '../../components/3D models/CowModel.jsx';
import { MonsterModel } from '../../components/3D models/MonsterModel.jsx';
import { PigmanModel } from '../../components/3D models/PigmanModel.jsx';
import { RainbowDragonModel } from '../../components/3D models/RainbowDragonModel.jsx';
import { SharkModel } from '../../components/3D models/SharkModel.jsx';
import { SteveModel } from '../../components/3D models/SteveModel.jsx';
import { CreeperModel } from '../../components/3D models/CreeperModel.jsx';
import { AVATAR_DESC } from '../../utils/constants.js';

//react-three-js
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"

import { TbSwitch3 } from "react-icons/tb";

const AvatarCard = ({model, onChangeAvatar}) => {

    const AVATAR_MODELS = { 
        1: {
        "model": BeeModel, 
        "position": [0, -0.8, 0], 
        "rotation": [0, -2.5, 0], 
        "scale": [0.8, 0.8, 0.8]
        }, 
        2: {
        "model": CamelModel, 
        "position": [-0.5, -3.3, 0], 
        "rotation": [0, -2.5, 0], 
        "scale": [2.5, 2.5, 2.5]
        },
        3: {
        "model": CentaurModel, 
        "position": [0, -3.5, 0], 
        "rotation": [0, -2.5, 0], 
        "scale": [2.6, 2.6, 2.6]
        },
        4: {
        "model": CowModel, 
        "position": [0, -3, 0], 
        "rotation": [0, 1.5, 0], 
        "scale": [4, 4, 4]
        },
        5: {
        "model": SteveModel, 
        "position": [0, 0, 0], 
        "rotation": [0, 0.5, 0], 
        "scale": [0.22, 0.22, 0.22]
        },
        6: {
        "model": MonsterModel, 
        "position": [0, -3.5, 0], 
        "rotation": [0, -0.3, 0], 
        "scale": [2, 2, 2]
        },
        7: {
        "model": PigmanModel, 
        "position": [0, -3.5, 0], 
        "rotation": [0, -2.5, 0], 
        "scale": [4, 4, 4]
        },
        8: {
        "model": RainbowDragonModel, 
        "position": [1, -0.5, 0], 
        "rotation": [0, -2.2, 0], 
        "scale": [0.9, 0.9, 0.9]
        },
        9: {
        "model": SharkModel, 
        "position": [2.6, -1.5, 0], 
        "rotation": [0, -2.4, 0], 
        "scale": [0.33, 0.33, 0.33]},
        10: {
        "model": CreeperModel,
        "position": [0, 0, 0], 
        "rotation": [0, 0.3, 0], 
        "scale": [0.25, 0.25, 0.25]
        },
    }

    const UserAvatar = ({ avatarId }) => { 
        const avatarRef = useRef(); 
        const avatar = avatarId ? AVATAR_MODELS[avatarId] : AVATAR_MODELS[2];
        const AvatarModel = avatar.model || AVATAR_MODELS[1].model; //fallback to default if not specified
        return ( 
        <group ref = {avatarRef} position = {avatar.position} rotation = {avatar.rotation}> 
            <AvatarModel scale={avatar.scale}/>
        </group>
        )
    }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-107px)] p-4">
        <div className="bg-yellow-50 rounded-2xl shadow-2xl border-4 border-yellow-100 w-[300px] overflow-hidden relative">
            
            <div className="w-[300px] h-[270px]">
            <Canvas camera={{ fov: 8, position: [0, 2, 70]}}>
                <ambientLight intensity={0.5} />
                <OrbitControls
                enableZoom={true}
                minAzimuthAngle={-Math.PI}
                // maxAzimuthAngle={Math.PI}
                minPolarAngle={Math.PI / 2.5}
                maxPolarAngle={Math.PI}
                />
                <UserAvatar avatarId={Number(model)} />
                <Environment preset="sunset" />
            </Canvas>
            </div> 

            <div className="ml-5 mr-5 mb-5">
                <h3 className="text-center text-xl text-yellow-700 font-bold"> 
                    {AVATAR_DESC[Number(model)].name}
                </h3>

                <div className="flex flex-row items-center justify-between gap-2">
                    <div className="text-sm">
                        {AVATAR_DESC[Number(model)].speciality}
                    </div> 
                    <div className="flex flex-col items-center justify-between"> 
                        <div className="text-xl"> 
                        {AVATAR_DESC[Number(model)].hp}
                        </div> 
                        <div className="text-md">
                            HP
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-2 ">
                    <button
                    onClick={() => onChangeAvatar(Number(model))}
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

export default AvatarCard
