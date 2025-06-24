import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarv3 from '../../components/Navbarv3'
import axiosInstance from '../../utils/axiosInstance';
import imgsrc from '../../assets/images/customise-avatar.png';

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"
import { Model } from "../../../public/3_06AM"; 



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

  return (
    <>
      <Navbarv3 userInfo={userInfo}/>

      <Canvas camera={{ fov: 64, position: [5, 5, 20] }}>
        
        <ambientLight intensity={5} />
        <OrbitControls enableZoom={true} />
        <Model />
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