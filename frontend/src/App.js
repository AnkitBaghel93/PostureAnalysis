import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ResultPage from './components/ResultPage';
import Navbar from './pages/Navbar';
import  Home from './pages/Home';
import AnalyzePage from './pages/AnalyzePage';
import Signup from './pages/Signup';
import Signin from './pages/Signin';

function App() {
  return (
    <Router>
      <>
        <Navbar/>

        <Routes>
          
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/video-upload" element={<AnalyzePage />} />
          <Route path="/results" element={<ResultPage />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
