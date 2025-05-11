import { useState } from 'react'
import './App.css'
import React from 'react'
import { ExampleEditor } from '../components/ExampleEditor'

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Home from '../components/Home'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

function App() {

  return (
    <>
      {/* <div>
        <ExampleEditor/>
      </div> */}

      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/signup' element={<SignUp/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
