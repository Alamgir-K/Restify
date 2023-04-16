import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/style.css';
// import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
// import { fetchHostProperties, fetchHostInbox } from "../api";
import NavBar from './navbar';
import AuthContext from '../AuthContext';
import { useContext } from 'react';

const HostHome = () => {
  const [profile, setProfile] = useState(null);
  const { token } = useContext(AuthContext);
  const [hostProperties, setHostProperties] = useState([]);
  const [hostInbox, setHostInbox] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inboxCurrentPage, setInboxCurrentPage] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {

    const fetchUserProfile = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const profileResponse = await axios.get(
          "http://localhost:8000/api/profile/",
          { headers }
        );

        setProfile(profileResponse.data);
        console.log(profile.id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
    // console.log(profile.id);
    getHostProperties();
    getHostInbox();

  }, [token]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getHostProperties();
  };

  const getHostProperties = async () => {
    // const response = await fetchHostProperties(hostId);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:8000/api/property/search/`, {
        headers,
        params: {
          host: 1,
          page: currentPage,
        },
      });
      setHostProperties(response.data.results);
    } catch (err) {
      console.error("Error during get property", err.data);
    }
  };

  const getHostInbox = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:8000/api/reservation/host/all/`, {
        headers,
        params: {
          page: inboxCurrentPage,
        },
      });
      setHostInbox(response.data.results);
      console.log(response.data);
    } catch (err) {
      console.error("Error during get inbox", err.data);
    }
  };

  // useEffect(() => {
  //   const getHostProperties = async () => {
  //     // const response = await fetchHostProperties(hostId);
  //     try {
  //       const response = await axios.post("http://localhost:8000/api/property/search", {
  //         username: username,
  //         password: password,
  //       });

  //       // Save the tokens and handle navigation to another page or component.
  //       setAccessToken(response.data.access);
  //       console.log(response.data);
  //     } catch (err) {
  //       console.error("Error during sign in:", error.response.data);
  //       setError("Invalid credentials");
  //     }
  //     setHostProperties(response.data);
  //   };

  //   const getHostInbox = async () => {
  //     const response = await fetchHostInbox(hostId);
  //     setHostInbox(response.data);
  //   };

  //   getHostProperties();
  //   getHostInbox();
  // }, [hostId]);

  return (
    <>
      <div className="bg-beige h-screen">

        <NavBar />

        <div className="flex flex-col h-screen">
          <div className="flex container mx-auto p-3 mt-3">
            {hostProperties.map((property) => (
              // console.log("Image URL:", property.main_image),
              <div key={property.id} className="w-1/4 md:w-1/5 p-3">
                <div className="bg-white rounded shadow-lg border-2 border-transparent hover:border-red-300">
                  <img className="w-full h-48" src={property.main_image} alt={property.name} />
                  <div className="p-3">
                    <a href={`/host_property/${property.id}`}>
                      <p className="text-xl font-bold">{property.name}</p>
                    </a>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-1/5 md:w-1/5 h-45 bg-white rounded shadow-lg relative">
              <button className="absolute left-0 bottom-0 text-center text-green-500 hover:text-green-800 text-9xl plus">
                <a href="/host_new_property">+</a>
              </button>
            </div>
            <div class="flex justify-center mt-4">
              <button
                class="mx-1 px-3 py-1 rounded border"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                class="mx-1 px-3 py-1 rounded border"
                onClick={() => handlePageChange(currentPage + 1)}
              // disabled={currentPage * count > count}
              >
                Next
              </button>
            </div>
          </div>
          <div className="container mx-auto rounded-lg bg-white h-screen p-10 overflow-auto">
            <h2 className="text-2xl font-bold">Inbox</h2>
            {hostInbox.map((inboxItem) => (
              <div key={inboxItem.id}>
                {/* Render review inbox items */}
                {inboxItem.type === 'review' && (
                  <>
                    <div className="p-4 bg-gray-200 rounded-lg mt-4">
                      <p className="font-bold">{inboxItem.propertyName} - Review</p>
                      <p>Guest: {inboxItem.guestName}</p>
                      <div>
                        {Array(inboxItem.rating)
                          .fill()
                          .map((_, i) => (
                            <span key={i} className="big-star fa fa-star checked"></span>
                          ))}
                        {Array(5 - inboxItem.rating)
                          .fill()
                          .map((_, i) => (
                            <span key={i} className="big-star fa fa-star"></span>
                          ))}
                      </div>
                      <p>
                        {inboxItem.message}
                        <button className="button-normal text-white rounded-full py-2 px-4">Reply</button>
                      </p>
                    </div>
                    {inboxItem.hostReply && (
                      <div className="w-2/3 light-theme rounded p-4">
                        <p className="font-medium mb-2">Host: {inboxItem.hostReply}</p>
                      </div>
                    )}
                  </>
                )}
                {/* Render stay request inbox items */}
                {inboxItem.status === 'Pending' && (
                  <div className="p-4 bg-gray-300 rounded-lg mt-4">
                    <table className="w-full text-left table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-3">Property</th>
                          <th className="px-4 py-3">Stay Request</th>
                          <th className="px-4 py-3">Guests</th>
                          <th className="px-4 py-3">Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-3">{inboxItem.property}</td>
                          <td className="border px-4 py-3">{inboxItem.message}</td>
                          <td className="border px-4 py-3">{inboxItem.guest}</td>
                          <td className="border px-4 py-3">
                            {inboxItem.dates}{' '}
                            <button className="bg-blue-500 rounded-full py-2 px-3 text-white">Approve</button>{' '}
                            <button className="bg-red-500 rounded-full py-2 px-3 text-white">Deny</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HostHome;

