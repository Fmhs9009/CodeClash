import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Mode from './components/Mode'
import PeerMode from './components/PeerMode'
import ContestMode from './components/ContestMode'
import ContestPage from './components/ContestPage'
import LoginPage from './components/LoginPage';
const App = () => {
  return (
    <div>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/mode" element={ <Mode/> }/>
            <Route path="/mode/contest-mode" element={ <ContestMode/> }/>
            <Route path="/mode/peer-mode" element={ <PeerMode/> }/>
            <Route path="/mode/contest-mode/contest-page/:id" element={<ContestPage/>}></Route>
          </Routes>
        </Router>
    </div>
  )
}

export default App