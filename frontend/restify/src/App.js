import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/signup';
import Login from './components/signin';
import HostHome from './components/HostHome';
import HostNewProperty from './components/HostNewProperty';
import HostProperty from './components/HostProperty';
import HostEditProperty from './components/HostEditProperty'
import UserProfile from './components/profile';
import EditProfile from './components/profile_edit';
import Notifications from './components/notifications';
import HomePage from './components/HomePage';
import SearchResult from './components/SearchResult';
import Reservations from './components/Reservations';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/host-home" element={<HostHome />} />
          <Route path="/host-new-property" element={<HostNewProperty />} />
          <Route path="/host-property/:id" element={<HostProperty />} />
          <Route path="/host-edit-property/:id" element={<HostEditProperty />} />
          {/* <Route path="/notifications" element={<Notifications />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
