import React, { useState, useEffect } from "react";
import AuthContext from "../AuthContext";
import axios from "axios";
import { useContext } from "react";
import NavBar from "./navbar";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const [profile, setProfile] = useState(null);
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

      <main class="m-4 text-left">
        {/* <!-- Personal Info  --> */}
        <div class="md:grid md:grid-cols-3">
          {/* <!-- Info Section --> */}
          <div class="md:col-span-1">
            <div class="px-4">
              <p class="text-lg font-medium">Personal Information</p>
              <p class="mt-2 text-sm">Update your personal information.</p>
            </div>
          </div>

          {/* <!-- Form Div --> */}
          <div class="mt-4 md:col-span-2 md:mt-0">
            <form action="#" method="POST">
              <div class="grid grid-cols-6 gap-6 px-4">
                {/* <!-- Inputs --> */}
                <div class="col-span-6 sm:col-span-3">
                  <label for="fname" class="block text-sm font-medium">
                    First name
                  </label>
                  <input
                    type="text"
                    name="fname"
                    id="fname"
                    class="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 sm:text-sm"
                  />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="lname" class="block text-sm font-medium">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lname"
                    id="lname"
                    class="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 sm:text-sm"
                  />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="email" class="block text-sm font-medium">
                    Email address
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    class="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 sm:text-sm"
                  />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="phone" class="block text-sm font-medium">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    class="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 sm:text-sm"
                  />
                </div>
              </div>

              {/* <!-- Submit --> */}
              <div class="p-4 text-right">
                <button
                  type="submit"
                  class="inline-flex justify-center rounded-md bg-[#f1996f] py-2 px-4 text-sm font-medium text-white hover:bg-[#f7af8d]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
