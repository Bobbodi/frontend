import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarv3 from '../../components/Navbarv3'
import axiosInstance from '../../utils/axiosInstance';


const EditProfile = () => {

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
    <div>
      <Navbarv3 userInfo={userInfo}/>
    </div>
  )
}

export default EditProfile
