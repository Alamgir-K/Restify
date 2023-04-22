import React, { useState, useEffect } from "react";
import AuthContext from "../AuthContext";
import axios from "axios";
import { useContext } from "react";
import NavBar from "./navbar";
import { Link } from "react-router-dom";

import Login from "./signin";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
  const { token } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hostInfo, setHostInfo] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const profileResponse = await axios.get(
          "http://localhost:8000/api/profile/",
          { headers }
        );

        setProfile(profileResponse.data);
        setImageUrl(profileResponse.data.avatar);

        const ratingsResponse = await axios.get(
          `http://localhost:8000/api/rating/${profileResponse.data.id}/view/?page=${currentPage}`,
          { headers }
        );

        setRatings(ratingsResponse.data.results);
        setCount(ratingsResponse.data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, [token, currentPage]);

  useEffect(() => {
    const fetchHostInfo = async () => {
      const newHostInfo = {};

      for (const rating of ratings) {
        if (!newHostInfo[rating.host]) {
          const response = await axios.get(
            `http://localhost:8000/api/profile/${rating.host}/`
          );

          newHostInfo[rating.host] = {
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            avatar: response.data.avatar,
          };
        }
      }

      setHostInfo(newHostInfo);
    };

    fetchHostInfo();
  }, [ratings]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!profile) {
    return <Login />;
  }

  return (
    <div>
      <NavBar />

      <main className="m-4">
        {/* <!-- Profile Section --> */}
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {/* <!-- Info Section --> */}
          <div className="md:col-span-1 border-2 border-gray-200 rounded-md">
            <div className="px-4 py-4">
              <div className="text-center">
                <span className="inline-block h-24 w-24 overflow-hidden rounded-full bg-[#fbf8f0] md:h-40 md:w-40">
                  <img src={imageUrl} />
                </span>
              </div>

              <span className="flex w-full items-center mt-2">
                <img
                  src="/images/star-svgrepo-com.svg"
                  className="h-8 w-8 overflow-hidden rounded-full mt-2 mr-2"
                />
                <p className="mt-2 text-lg font-medium">{`${ratings.length} Rating(s)`}</p>
              </span>
            </div>

            {/* <!-- Divider --> */}
            <div className="block my-4 border-t border-gray-200"></div>

            {/* <!-- Detail Confirmation --> */}
            <div className="px-4 pb-4 text-left">
              <p className="text-xl font-medium">{`${profile.user.first_name} has confirmed:`}</p>

              <span className="flex w-full items-center mt-2">
                <img
                  src="/images/check-svgrepo-com.svg"
                  className="h-8 w-8 overflow-hidden rounded-full mt-2 mr-2"
                />
                <p className="mt-2 text-lg">Identity</p>
              </span>

              <span className="flex w-full items-center mt-2">
                <img
                  src="/images/check-svgrepo-com.svg"
                  className="h-8 w-8 overflow-hidden rounded-full mt-2 mr-2"
                />
                <p className="mt-2 text-lg">Email address</p>
              </span>

              <span className="flex w-full items-center mt-2">
                <img
                  src="/images/check-svgrepo-com.svg"
                  className="h-8 w-8 overflow-hidden rounded-full mt-2 mr-2"
                />
                <p className="mt-2 text-lg">Phone number</p>
              </span>
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:col-span-2 text-left">
            <div className="space-y-4 px-4">
              {/* <!-- Name Tag Div --> */}
              <div>
                <p className="text-3xl font-medium">{`Hi, I'm ${profile.user.first_name}`}</p>
                <Link
                  to="/profile/edit"
                  className="mt-2 text-sm font-medium underline"
                >
                  Edit Profile
                </Link>
              </div>

              {/* <!-- Rating Div --> */}
              {ratings.length == 0 && (
                <div>
                  <p className="mt-2 text-lg">
                    {profile.user.first_name} has not received any rating yet.
                  </p>
                </div>
              )}

              {ratings.length > 0 && (
                <div>
                  <p className="text-lg">
                    {`Rating: ${
                      ratings.reduce((acc, rating) => acc + rating.rating, 0) /
                      ratings.length
                    } / 5`}
                  </p>

                  <p className="mt-2 text-lg">
                    Some review(s) {profile.user.first_name} has received:
                  </p>
                </div>
              )}

              {ratings.map((rating, index) => (
                <div key={index}>
                  <p className="mt-2 text-sm text-gray-600">
                    {formatDate(rating.created_at)}
                  </p>
                  <p className="text-lg mt-2 font-light">{rating.comment}</p>
                  <div className="flex items-center">
                    <span className="mt-2 inline-block h-16 w-16 overflow-hidden rounded-full bg-[#fbf8f0]">
                      {hostInfo[rating.host] && (
                        <img
                          src={
                            hostInfo[rating.host].avatar
                              ? hostInfo[rating.host].avatar
                              : "./images/user-svgrepo-com.svg"
                          }
                          alt="User avatar"
                        />
                      )}
                    </span>
                    {hostInfo[rating.host] && (
                      <p className="inline-block px-2 mt-2 text-sm font-medium">
                        {hostInfo[rating.host].first_name}{" "}
                        {hostInfo[rating.host].last_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {ratings.length > 0 && (
                <div className="flex mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="mr-4 px-4 py-2 border-2 border-gray-200 rounded-md hover:bg-gray-200"
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-md hover:bg-gray-200"
                    disabled={currentPage * 4 >= count}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
