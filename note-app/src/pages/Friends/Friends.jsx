import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import SearchBarv2 from '../../components/SearchBar/SearchBarv2';
import Navbarv3 from '../../components/Navbarv3'
import { getInitials } from '../../utils/helper'

//icons 
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";

//Toast message
import Toast from "../../components/ToastMessage/Toast";

const Friends = () => {
    const [userInfo, setUserInfo] = useState(null); 
    const [allFriends, setAllFriends] = useState([]);
    const [allPeople, setAllPeople] = useState([]);
    const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
    const [sentFriendRequests, setSentFriendRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const [hoveredNoteId, setHoveredNoteId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getUserInfo(); 
        getAllFriends(); 
        getAllFriendRequests();
        if (searchQuery.trim() === "") {
            setIsSearch(false);
            setAllPeople([]);
        } else {
            onSearchPeople(searchQuery);
        }
        // eslint-disable-next-line
    }, [searchQuery]);

    // // Add this inside your Navbar component
    // React.useEffect(() => {
    //     handleSearch();
    //     // eslint-disable-next-line
    // }, [searchQuery]);

    // useEffect(() => { 
    //     getUserInfo(); 
    //     getAllFriends();
    //     //getAllPeople(); // Load all users initially
    //     getAllFriendRequests(); // Load all users initially
    //     handleSearch();
    //     return () => {};
    // }, [searchQuery])

    //For toast message
    const [showToastMsg, setShowToastMsg] = useState({ 
            isShown: false, 
            type: "add",
            message: ""
        })
        
    // Search for users
    const onSearchPeople = async (query) => { 
        if (!query || query.trim() === "") {
            setIsSearch(false);
            //getAllPeople();
            return;
        }
        try { 
            const response = await axiosInstance.get('/search-users', {
                params: { query },
            })

            if (response.data && response.data.users) { 
                setIsSearch(true); 
                setAllPeople(response.data.users);
            }
        } catch (error) { 
            console.log(error);
        }
    }

    const handleClearSearch = () => { 
        setIsSearch(false);
        //getAllPeople(); 
    }

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

    const getAllFriends = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-friends");
            if (response.data && response.data.friends) { 
                setAllFriends(response.data.friends);
            }
        } catch (error) { 
            if (error.response.status == 401) { 
                localStorage.clear(); 
                navigate("/login");
            }
        }
    }

    const getAllPeople = async () => { 
        try { 
            const response = await axiosInstance.get("/get-all-users");
            if (response.data && response.data.users) { 
                setAllPeople(response.data.users);
            }
        } catch (error) { 
            if (error.response.status == 401) { 
                localStorage.clear(); 
                navigate("/login");
            }
        }
    }

    const getAllFriendRequests = async () => { 
        try { 
            const response = await axiosInstance.get("/get-friend-requests");
            if (response.data && response.data.incomingFriendRequests && response.data.sentFriendRequests) { 
                setIncomingFriendRequests(response.data.incomingFriendRequests);
                setSentFriendRequests(response.data.sentFriendRequests);
            }
        } catch (error) { 
            if (error.response.status == 401) { 
                localStorage.clear(); 
                navigate("/login");
            }
        }
    }

    //handle accept friend requests 
    const acceptFriendRequest = async (nodeData) => { 
        const friendshipId = nodeData.friendshipId;
        try { 
            
            const response = await axiosInstance.put("/accept-friend-request/" + friendshipId)

            if (response.data && response.data.friendship) { 
                console.log("here3")
                showToastMessage("New friend added successfully")
                getAllFriends();
            } 
        } catch (error) { 
            if (error.response && error.response.data && error.response.data.message) { 
                setError(error.response.data.message)
            }
        }
    }

    //handle delete friend requests 
    const deleteFriendRequest = async (nodeData) => { 
        
        const friendshipId = nodeData.friendshipId;
        
        try { 
            
            const response = await axiosInstance.put("/delete-friend-request/" + friendshipId)

            if (response.data && response.data.friendship) { 
                showToastMessage("Deleted friend request successfully")
                getAllFriends();
            } 
        } catch (error) { 
            if (error.response && error.response.data && error.response.data.message) { 
                setError(error.response.data.message)
            }
        }
    }

    //send friend request 
    const sendFriendRequest = async (person1, person2) => { 
        try {

            const response = await axiosInstance.post("/send-friend-request", { 
                person1,
                person2,
            });

            if (response.data && response.data.friendship) { 
                showToastMessage("Friend request sent successfully");
                // Refresh search results or update UI
                onSearchPeople(searchQuery); 
            }
        } catch (error) { 
            if (error.response && error.response.data && error.response.data.message) { 
                setError(error.response.data.message)
            } 
        }
    };
    // const sendFriendRequest = async ({ person1, person2 }) => { 
    //     try { 
    //         console.log("here2")
    //         const response = await axiosInstance.put("/send-friend-request/", { 
    //             person1: person1,
    //             person2: person2,
    //         })

    //         if (response.data && response.data.friendship) { 
    //             console.log("here3")
    //             showToastMessage("Friend request sent successfully")
    //             //getAllNotes()
    //         } 
    //     } catch (error) { 
    //         if (error.response && error.response.data && error.response.data.message) { 
    //             setError(error.response.data.message)
    //         }
    //     }
    // }

    const onKeyDown = (e) => { 
        
        if (e.key === 'Enter') {
            handleSearch(); // Additional Enter key handler if needed
        }
        
    }
    
    const handleSearch = () => {
        if (searchQuery.trim() === "") {
            onClearSearch();
        } else {
            onSearchPeople(searchQuery);
        }
    }

    const onClearSearch = () => {
        setSearchQuery("");
        handleClearSearch(); 
    }

    const renderUser = (user) => { 
        return (
        <>
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-medium bg-yellow-700 hover:bg-dark hover:text-white">
            {getInitials(user?.fullName)}
        </div>
        <div className="text-sm my-2">
            {user?.fullName}
        </div>
        </>
        )
    }

    const renderFriendsList = (users) => (
    <div className="mt-5 flex flex-row gap-3 justify-center items-center overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {users.map(user => (
        <button className="flex flex-col justify-center items-center" key={user._id}>
            {renderUser(user)}
        </button>
        ))}
    </div>
    );

    ////need to add separate one where there are arleady firneds
    // Function to render user list

    const renderSearchResults = (users) => {
    return (
        <div className="bg-yellow-100 border rounded-lg shadow-md z-10 mt-1 w-full max-w-md">
            {users.map(user => (
                <div key={user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0">
                    {renderUser(user)}
                    <button 
                        className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                        onClick={() => sendFriendRequest(userInfo._id, user._id)}
                    >
                        Add Friend
                    </button>
                </div>
            ))}
        </div>
        );
    };
    // const renderSearchResults = (users) => {
    //     return (
    //         <div className="bg-yellow border rounded-lg shadow-lg z-10 mt-1 w-60">
    //             {users.map(user => (

    //                 <div className="flex items-center rounded-lg justify-between p-3 hover:bg-gray-100">
    //                     {user.fullName}
                        
    //                     <button className="px-4 py-1 border rounded-full hover:bg-red" onClick={sendFriendRequest(userInfo._id, user._id)}>
    //                         Add Friend
    //                     </button>
                        

    //                 </div>
    //             ))}
    //         </div>
    //     );
    // }

    //People that wanna be friends with you
    const renderIncomingPendingList = (users) => {
        return (
            <div className="mt-5 flex flex-row gap-3 justify-center items-center overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {users.map(user => (
                    <button className = "flex flex-col justify-center items-center">
                        {renderUser(user)}
                        <div className="flex flex-row gap-1"> 
                            <button className = "text-center border border-2 rounded-full p-1 hover:text-green" onClick={() => acceptFriendRequest(user)}> 
                                <AiOutlineCheck/>
                            </button>
                            <button className = "text-center border border-2 rounded-full p-1 hover:text-red" onClick={() => deleteFriendRequest(user)}> 
                                <RxCross2/>
                            </button>
                        </div> 
                    </button>
                ))}
            </div>
        );
    }


    //Friend Requests that you sent
    const renderSentPendingList = (users) => {
        return (
            <div className="mt-5 flex flex-row gap-3 justify-center items-center overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {users.map(user => (
                    <button className = "flex flex-col justify-center items-center">
                        {renderUser(user)}
                        <div className="flex flex-row gap-1"> 
                            <button className = "text-center border border-2 rounded-full p-1 hover:text-red" onClick={() => deleteFriendRequest(user)}> 
                                <RxCross2/>
                            </button>
                        </div> 
                    </button>
                ))}
            </div>
        );
    }

    const handleCloseToast = () => { 
        setShowToastMsg({
            isShown: false, 
            message: "",
        })
    };

    const showToastMessage = (message, type) => { 
        setShowToastMsg({
            isShown: true, 
            message,
            type
        })
    };

        return (
        <div className="">
            
            
            <div className="container mx-auto p-8">
                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex flex-col lg:w-1/2 gap-3"> 
                        {/* Friend Requests Section */}
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold mb-2">Friend Requests</h2>
                            <p className="text-sm mb-4 text-gray-500">
                                {incomingFriendRequests.length > 0 
                                    ? "New study buddies waiting for you!" 
                                    : "No pending requests"}
                            </p>
                            
                            {incomingFriendRequests.length > 0 ? (
                                renderIncomingPendingList(incomingFriendRequests)
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className=" bg-white rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold mb-2">Sent</h2>
                            <p className="text-sm mb-4 text-gray-500">
                                {sentFriendRequests.length > 0 
                                    ? "Waiting for your friends to accept!" 
                                    : "No pending requests"}
                            </p>
                            
                            {sentFriendRequests.length > 0 ? (
                                renderSentPendingList(sentFriendRequests)
                            ) : (
                                <></>
                            )}
                        </div>
                    </div> 
                    
                    {/* Friends List Section */}
                    <div className="lg:w-1/2 bg-white rounded-xl p-6 shadow-lg flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 mb-2 ">Your Study Buddies</h2>
                        <p className="text-sm text-gray-500 mb-2 ">Once a buddy always a buddy </p>
                        <div className="w-full max-w-md">
                        <SearchBarv2 
                            value={searchQuery}
                            onChange={({target}) => setSearchQuery(target.value)}
                            onClearSearch={onClearSearch}
                            onKeyDown={onKeyDown}
                            text="Add buddies"
                        />
                        </div> 

                        <div> 
                        {isSearch ? (
                            <div className="mt-4">
                                {allPeople.length > 0 ? (
                                    renderSearchResults(allPeople)
                                ) : (
                                    <div className="bg-yellow rounded-lg p-4 text-center">
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        ) : (<></>)}
                        </div> 
               
                            

                        <div> 
                        {allFriends.length > 0 ? (
                            renderFriendsList(allFriends)
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">You don't have any friends yet</p>
                                {/* <button 
                                    className="mt-4 px-4 py-2 bg-blue text-white rounded-full hover:bg-darkgreen transition-colors"
                                    onClick={() => document.querySelector('input[type="search"]').focus()}
                                >
                                    Find Friends
                                </button> */}
                            </div>
                        )}

                        
                        </div> 
                    </div> 
                </div> 
            </div> 

            

            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </div>
    )
}

export default Friends
{/* 
<div className="lg:w-1/3 bg-white rounded-xl p-6 shadow-lg">
                <div className="w-full max-w-md">
                    <SearchBarv2 
                        value={searchQuery}
                        onChange={({target}) => setSearchQuery(target.value)}
                        onClearSearch={onClearSearch}
                        onKeyDown={onKeyDown}
                        text="Find Friends"
                    />
                </div>
                
                
                {isSearch ? (
                    <div className="mt-4">
                        {allPeople.length > 0 ? (
                            renderSearchResults(allPeople)
                        ) : (
                            <div className="bg-yellow rounded-lg p-4 text-center">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                ) : (<></>)}
                            
                        
                    </div>

                </div>
            </div> */}

//     return (
//     <>

//         <Navbarv3 userInfo={userInfo}  />

//         <div className="flex flex-row justify-center m-5 text-center bg-white rounded shadow-md">
            
//                 {friendRequests.length > 0 ? (
//                     <div className="w-[30%] ml-4 my-4 p-4 bg-dark text-white rounded"> 
//                         <h1 className="text-xl">New study buddy!</h1>
//                         {renderPendingList(friendRequests)}
//                     </div>
//                 ) : (
//                     <></>
//                 )}

            
            
//             <div className="w-[70%] m-4 p-4 bg-blue p-4 text-center text-white rounded"> 
//                 <h1 className="text-xl">Your Friends!</h1>
//                 <h6>You can never unfriend them :)</h6>
//                 {allFriends.length > 0 ? (
//                     renderFriendsList(allFriends)
//                 ) : (
//                     <p>You don't have any friends yet</p>
//                 )}
//             </div> 
            
//         </div>

//         <div className="m-5 flex flex-col justify-center items-center">
//             <SearchBarv2 
//                 value={searchQuery}
//                 onChange={({target}) => setSearchQuery(target.value)}
//                 //handleSearch={handleSearch}
//                 onClearSearch={onClearSearch}
//                 onKeyDown={onKeyDown}
//                 text="Find Friends"
//             />


                    
//             {isSearch ? 
//                 (<div className="">
//                     {allPeople.length > 0 ? (
//                         renderSearchResults(allPeople)
//                     ) : (
//                         <p className="bg-yellow rounded-xl shadow-lg z-10 mt-1 w-60 p-3">No results found!</p>
//                     )}
//                 </div>)
//             : (<></>)}
                
            
//             <Toast
//                 isShown = {showToastMsg.isShown}
//                 message = {showToastMsg.message}
//                 type = {showToastMsg.type}
//                 onClose = {handleCloseToast}
//             />
            
            

//         </div>
//     </>
    
//     )
// }

//export default Friends


//To show the user's avatar
{/* <div className="user-avatar">
    {user.avatar ? (
        <img src={user.avatar} alt={user.username} />
    ) : (
        <div className="avatar-placeholder">
            {user.fullName}
        </div>
    )}
</div> */}
//People you may know
{/* <div className="people-section">
    <h3>People You May Know</h3>
    {allPeople.length > 0 ? (
        renderUserList(allPeople)
    ) : (
        <p>No suggestions available</p>
    )}
</div> */}

// import React from 'react'
// import Navbarv3 from '../../components/Navbarv3'
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../utils/axiosInstance';
// import NoData from "../../assets/images/bear.png"
// import EmptyCard from "../../components/EmptyCard/EmptyCard";
// import SearchBar from '../../components/SearchBar/SearchBar';

// const Friends = () => {
//     const [userInfo, setUserInfo] = useState(null); 
//     const [allFriends, setAllFriends] = useState([]);
//     const [allPeople, setAllPeople] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [error, setError] = useState(null);

//     const [isSearch, setIsSearch] = useState(false);
//     const [hoveredNoteId, setHoveredNoteId] = useState(null);

//     const navigate = useNavigate();

//     useEffect(() => { 
//         getUserInfo(); 
//         getAllFriends();
//         getAllPeople(); 
//         return () => {};
//     }, [])
        
//     //SEARCH
//     //Search for a note 
//     const onSearchPeople = async (query) => { 
//         if (!query || query.trim() === "") {
//             setIsSearch(false);
//             getAllPeople();
//             return;
//         }
//         try { 
//             const response = await axiosInstance.get('/search-people', {
//                 params: { query },
//             })

//             if (response.data && response.data.friends) { 
//                 setIsSearch(true); 
//                 setAllPeople(response.data.friends);
//             }
//         } catch (error) { 
//             console.log(error);
//         }
//     }

//     const handleClearSearch = () => { 
//         setIsSearch(false);
//         getAllPeople(); 
//     }

//     const getUserInfo = async () => { 
//         try { 
//             const response = await axiosInstance.get("/get-user");
//             if (response.data && response.data.user) { 
//                 setUserInfo(response.data.user);
//             }
//         } catch (error) { 
//             if (error.response.status == 401) { 
//                 localStorage.clear(); 
//                 navigate("/login");
//             }
//         }
//     }

//     const getAllFriends = async () => { 
//         try { 
//             const response = await axiosInstance.get("/get-all-friends");
//             if (response.data && response.data.friends) { 
//                 setAllFriends(response.data.friends);
//             }
//         } catch (error) { 
//             if (error.response.status == 401) { 
//                 localStorage.clear(); 
//                 navigate("/login");
//             }
//         }
//     }

//     const getAllPeople = async () => { 
//         try { 
//             const response = await axiosInstance.get("/get-all-users");
//             if (response.data && response.data.users) { 
//                 setAllPeople(response.data.users);
//             }
//         } catch (error) { 
//             if (error.response.status == 401) { 
//                 localStorage.clear(); 
//                 navigate("/login");
//             }
//         }
//     }

    

//     const onKeyDown = (e) => { 
//         if (e.key === 'Enter') { 
//             handleSearch();
//         }
//     }
    

//     const handleSearch = () => {
//     if (searchQuery.trim() === "") {
//         onClearSearch(); // Show all notes when search is empty
//     } else {
//         onSearchPeople(searchQuery);
//     }
// }

//     const onClearSearch = () => {
//         setSearchQuery("");
//         handleClearSearch(); 
//     }

//     const renderUserList = (users) => {
//         return (
//             <div className="user-list">
//                 {users.map(user => (
//                     <div 
//                         key={user._id} 
//                         className="user-item"
//                         onMouseEnter={() => setHoveredNoteId(user._id)}
//                         onMouseLeave={() => setHoveredNoteId(null)}
//                     >
//                         <div className="user-avatar">
//                             {user.avatar ? (
//                                 <img src={user.avatar} alt={user.username} />
//                             ) : (
//                                 <div className="avatar-placeholder">
//                                     {user.username.charAt(0).toUpperCase()}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="user-details">
//                             <h4>{user.username}</h4>
//                             <p>{user.email}</p>
//                         </div>
//                         {hoveredNoteId === user._id && (
//                             <button className="add-friend-btn">
//                                 {allFriends.some(friend => friend._id === user._id) ? 
//                                     "Friends" : "Add Friend"}
//                             </button>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         );
//     }
   

//   return (
//     <>
//         <Navbarv3 userInfo={userInfo}  />
        
//         <div className="container mx-auto"> 
//                 {allFriends.length > 0  
//                     ? (<div className="grid grid-cols-1 gap-5 m-5">
//                         {allFriends.map((item) => (
//                             <p>{item.fullName}</p>
//                             ))} 
//                       </div>) 
//                     : (<EmptyCard 
//                         imgSrc = {NoData} 
//                         message = {"Click the '+' button at the bottom to keep track of your tasks and thoughts!"
//                         }/>)
//                 }
//         </div> 
        
//         <div className="container mx-5"> 
//             <p> Add friends to study together!</p>

//             <SearchBar value = {searchQuery}
//             onChange={({target }) => {
//                 setSearchQuery(target.value)}}
//             handleSearch={handleSearch}
//             onClearSearch={onClearSearch}
//             onKeyDown={onKeyDown}
//             text="Search People"/>

            
//             <div className="search-results">
//                 <h3>Search Results</h3>
//                 {allPeople.length > 0 ? (
//                     renderUserList(allPeople)
//                 ) : (
//                     <p>No users found</p>
//                 )}
//             </div>
                
              

//         </div> 

        
//     </>
//   )
// }

// export default Friends


