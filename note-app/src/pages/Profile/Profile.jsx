import React from 'react'
import Navbarv3 from '../../components/Navbarv3';
import axiosInstance from "../../utils/axiosInstance";
import { useState, useEffect } from 'react';
import { getInitials } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaTasks, FaBook, FaChartLine, FaUserFriends } from "react-icons/fa";
import avatarSample from "../../assets/images/avatar-sample.jpg"
import { TbMoodAngryFilled } from "react-icons/tb";
import { FaBed } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import Friends from "../Friends/Friends"
import Modal from "react-modal";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null); 
  const [allNotesLength, setAllNotesLength] = useState(null);
  const [allStudyTime, setAllStudyTime] = useState(null); 
  const [allJournalLength, setAllJournalLength] = useState(null); 
  const [allFriendsLength, setAllFriendsLength] = useState(null);
  const [allMoodsLength, setAllMoodsLength] = useState(null); 
  const [allSleepLength, setAllSleepLength] = useState(null); 

  const [openAddFriends, setOpenAddFriends] = React.useState({
      isShown: false, 
      type: "add",
      data: null,
  });
  
  const navigate = useNavigate();

  useEffect(() => { 
    getUserInfo(); 
    getAllNotes();
    getAllJournal(); 
    getAllStudyTime();
    getAllFriends(); 
    getAllMood();
    getAllSleep(); 
    
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

  //can calc number of notes created
  const getAllNotes = async () => { 
      try { 
          const response = await axiosInstance.get("/get-all-notes");
          if (response.data && response.data.notes) { 
              setAllNotesLength(response.data.notes.length);
          }
      } catch (error) { 
          console.log("beep boop error time")
      }
  }

  const getAllJournal = async () => { 
      try { 
          const response = await axiosInstance.get("/get-all-journal");
          if (response.data && response.data.journals) { 
              setAllJournalLength(response.data.journals.length);
          }
      } catch (error) { 
          console.log("beep boop error time")
      }
  }

  const getAllStudyTime = async () => { 
    try { 
      const response = await axiosInstance.get("/get-all-study-time"); 
      if (response.data && response.data.total) { 
        console.log(response.data.total);
        setAllStudyTime(response.data.total); 
      }
    } catch (error) { 
      console.log("Beep boop error time"); 
    }
  }

  const onEditAvatar = async () => {
    navigate("/profile/avatar");
  }

  const onEditProfile = async () => {
    navigate("/profile/editprofile");
  }

  const getAllFriends = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-friends");
            if (response.data && response.data.friends) { 
                setAllFriendsLength(response.data.friends.length);
            }
        } catch (error) { 
            if (error.response.status == 401) { 
                localStorage.clear(); 
                navigate("/login");
            }
        }
    }

  const getAllMood = async () => { 
      try { 
          const response = await axiosInstance.get("/get-all-mood");
          if (response.data && response.data.moods) { 
              setAllMoodsLength(response.data.moods.length);
          }
      } catch (error) { 
          console.log("beep boop error time")
      }
  }

  const getAllSleep = async () => { 
    try { 
      const response = await axiosInstance.get("/get-all-sleep");
      if (response.data && response.data.sleeps) { 
        setAllSleepLength(response.data.sleeps.length);
      }
    } catch (error) { 
      console.log("beep boop error time"); 
    }
  }


  return (
    <>
      <Navbarv3 userInfo={userInfo}/>

      <div className="flex flex-col md:flex-row">
        {/* Left Side - Profile Info (30% width) */}
        <div className="w-full md:w-[30%] bg-gray-200 h-full p-8 flex flex-col items-center">
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

            {/* <button 
              onClick={onEditProfile}
              className="mt-6 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-between transition-colors"
            >
              <span>Edit Profile</span>
              <FaArrowRight />
            </button> */}
          </div>
        </div>

        {/* Right Side - Stats (70% width) */}
        <div className="w-full md:w-[70%] bg-gray-50 p-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Task Stats Card */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <FaTasks className="text-blue-500 text-xl"/>
                </div>
                <h3 className="text-xl font-semibold">Tasks</h3>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-2">{allNotesLength}</p>
              <p className="text-gray-500">Ever created</p>
            </div>

            {/* Journal Stats Card */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <FaBook className="text-green-500 text-xl"/>
                </div>
                <h3 className="text-xl font-semibold">Journals</h3>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-2">{allJournalLength}</p>
              <p className="text-gray-500">Entries so far</p>
            </div>

            {/* Study Stats Card */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full mr-4">
                  <FaChartLine className="text-purple-500 text-xl"/>
                </div>
                <h3 className="text-xl font-semibold">Study</h3>
              </div>
              <p className="text-4xl font-bold text-gray-800 mb-2">{allStudyTime}</p>
              <p className="text-gray-500">Hours since birth</p>
            </div>
          

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-violet-100 rounded-full mr-4">
                <TbMoodAngryFilled className="text-violet-500 text-xl"/>
              </div>
              <h3 className="text-xl font-semibold">Moods</h3>
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-2">{allMoodsLength}</p>
            <p className="text-gray-500">Felt by you</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <FaUserFriends className="text-yellow-500 text-xl"/>
              </div>
            
              <h3 className="text-xl font-semibold">Friends</h3>
            </div>
            <div className="flex flex-row items-center justify-between">
              <p className="text-4xl font-bold text-gray-800 mb-2">{allFriendsLength}</p>
              <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl transition-all "
                  onClick={() => {
                  setOpenAddFriends({
                      isShown: true,
                      type: "add",
                      data: null,
                  })
                  }}
                  aria-label="Add new note"
              >
                  <MdAdd className="text-3xl" />
              </button>
            </div> 
            <p className="text-gray-500">Buddies made</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-pink-100 rounded-full mr-4">
                <FaBed className="text-pink-500 text-xl"/>
              </div>
              <h3 className="text-xl font-semibold">Sleep</h3>
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-2">{allSleepLength}</p>
            <p className="text-gray-500">Sleeps logged</p>
          </div>
        
        </div> 

          {/* Recent Activity Section
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
          </div> */}



          <Modal 
          isOpen={openAddFriends.isShown}
          onRequestClose={() => setOpenAddFriends({ isShown: false, type: "add", data: null })}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            content: {
              width: "90%",
              maxWidth: "1000px",
              maxHeight: "100vh",
              borderRadius: "0.5rem",
              padding: "0",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              inset: "auto"
            }
          }}
          contentLabel="Friends Management"
          ariaHideApp={false}  
        >

        
            <Friends 
                
            />

        </Modal>

        </div>
      </div>
    </>
  )
}

export default Profile