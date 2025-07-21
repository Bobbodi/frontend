import React from "react";

const Navbar = () => {
    
    return ( 
        <div className="bg-yellow-400 backdrop-blur-sm flex items-center justify-between px-6 py-2 drop-shadow w-screen">
  {/* Left side - Logo */}
  <h2 className="text-2xl font-medium text-black py-2">SlayFocus</h2>
  
  {/* Center elements with dots */}
  <div className="flex items-center gap-4">
    <span className="text-medium font-medium text-yellow-800">Task planning</span>
    <span className="text-yellow-800">•</span>
    <span className="text-medium font-medium text-yellow-800">Study buddies</span>
    <span className="text-yellow-800">•</span>
    <span className="text-medium font-medium text-yellow-800">Wellness</span>
  </div>
  
  {/* Right side - Tagline */}
  <h2 className="text-lg font-medium text-black-800 py-2">
    A fun website to make studying fun
  </h2>
</div>
    );
}
export default Navbar;