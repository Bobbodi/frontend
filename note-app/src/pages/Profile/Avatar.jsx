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

//react-three-js
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"
import AvatarCard from '../../components/Cards/AvatarCard.jsx';
import Toast from "../../components/ToastMessage/Toast";

const Avatar = () => {

  const [userInfo, setUserInfo] = useState(null); 

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
    

  const navigate = useNavigate();

  useEffect(() => { 
      getUserInfo(); 
      return () => {};
  }, [])
      

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

  const AVATAR_MODELS = { 
      1: {
        "model": BeeModel, 
        "position": [0, 0, 0], 
        "rotation": [0, -2.5, 0], 
        "scale": [0.7, 0.7, 0.7]
      }, 
      2: {
        "model": CamelModel, 
        "position": [0, -3, 0], 
        "rotation": [0, 0.8, 0], 
        "scale": [2.5, 2.5, 2.5]
      },
      3: {
        "model": CentaurModel, 
        "position": [0, -2.7, 0], 
        "rotation": [0, -1.7, 0], 
        "scale": [2.6, 2.6, 2.6]
      },
      4: {
        "model": CowModel, 
        "position": [0, -2.3, 0], 
        "rotation": [0, 1.5, 0], 
        "scale": [4, 4, 4]
      },
      5: {
        "model": SteveModel, 
        "position": [0, 0, 0], 
        "rotation": [0, 0.5, 0], 
        "scale": [0.2, 0.2, 0.2]
      },
      6: {
        "model": MonsterModel, 
        "position": [0, -3.5, 0], 
        "rotation": [0, 0, 0], 
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
        "position": [0, -0.5, 0], 
        "rotation": [0, -2.5, 0], 
        "scale": [1, 1, 1]
      },
      9: {
        "model": SharkModel, 
        "position": [2.4, -1.5, 0], 
        "rotation": [0, -2.5, 0], 
        "scale": [0.33, 0.33, 0.33]},
      10: {
        "model": CreeperModel,
        "position": [0, 0, 0], 
        "rotation": [0, 0.5, 0], 
        "scale": [0.30, 0.30, 0.30]
      },
    }


  const onChangeAvatar = async (model) => {
    const userId = userInfo._id;
      try { 
        console.log("here2")
        const response = await axiosInstance.put("/change-avatar/" + userId, { 
            "newAvatar": model
        })

        if (response.data && response.data.existingUser) { 
            console.log("here3")
            showToastMessage("Avatar Updated Succesfully")
        } 

    } catch (error) { 
        if (error.response && error.response.data && error.response.data.message) { 
            setError(error.response.data.message)
        }
    }
  }


  return (
    <>
      <Navbarv3 userInfo={userInfo}/>

      <div className="ml-5 flex flex-row items-center justify-between overflow-x-auto">
        {Object.entries(AVATAR_MODELS).map(([number]) => (
          
          <AvatarCard
            model={number}
            onChangeAvatar={onChangeAvatar}
          />
          
        ))}
      </div> 


      <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onClose={handleCloseToast}
      />


    </>
  )

}

export default Avatar

//   const [userInfo, setUserInfo] = useState(null); 

//   const navigate = useNavigate();

//   useEffect(() => { 
//       getUserInfo(); 
//       return () => {};
//   }, [])
      

//   const getUserInfo = async () => { 
//       try { 
//           const response = await axiosInstance.get("/get-user");
//           if (response.data && response.data.user) { 
//               setUserInfo(response.data.user);
//           }
//       } catch (error) { 
//           if (error.response.status == 401) { 
//               localStorage.clear(); 
//               navigate("/login");
//           }
//       }
//   }

// const AnimatedDog = () => {
//   const dogRef = useRef();
//   const speed = 0.005;
//   const duration = {
//     move: 5000,
//     stop: 3000,
//   };

//   const xRef = useRef(0);
//   const phaseRef = useRef('left');
//   const [phase, setPhase] = useState('left'); // For debugging or visuals
//   const lastPhaseChangeTime = useRef(performance.now());

//   useEffect(() => {
//     const animate = (timestamp) => {
//       if (!dogRef.current) return;

//       const elapsed = timestamp - lastPhaseChangeTime.current;
//       let x = xRef.current;
//       let currentPhase = phaseRef.current;

//       switch (currentPhase) {
//         case 'left':
//           x -= speed;
//           dogRef.current.position.set(x, 0, 0);
//           dogRef.current.rotation.set(0, -Math.PI / 2, 0);
//           if (elapsed > duration.move) {
//             currentPhase = 'stopafterleft';
//             lastPhaseChangeTime.current = timestamp;
//           }
//           break;

//         case 'stopafterleft':
//           dogRef.current.rotation.set(0, 0, 0);
//           if (elapsed > duration.stop) {
//             currentPhase = 'right';
//             lastPhaseChangeTime.current = timestamp;
//           }
//           break;

//         case 'right':
//           x += speed;
//           dogRef.current.position.set(x, 0, 0);
//           dogRef.current.rotation.set(0, Math.PI / 2, 0);
//           if (elapsed > duration.move) {
//             currentPhase = 'stopafterright';
//             lastPhaseChangeTime.current = timestamp;
//           }
//           break;

//         case 'stopafterright':
//           dogRef.current.rotation.set(0, 0, 0);
//           if (elapsed > duration.stop) {
//             currentPhase = 'left';
//             lastPhaseChangeTime.current = timestamp;
//           }
//           break;
//       }

//       // Update refs
//       xRef.current = x;
//       phaseRef.current = currentPhase;
//       setPhase(currentPhase); // optional, for re-rendering/debug

//       requestAnimationFrame(animate);
//     };

//     const id = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(id);
//   }, []);

//   return (
//     <group ref={dogRef} position={[0, 0, 0]}>
//       <Dog scale={[10, 10, 10]} />
//     </group>
//   );
// };


//<img src = {imgsrc}></img>

// {allClothes.map((item) => (
//                   <Clothing 
//                       key={item._id}
//                       title={item.title}
//                       date={item.createdOn}
//                       content={item.content}
//                       priority={item.priority}
//                       deadline={item.dueDate}
//                       tags={item.tags}
//                       isDone={item.isDone}
//                       onEdit={() => handleEdit(item)}
//                       onDelete={() => deleteNote(item)}
//                       onDoneNote={() => updateIsDone(item)}
//                       hovered={hoveredNoteId===item._id}
//                       onMouseEnter={() => setHoveredNoteId(item._id)}
//                       onMouseLeave={() => setHoveredNoteId(null)}
//                   />))}


//  <div className="flex flex-row items-center justify-center"> 
        
      
      
//         <div className="container mx-auto"> 
//           <div className="">
              
//           </div> 
//         </div>
//       </div> 

      // <Navbarv3 userInfo={userInfo}/>

      // <Canvas camera={{ fov: 64, position: [5, 5, 20] }}>
      //   <axesHelper args={[5]} />
      //   <ambientLight intensity={1} />
      //   <OrbitControls enableZoom={true} />
      //   <Model/>{/* Room model */}
      //   <AnimatedDog /> {/* Animated Dog model */}
      //   <Environment preset='sunset'/>
      //   <ContactShadows opacity={0.5} scale={100} blur={1} far={10} resolution={256} color="#000000" />
        

      // </Canvas>

      
      // <Canvas camera={{
      //   position: [3, 3, 3]
      // }}>
      //   <OrbitControls/>
      //   <mesh> 
      //     <boxGeometry args={[1, 1, 1]} />
      //     <meshNormalMaterial/>
      //   </mesh> 
      // </Canvas>

      // <Canvas> 
      //   <ambientLight intensity={2} />
      //   <AnimatedDog />
      // </Canvas>