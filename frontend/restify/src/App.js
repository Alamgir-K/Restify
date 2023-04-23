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
import HomePage from './components/HomePage';
import SearchResult from './components/SearchResult';
import Reservations from './components/Reservations';
import PropertyView from './components/PropertyView';
import CommentCreate from './components/CommentCreate';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/comment/:reservationId/create" element={<CommentCreate />} />
          <Route path="/property/:id/view" element={<PropertyView />} />
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
          {/* <Route path="/notifications" element={<Notifications />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
