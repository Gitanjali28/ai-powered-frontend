import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BsRobot, BsCoin } from "react-icons/bs";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";
import axios from "axios"
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";
function Navbar() {
  const { userData } = useSelector((state) => state.user);
  console.log("USER DATA FROM REDUX:", userData);
  const[popup,setpopup]=useState(false)
   const[userpopup,setuserpopup]=useState(false)
   const[showauth,setauth]=useState(false)
   const navigate=useNavigate()
   const dispacth=useDispatch();

   const handlelogout= async ()=>{
    try{
      await axios.get(ServerUrl+"/api/auth/logout",{
        withCredentials:true
       
      })
       dispacth(setUserData(null))
       setpopup(false)
       setuserpopup(false)
       navigate("/")
    }
    catch(error){
console.log(error)
    }
   }


  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative"
      >
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot />
          </div>
          <h1 className="font-semibold hidden md:block text-lg">
            InterviewIQ.AI
          </h1>
        </div>

        <div className="flex items-center gap-6 relative">
          <div className="relative">
            <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition cursor-pointer" onClick={() => {
              if(!userData){
                setauth(true)
                return;
              }
  setpopup(!popup);
  setuserpopup(false);
}}
              
            >
              <BsCoin size={20} />
              {userData?.credits || 0}
            </button>
            {popup && (
              <div className="absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-5 z-50 cursor-pointer">
                <p className="text-sm text-gray-600 mb-4">
                  more credits to continue interviews?

                </p>
                <button className="w-full bg-black text-white rounded-full flex items-center justify-center font-semibold"onClick={() => navigate('/pricing')}>Buy more credits</button>
              </div>
            )}
          </div>

          <div className="relative">
       <button
  className="w-9 h-9 bg-black rounded-full flex items-center justify-center font-semibold text-white cursor-pointer"
  onClick={() => {
    if(!userData){
                setauth(true)
                return;
              }
    setuserpopup(!userpopup);
    setpopup(false);
  }}
>
  {userData
    ? userData?.name.slice(0, 1).toUpperCase()
    : <FaUserAstronaut size={16} />}
</button>
            {userpopup && (
              <div className="absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-5 z-50 cursor-pointer">
                <p className="text-md text-blue-500 font-medium mb-1" >
                {userData?.name}
                </p>
                <button className="w-full text-left text-sm py-2 hover:text-black text-gray-600" onClick={()=>navigate('/history')}>Interview History</button>
                <button className="w-full text-left text-sm py-2 flex items-center gap-2 text-red-600"onClick={handlelogout}> Log Out</button>
                </div>
            )}
          </div>

        </div>
      </motion.div>
      {showauth && <AuthModel onClose={()=>setauth(false)}/>}
    </div>
  );
}

export default Navbar;