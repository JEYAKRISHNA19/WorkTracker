import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Admin from './components/Admin';
import User from './components/User'
import Home from './components/Home';
import LoginRegister from './components/LoginRegister'
import CreateOption from './components/CreateOption'
import UpdateOption from './components/UpdateOptions'
import { BrowserRouter, Routes, Route  } from 'react-router-dom';



function App() {
  return (
    
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LoginRegister/>}/>
      <Route path='/admin-dashboard' element={<Admin/>}/>
      <Route path='/user-dashboard' element={<User/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/admin-dashboard/create' element={<CreateOption/>}/>
      <Route path='/admin-dashboard/update/:sno' element={<UpdateOption/>}/>

    </Routes>
    </BrowserRouter>
    
    
  );
}

export default App;