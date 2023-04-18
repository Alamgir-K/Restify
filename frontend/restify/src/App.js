import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/signup';
import Login from './components/signin';
import HostHome from './components/HostHome';
import HostNewProperty from './components/HostNewProperty';
import HostProperty from './components/HostProperty';
import UserProfile from './components/profile';
import EditProfile from './components/profile_edit';
import Notifications from './components/notifications';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/host-home" element={<HostHome />} />
          <Route path="/host-new-property" element={<HostNewProperty />} />
          <Route path="/host-property/:id" element={<HostProperty />} />
          {/* <Route path="/notifications" element={<Notifications />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
