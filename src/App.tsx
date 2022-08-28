import React from 'react'
import './main.css'
import { Piano } from './Pages/Piano'
import { Home } from './Pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Equalizer } from './Pages/Equalizer/Equalizer'

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          {' '}
        </Route>
        <Route path="/piano" element={<Piano />}>
          {' '}
        </Route>
        <Route path="/equalizer" element={<Equalizer />}>
          {' '}
        </Route>
      </Routes>
    </Router>
  )
}
