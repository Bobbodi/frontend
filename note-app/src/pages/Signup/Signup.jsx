import React from "react";
import Navbarv2 from "../../components/Navbarv2";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

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

    return (
        <>
        <Navbarv2 />

        <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side - About Section (50% width) */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6 text-yellow">Welcome to SlayFocus</h1>
          <p className="text-xl mb-6">
            A fun website to make studying fun
          </p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="mr-2">✓</span> Study planning
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> Study rooms
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> Wellness tools
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Signup Form */}
    <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
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