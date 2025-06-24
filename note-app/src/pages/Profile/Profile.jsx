import React from 'react'
import Navbarv3 from '../../components/Navbarv3';
import axiosInstance from "../../utils/axiosInstance";
import { useState, useEffect } from 'react';
import { getInitials } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaTasks, FaBook, FaChartLine } from "react-icons/fa";
import avatarSample from "../../assets/images/avatar-sample.jpg"

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null); 
  const [allNotes, setAllNotes] = useState([]);
  const [stats, setStats] = useState({
    tasks: 0,
    journals: 0,
    studySessions: 0
  });

  const navigate = useNavigate();

  useEffect(() => { 
    getUserInfo(); 
    getAllNotes();
    // Add other data fetching here
    return () => {};
  }, [])

  // ... existing getUserInfo and getAllNotes functions ..
      

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

  //can calc number of notes created
  const getAllNotes = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data && response.data.notes) { 
                setAllNotes(response.data.notes);
            }
        } catch (error) { 
            console.log("beep boop error time")
        }
    }

  const onEditAvatar = async () => {
    navigate("/profile/avatar");
  }

  const onEditProfile = async () => {
    navigate("/profile/editprofile");
  }

  return (
    <>
      <Navbarv3 userInfo={userInfo}/>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Left Side - Profile Info (30% width) */}
        <div className="w-full md:w-[30%] bg-yellow-400 p-8 flex flex-col items-center">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
              <img 
                src={avatarSample} 
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={onEditAvatar}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Edit
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 w-full shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {userInfo?.fullName || 'User'}
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{userInfo?.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-gray-800">
                  {new Date(userInfo?.createdOn).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button 
              onClick={onEditProfile}
              className="mt-6 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-between transition-colors"
            >
              <span>Edit Profile</span>
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Right Side - Stats (70% width) */}
        <div className="w-full md:w-[70%] bg-gray-50 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Statistics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Task Stats Card */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <FaTasks className="text-blue-500 text-xl"/>
                </div>
                <h3 className="text-xl font-semibold">Tasks</h3>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-2">{allNotes.length}</p>
              <p className="text-gray-500">Pending tasks</p>
            </div>

            {/* Journal Stats Card */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <FaBook className="text-green-500 text-xl"/>
                </div>
                <h3 className="text-xl font-semibold">Journals</h3>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-2">0</p>
              <p className="text-gray-500">Entries this month</p>
            </div>

            {/* Study Stats Card */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full mr-4">
                  <FaChartLine className="text-purple-500 text-xl"/>
                </div>
                <h3 className="text-xl font-semibold">Study</h3>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-2">0</p>
              <p className="text-gray-500">Hours this week</p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <p>Created task "Complete project" - 2 days ago</p>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <p>Added journal entry - 3 days ago</p>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <p>Completed 2 hour study session - 4 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile