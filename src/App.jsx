
import './App.css'
import Login from './components/login/Login'
import Dashboard from './components/Dashboard/Dashboard'
import CandidateList from './components/candidateList/CandidateList'
import Header from './components/header/Header'
import ProtectedRoute from './components/ProtectedRoute'
import {  Routes, Route } from 'react-router-dom'
import ElectionResults from './components/electionResults/ElectionResults'

function App() {

  return (
    <>
    <Header/>
      <Routes>
        <Route path='/' element={    <Login/>}></Route>
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }></Route>
        <Route path='/result' element={
          <ProtectedRoute>
            <ElectionResults/>
          </ProtectedRoute>
        }>

        </Route>
        <Route path='/candidatelist/:id' element={<CandidateList/>}></Route>
      </Routes>
    
    </>
  )
}

export default App
