import { React, useState, useEffect } from 'react'
import Navbarv3 from '../../components/Navbarv3'
import axiosInstance from '../../utils/axiosInstance';


const About = () => {
  const [userInfo, setUserInfo] = useState(null); 

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

  useEffect(() => {
    const init = async () => {
      await getUserInfo();
    };
    init();
  }, []); // Keep empty if no external deps

  return (
		<div> 
    <Navbarv3 userInfo={userInfo} />
    <div className="text-center p-4">
      <h1> Hey there {userInfo.fullName}! </h1> 
      <h1> This is the about page </h1>
      <h1> As you can see, this is a work in progress </h1>
      <h1> Come back in two weeks to see the changes </h1> 
    </div>
		</div> 
  )
}

export default About
