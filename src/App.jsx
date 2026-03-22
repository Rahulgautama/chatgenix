import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatApp from './components/ChatApp'; // Import your new component
import Navbar from './components/Navbar';

import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ChatApp" element={<ChatApp />} /> 
      </Routes>
    </Router>
  );
}

export default App;