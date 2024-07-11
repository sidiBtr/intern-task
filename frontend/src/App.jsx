import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Navbar from './components/navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'


function App() {

  return (
    <>
    <Router>
        <Navbar/>
        <Routes>
          <Route path='/register' element={< Register/>}/>
          <Route path='/login' element={<Login/>} />
          <Route element={<PrivateRoute/>}>
              <Route path='/profile' element={<Profile/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
