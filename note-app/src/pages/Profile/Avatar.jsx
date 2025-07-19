import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarv3 from '../../components/Navbarv3'
import axiosInstance from '../../utils/axiosInstance';
import imgsrc from '../../assets/images/customise-avatar.png';

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"
import { Model } from "../../../public/room/Room1"; 

import { Model as Dog } from "../../../public/dog/Dog"
const Avatar = () => {

  const [userInfo, setUserInfo] = useState(null); 

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

const AnimatedDog = () => {
  const dogRef = useRef();
  const speed = 0.005;
  const duration = {
    move: 5000,
    stop: 3000,
  };

  const xRef = useRef(0);
  const phaseRef = useRef('left');
  const [phase, setPhase] = useState('left'); // For debugging or visuals
  const lastPhaseChangeTime = useRef(performance.now());

  useEffect(() => {
    const animate = (timestamp) => {
      if (!dogRef.current) return;

      const elapsed = timestamp - lastPhaseChangeTime.current;
      let x = xRef.current;
      let currentPhase = phaseRef.current;

      switch (currentPhase) {
        case 'left':
          x -= speed;
          dogRef.current.position.set(x, 0, 0);
          dogRef.current.rotation.set(0, -Math.PI / 2, 0);
          if (elapsed > duration.move) {
            currentPhase = 'stopafterleft';
            lastPhaseChangeTime.current = timestamp;
          }
          break;

        case 'stopafterleft':
          dogRef.current.rotation.set(0, 0, 0);
          if (elapsed > duration.stop) {
            currentPhase = 'right';
            lastPhaseChangeTime.current = timestamp;
          }
          break;

        case 'right':
          x += speed;
          dogRef.current.position.set(x, 0, 0);
          dogRef.current.rotation.set(0, Math.PI / 2, 0);
          if (elapsed > duration.move) {
            currentPhase = 'stopafterright';
            lastPhaseChangeTime.current = timestamp;
          }
          break;

        case 'stopafterright':
          dogRef.current.rotation.set(0, 0, 0);
          if (elapsed > duration.stop) {
            currentPhase = 'left';
            lastPhaseChangeTime.current = timestamp;
          }
          break;
      }

      // Update refs
      xRef.current = x;
      phaseRef.current = currentPhase;
      setPhase(currentPhase); // optional, for re-rendering/debug

      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <group ref={dogRef} position={[0, 0, 0]}>
      <Dog scale={[10, 10, 10]} />
    </group>
  );
};

  return (
    <>
      <Navbarv3 userInfo={userInfo}/>

      <Canvas camera={{ fov: 64, position: [5, 5, 20] }}>
        <axesHelper args={[5]} />
        <ambientLight intensity={1} />
        <OrbitControls enableZoom={true} />
        <Model/>{/* Room model */}
        <AnimatedDog /> {/* Animated Dog model */}
        <Environment preset='sunset'/>
        <ContactShadows opacity={0.5} scale={100} blur={1} far={10} resolution={256} color="#000000" />
        

      </Canvas>

      
      <Canvas camera={{
        position: [3, 3, 3]
      }}>
        <OrbitControls/>
        <mesh> 
          <boxGeometry args={[1, 1, 1]} />
          <meshNormalMaterial/>
        </mesh> 
      </Canvas>

      <Canvas> 
        <ambientLight intensity={2} />
        <AnimatedDog />
      </Canvas>

    </>
  )
}

export default Avatar
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