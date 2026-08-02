// import { useState,useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
// import { Routes,Route } from 'react-router-dom'
// import Home from './pages/Home'
// import Auth from './pages/Auth'
// import axios from "axios"; 
// import {useDispatch} from 'react-redux'
// import { setUserData } from './redux/userSlice'
// import InterviewPage from './pages/InterviewPage'

// export const ServerUrl='http://localhost:8000'
// function App() {
//   const dispatch=useDispatch()
//   const [count, setCount] = useState(0)
//  useEffect(() => {

//     const getUser = async () => {
//       try {
//         const result = await axios.get(
//           ServerUrl + "/api/user/currentuser",
//           { withCredentials: true }
//         )
//        dispatch(setUserData(result.data));
//       } catch (error) {
//         console.log(error)
//         dispatch(setUserData(null))
//       }
//     }

//     getUser()

//   }, [])
//   return (
//     <>
//     <Routes>
//       <Route path='/' element={<Home/>}></Route>
//        <Route path='/auth' element={<Auth/>}></Route>
//        <Route path='/interview' element={<InterviewPage/>}></Route>
//     </Routes>
//     </>
//   )
// }

// export default App
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import axios from "axios"; 
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'

export const ServerUrl = 'https://interview-system-backend-2ark.onrender.com'

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/user/currentuser",
          { withCredentials: true }
        )
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/auth' element={<Auth/>} />
      <Route path='/interview' element={<InterviewPage/>} />
    </Routes>
  )
}

export default App