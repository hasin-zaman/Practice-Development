import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Auth from './pages/Auth';
import Home from './pages/Home';
import AddGift from './pages/AddGift';
import UpdateGift from './pages/UpdateGift';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gifts/add" element={<AddGift />} />
        <Route path="/gifts/:id/edit" element={<UpdateGift />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
