import React from "react";
import Navbarv2 from "../../components/Navbarv2";
import PasswordInput from "../../components/Input/PasswordInput";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";


const Login = () => {

    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState(null)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault(); 

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Please enter your password");
            return;
        }

        setError("");

        //Login API call
        try { 
            const response = await axiosInstance.post("/login", {
                email: email, 
                password: password,
            })
            //handle successful 
            if (response.data && response.data.accessToken) { 
                localStorage.setItem("token", response.data.accessToken)
                navigate("/dashboard")
            }
        } catch (error) { 
            //handle uncessfull 
            if (error.response && error.response.data && error.response.data.message) { 
                setError(error.response.data.message);
            } else { 
                setError("beep boop error time")
            }
        }





    };

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

      {/* Right Side - Login Form (50% width) */}
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-bold mb-6 text-gray-800">Login</h4>
            <h4 className="text-xl mb-6 text-gray-800">Email: bob@gmail.com, Pwd: bob</h4>
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
              Login
            </button>

            <p className="text-sm text-center mt-6 text-gray-600">
              New here?{" "}
              <Link
                to="/signup"
                className="font-medium text-red-500 hover:text-red-600 underline"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </>
);
} 

export default Login