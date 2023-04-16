import React, { useState, useEffect } from "react";
import AuthContext from "../AuthContext";
import axios from "axios";
import { useContext } from "react";
import NavBar from "./navbar";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        console.log(headers);

        const profileResponse = await axios.get(
          "http://localhost:8000/api/profile/",
          { headers }
        );

        setProfile(profileResponse.data);
        console.log(profileResponse.data);

        const ratingsResponse = await axios.get(
          `http://localhost:8000/api/rating/${profileResponse.data.id}/view/`,
          { headers }
        );

        setRatings(ratingsResponse.data.results);
        console.log(ratingsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    // if (token) {
    fetchUserProfile();
    // }
    // fetchUserProfile();
  }, [token]);

  if (!profile) {
    return <div>Loading...</div>;
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
                  <img src={`${profile.user.avatar}`} />
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
            <div className="px-4 pb-4">
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
                {/* <a href="edit_profile.html">
                  <p className="mt-2 text-sm font-medium underline">
                    Edit Profile
                  </p>
                </a> */}
                <Link
                  to="/profile/edit"
                  className="mt-2 text-sm font-medium underline"
                >
                  Edit Profile
                </Link>
              </div>

              {/* <!-- Rating Div --> */}
              {/* <div className="">
              <span className="flex w-full items-center mt-2">
                <img
                  src="/images/star-svgrepo-com.svg"
                  className="h-8 w-8 overflow-hidden rounded-full mt-2 mr-2"
                />
                <p className="mt-2 text-lg font-medium">{`4.7 / 5.0`}</p>
              </span>
            </div> */}

              {/* <!-- Comment 1 --> */}
              {/* <div>
                <p className="mt-2 text-sm text-gray-600">January 2023</p>
                <p className="text-lg mt-2 font-light">
                  Alamgir was a fantastic guest! He left the place in great
                  condition and respected the house rules.
                </p>

                <div className="flex items-center">
                  <span className="mt-2 inline-block h-16 w-16 overflow-hidden rounded-full bg-[#fbf8f0]">
                    <img src="/images/user-svgrepo-com.svg" />
                  </span>
                  <p className="inline-block px-2 mt-2 text-sm font-medium">
                    John Doe
                  </p>
                </div>
              </div> */}

              {/* <!-- Comment 2 --> */}
              {/* <div>
                <p className="mt-2 text-sm text-gray-600">February 2023</p>
                <p className="text-lg mt-2 font-light">
                  Alamgir was a fantastic guest! He left the place in great
                  condition and respected the house rules.
                </p>

                <div className="flex items-center">
                  <span className="mt-2 inline-block h-16 w-16 overflow-hidden rounded-full bg-[#fbf8f0]">
                    <img src="/images/user-svgrepo-com.svg" />
                  </span>
                  <p className="inline-block px-2 mt-2 text-sm font-medium">
                    Ian Lavine
                  </p>
                </div>
              </div> */}
              {ratings.map((rating, index) => (
                <div key={index}>
                  <p className="mt-2 text-sm text-gray-600">
                    {rating.created_at}
                  </p>
                  <p className="text-lg mt-2 font-light">{rating.comment}</p>
                  <div className="flex items-center">
                    <span className="mt-2 inline-block h-16 w-16 overflow-hidden rounded-full bg-[#fbf8f0]">
                      <img
                        src="./images/user-svgrepo-com.svg"
                        alt="User avatar"
                      />
                    </span>
                    <p className="inline-block px-2 mt-2 text-sm font-medium">
                      {rating.host.first_name} {rating.host.last_name}
                    </p>
                  </div>
                </div>
              ))}

              {/* End */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
