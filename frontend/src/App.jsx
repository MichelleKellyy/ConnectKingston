import { useState } from 'react'
import './App.css'

import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Feed from './pages/Feed.jsx';
import Dashboard from './pages/Dashboard.jsx';

import { auth } from "./firebase/firebase";

function App() {
  const LoggedIn = localStorage.getItem("loggedIn") === "true";

  return (
    <>
      <Routes>
        <Route path="/" element={LoggedIn ? <Navigate to="/feed" replace /> : <Home />} />
        
        <Route path="/signup" element={LoggedIn ? <Navigate to="/feed" replace /> : <SignUp />} />
        <Route path="/signin" element={LoggedIn ? <Navigate to="/feed" replace /> : <SignIn />} />

        <Route path="/feed" element={LoggedIn ? <Feed /> : <Navigate to="/" replace /> } />
        <Route path="/dashboard" element={LoggedIn ? <Dashboard /> : <Navigate to="/" replace /> } />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
