import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/signup';
import Login from './components/signin';
import HostHome from './components/HostHome';
import HostNewProperty from './components/HostNewProperty';
import HostProperty from './components/HostProperty';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/host-home" element={<HostHome />} />
          <Route path="/host-new-property" element={<HostNewProperty />} />
          <Route path="/host-property/:id" element={<HostProperty />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
