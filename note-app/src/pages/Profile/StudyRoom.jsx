import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"
import Toast from "../../components/ToastMessage/Toast";

import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarv3 from '../../components/Navbarv3'
import axiosInstance from '../../utils/axiosInstance';

import { Room1Model } from "../../components/3D models/Room1Model";
import { Room2Model } from '../../components/3D models/Room2Model.jsx';
import { Room3Model } from '../../components/3D models/Room3Model.jsx';
import { Room4Model } from '../../components/3D models/Room4Model.jsx';
import { Room5Model } from '../../components/3D models/Room5Model.jsx';
import { Room6Model } from '../../components/3D models/Room6Model.jsx';
import { Room7Model } from '../../components/3D models/Room7Model.jsx';

import RoomCard from "../../components/Cards/RoomCard.jsx";

const StudyRoom = () => {

  const [userInfo, setUserInfo] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => { 
      getUserInfo(); 
      return () => {};
  }, [])
      

  const [error, setError] = useState(null);
  
  const [showToastMsg, setShowToastMsg] = useState({ 
        isShown: false, 
        type: "add",
        message: ""
    })

  const handleCloseToast = () => { 
        setShowToastMsg({
            isShown: false, 
            message: "",
        })
        //navigate("/profile")
    };
  const showToastMessage = (message, type) => { 
        setShowToastMsg({
            isShown: true, 
            message,
            type
        })
    };

  const getUserInfo = async () => { 
      try { 
          const response = await axiosInstance.get("/get-user");
          if (response.data && response.data.user) { 
              setUserInfo(response.data.user);
          }
      } catch (error) { 
          if (error.response.status == 401) { 
              localStorage.clear(); 
              navigate("/login");
          }
      }
  }

  const onChangeRoom = async (model) => {
    const userId = userInfo._id;
      try { 
        console.log("here2")
        const response = await axiosInstance.put("/change-studyroom/" + userId, { 
            "newRoom": model
        })

        if (response.data && response.data.existingUser) { 
            console.log("here3")
            showToastMessage("StudyRoom Updated Succesfully")
        } 

    } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
            setError(error.response.data.message)
        }
    }
  }

      const ROOM_MODELS = { 
        1: {
          "model": Room1Model, 
          "position": [0, -4.5, 0], 
          "rotation": [0, 0, 0], 
          "scale": [1, 1, 1]
        },
        2: { 
          "model": Room2Model, 
          "position": [0, -5, 0], 
          "rotation": [0, -1.5, 0], 
          "scale": [0.1, 0.1, 0.1]
        },
        3: { 
          "model": Room3Model, 
          "position": [0, -5, 0], 
          "rotation": [0, -1.5, 0], 
          "scale": [0.2, 0.2, 0.2]
        },
        4: { 
          "model": Room4Model, 
          "position": [0, -5, 0], 
          "rotation": [0, -1.5, 0], 
          "scale": [0.2, 0.2, 0.2]
        },
        5: { 
          "model": Room5Model, 
          "position": [-2, -2, 2], 
          "rotation": [0, 0, 0], 
          "scale": [0.5, 0.5, 0.5]
        },
        6: { 
          "model": Room6Model, 
          "position": [0, -4, 0], 
          "rotation": [0, -1.5, 0], 
          "scale": [0.008, 0.008, 0.008]
        },
        7: { 
          "model": Room7Model, 
          "position": [0, -5, 0], 
          "rotation": [0, -1.5, 0], 
          "scale": [0.3, 0.3, 0.3]
        },
        
      }
  

  return (
    <div>
      <Navbarv3 userInfo={userInfo}/>

      <div className="ml-5 flex flex-row items-center justify-between overflow-x-auto">
        {Object.entries(ROOM_MODELS).map(([number]) => (
          
          <RoomCard
            model={number}
            onChangeRoom={onChangeRoom}
          />
          
        ))}
      </div> 


      <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onClose={handleCloseToast}
      />
    </div>

  )
}

export default StudyRoom
