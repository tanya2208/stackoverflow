import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'
import NewQuestion from './pages/NewQuestion/NewQuestion';
import Question from './pages/Question/Question';
import Header from "./components/Header/Header";

function App() {
  return (
    <div>
    <BrowserRouter>
		  <Header/>
      <Routes>
        <Route path="/login" exact element={<Login/>}></Route>
        <Route path="/register" exact element={<Register/>}></Route>
        <Route path="/" exact element={<Home/>}></Route>
        <Route path="/users/:userId" exact element={<Profile/>}></Route>
        <Route path="/questions/:questionId" exact element={<Question/>}></Route>
        <Route path="/question" exact element={<NewQuestion/>}></Route>
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
