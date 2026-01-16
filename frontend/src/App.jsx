import { useState } from 'react'

import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Feed from './pages/Feed.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Favourites from './pages/Favourites.jsx'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import GuestRoute from './components/GuestRoute.jsx';

function App() {
  const [user] = useAuthState(auth); // user.uid available here
  return (

    <>
      <Routes>
        <Route path="/" element={<GuestRoute> <Home /> </GuestRoute>} />

        <Route path="/signup" element={<GuestRoute> <SignUp /> </GuestRoute>} />
        <Route path="/signin" element={<GuestRoute> <SignIn /> </GuestRoute>} />

        <Route path="/feed" element={<ProtectedRoute> <Feed /> </ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute> {user ? <Favourites userId={user.uid} /> : <p>Loading user...</p>}</ProtectedRoute>} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
