import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TravelBot from "./components/TravelBot";
import "./index.css";
import UserForm from './components/UserForm';
import Home from './components/Home';
import Explore from './components/Explore';
import PlaceDetails from './pages/PlaceDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/travelbot" element={<TravelBot/>} />
        <Route path="/place/:placeName" element={<PlaceDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
