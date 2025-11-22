import './App.css';
import { Navbar } from './Components/Navbar';
import { About } from './Pages/About';
import { Home } from './Pages/Home';
import { Routes, Route, useLocation } from "react-router-dom";

function App() {  
  return (

    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
      </Routes>
      {/* <Home /> */}
    </div>
  );
}

export default App;
