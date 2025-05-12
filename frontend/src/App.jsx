import { useState } from 'react'
import './App.css'
import React from 'react'

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {RecoilRoot} from "recoil"
import { ToastContainer } from 'react-toastify'

import Home from '../components/Home'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'
import ForgotPassword from '../components/ForgotPassword'

function App() {

  return (
    <>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/signin' element={<SignIn/>} />
            <Route path='/signup' element={<SignUp/>} />
            <Route path='/forgotPassword' element={<ForgotPassword/>} />
          </Routes>
        </Router>

        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
    </>
  )
}

export default App
