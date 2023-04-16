import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/signup';
import Login from './components/signin';
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
          {/* <Route path="/notifications" element={<Notifications />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
