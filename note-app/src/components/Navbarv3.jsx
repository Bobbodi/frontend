import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileInfo from "./cards/ProfileInfo";

const Navbar = ({userInfo}) => {
    
    const navigate = useNavigate();
    const location = useLocation(); 

    const onLogout = () => {
        localStorage.clear()
        navigate("/login");
    }

    const onProfile = () => { 
        navigate("/profile");
    }

    const onTasks = () => { 
        navigate("/dashboard");
    }

    const onWellness = () => { 
        navigate("/wellness");
    }

    const onFriends = () => { 
        navigate("/friends");
    }
    
    const onStudy = () => { 
        navigate("/study");
    }

    return ( 
    <div className="w-full bg-yellow-400 flex flex-col md:flex-row items-center justify-between px-4 py-3 shadow-md sticky top-0 z-50">
        {/* Logo - always visible */}
        <div className="flex-shrink-0 mb-3 md:mb-0">
        <h2 className="text-2xl font-medium text-black">SlayFocus</h2>
        </div>
            <div className="flex-shrink-0 mr-5"> 
                <ProfileInfo 
                    userInfo = {userInfo} 
                    onLogout={onLogout} 
                    onProfile={onProfile}
                    onFriends={onFriends}
                    onWellness={onWellness}
                    onStudy={onStudy}
                    onTasks={onTasks}
                    isFriends={location.pathname === "/friends"}
                    isWellness={location.pathname === "/wellness"}
                    isStudy={location.pathname === "/study"}
                    isTasks={location.pathname === "/dashboard"}
                    />
            </div>

            
        </div>


    );
}
export default Navbar;


//<Tab userInfo = {userInfo} onNote={onNote}/>