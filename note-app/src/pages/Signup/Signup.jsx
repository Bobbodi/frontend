import React from "react";
import Navbarv2 from "../../components/Navbarv2";
import PasswordInput from "../../components/Input/PasswordInput";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

import { Room6Model } from '../../components/3D models/Room6Model.jsx';
import { Room1Model } from '../../components/3D models/Room1Model.jsx';
import { Room2Model } from '../../components/3D models/Room2Model.jsx';
import { Room7Model } from '../../components/3D models/Room7Model.jsx';


import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei"

const Signup = () => {
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState(null)

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault(); 
        // Handle signup logic here
        if (!name) { 
            setError("Please enter your name");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter your email");
            return;
        }
        if (!password) {
            setError("Please enter your password");
            return; 
        }
        setError("");

        //Login API call
        try { 
            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email: email, 
                password: password,
            })
            //handle successful 
            if (response.data && response.data.error) { 
                setError(response.data.message);
                return;
            }
            if (response.data && response.data.accessToken) { 
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (error) { 
            //handle uncessfull 
            if (error.response && error.response.data && error.response.data.message) { 
                setError(error.response.data.message);
            } else { 
                setError("beep boop error time")
            }
        }
    }

    
        const ROOM_MODELS = { 
            1: {
                    "model": Room1Model, 
                    "position": [0, -0.8, 0], 
                    "rotation": [0, -1.5, 0], 
                    "scale": [0.23, 0.23, 0.23]
                  },
            2: { 
                    "model": Room2Model, 
                    "position": [0, -0.9, 0], 
                    "rotation": [0, -3, 0], 
                    "scale": [0.026, 0.026, 0.026]
                  },
            6: { 
                    "model": Room6Model, 
                    "position": [0, -0.8, 0], 
                    "rotation": [0, -3.2, 0], 
                    "scale": [0.0015, 0.0015, 0.0015]
                  },
            7: { 
              "model": Room7Model, 
              "position": [0, -0.8, 0], 
              "rotation": [0, -3.2, 0], 
              "scale": [0.055, 0.055, 0.055]
            },
            }
        
        const UserRoom = ({ roomId }) => { 
                const roomRef = useRef(); 
                const room = ROOM_MODELS[roomId];
                const RoomModel = room.model || ROOM_MODELS[1].model; //fallback to default if not specified
                {console.log(room.position, roomId)}
                return ( 
                <group ref = {roomRef} position = {room.position} rotation = {room.rotation}> 
                    <RoomModel scale={room.scale}/>
                </group>
                )
            }

    return (
        <>
        <Navbarv2 />

        <div className="flex flex-col md:flex-row h-[calc(100vh-83px)] bg-yellow-50">
              {/* Left Side - About Section (50% width) */}
        
              <div className="w-5/8 flex items-center justify-center">
    <div className="w-full h-full grid grid-cols-2">
      <Canvas camera={{ fov: 10, position: [-10, 2, 10]}}>
        <ambientLight intensity={1} />
        <OrbitControls
          enableZoom={true}
          minAzimuthAngle={-Math.PI/4}
          maxAzimuthAngle={Math.PI/4}
          minPolarAngle={Math.PI/6}
          maxPolarAngle={Math.PI/2}
        />
        
        {/* Create a 2x2 grid layout */}
        
            <group key={1}>
              <UserRoom roomId={1} />
            </group>

        
        <Environment preset="apartment" />
        
      </Canvas>

      <Canvas camera={{ fov: 10, position: [-10, 2, 10]}}>
        <ambientLight intensity={0} />
        <OrbitControls
          enableZoom={true}
          minAzimuthAngle={-Math.PI/4}
          maxAzimuthAngle={Math.PI/4}
          minPolarAngle={Math.PI/6}
          maxPolarAngle={Math.PI/2}
        />
        

            <group key={2}>
              <UserRoom roomId={2} />
            </group>

        
        <Environment preset="apartment" />
        
      </Canvas>

      <Canvas camera={{ fov: 10, position: [-10, 2, 10]}}>
        <ambientLight intensity={0} />
        <OrbitControls
          enableZoom={true}
          minAzimuthAngle={-Math.PI/4}
          maxAzimuthAngle={Math.PI/4}
          minPolarAngle={Math.PI/6}
          maxPolarAngle={Math.PI/2}
        />
      
            <group key={6}>
              <UserRoom roomId={Number(6)} />
            </group>

        
        <Environment preset="apartment" />
        
      </Canvas>

      <Canvas camera={{ fov: 10, position:[-10, 2, 10]}}>
        <ambientLight intensity={0} />
        <OrbitControls
          enableZoom={true}
          minAzimuthAngle={-Math.PI/4}
          maxAzimuthAngle={Math.PI/4}
          minPolarAngle={Math.PI/6}
          maxPolarAngle={Math.PI/2}
        />
        
        {/* Create a 2x2 grid layout */}
      
            <group key={7}>
              <UserRoom roomId={Number(7)} />
            </group>

        
        <Environment preset="apartment" />
        
      </Canvas>
    </div>
  </div>

      {/* Right Side - Signup Form */}
    <div className="w-3/8 flex items-center justify-center p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-8 w-full max-w-md">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-bold mb-6 text-gray-800">Create Account</h4>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <PasswordInput 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Create Account
            </button>

            <p className="text-sm text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-red-500 hover:text-red-600 underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </>
);

        
} 

export default Signup


// <div className = "backgrocund-green flex items-center justify-center h-screen bg-gray-100" 
//             > 
//             <div className = "bg-white p-8 rounded shadow-md w-96"> 
//                 <form onSubmit = {handleSignUp}> 
//                     <h4 className = "text-2xl mb-7"> SignUp </h4>

                    
//                     <input 
//                         type = "text" 
//                         placeholder = "Name" 
//                         className = "input-box" 
//                         value = {name} 
//                         onChange = {(e) => setName(e.target.value)}
//                     />

//                     <input 
//                         type = "text" 
//                         placeholder = "Email" 
//                         className = "input-box" 
//                         value = {email} 
//                         onChange = {(e) => setEmail(e.target.value)}
//                     />

//                     <PasswordInput value = {password} 
//                     onChange={(e) => setPassword(e.target.value)}
//                     />
//                     {error && <p className = "text-red text-sm mb-3"> {error} </p>}

//                     <button type = "submit" className = "btn-primary"> Create Account </button>

//                     <p className = "text-sm text-center mt-4"> 
//                         Already have an account? {" "} 
//                         <Link to = "/login" className = "font-medium text-red underline"> 
//                             Login </Link> 
//                     </p>

//                 </form>
//             </div> 
//         </div>  

//         </>
//     )