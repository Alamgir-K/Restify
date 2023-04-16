import React, { useState, useEffect } from "react";
import AuthContext from "../AuthContext";
import axios from "axios";
import { useContext } from "react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const { token } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        console.log(headers);

        const profileResponse = await axios.get(
          "http://localhost:8000/api/profile/",
          { headers }
        );

        // setProfile(profileResponse.data);
        setUsername(profileResponse.data.user.username);
        setEmail(profileResponse.data.user.email);
        setFname(profileResponse.data.user.first_name);
        setLname(profileResponse.data.user.last_name);
        setPhone(profileResponse.data.phone_number);
        setAvatar(profileResponse.data.avatar);
        setPassword1(profileResponse.data.user.password);
        setPassword2(profileResponse.data.user.password);
        // Print the phone number

        console.log(profileResponse.data.phone_number);

        setAvatar(profileResponse.data.avatar);

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

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:8000/api/profile/",
        {
          user: {
            username: username,
            email: email,
            first_name: fname,
            last_name: lname,
            password: password1,
            password2: password2,
          },
          phone_number: phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError("");
      console.log(response.data);
    } catch (error) {
      console.error("Error during sign up:", error.response.data);
    }
  };

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />

      <main className="m-4 text-left">
        {/* <!-- Personal Info  --> */}
        <div className="md:grid md:grid-cols-3">
          {/* <!-- Info Section --> */}
          <div className="md:col-span-1">
            <div className="px-4">
              <p className="text-lg font-medium">Personal Information</p>
              <p className="mt-2 text-sm">Update your personal information.</p>
            </div>
          </div>

          {/* <!-- Form Div --> */}
          <div className="mt-4 md:col-span-2 md:mt-0">
            <form onSubmit={handleSignUp}>
              <div className="grid grid-cols-6 gap-6 px-4">
                {/* <!-- Inputs --> */}
                <div className="col-span-6">
                  <p className="block text-sm font-medium">Photo</p>

                  <div className="mt-2 flex items-center">
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer rounded-md"
                    >
                      <span className="inline-block h-24 w-24 overflow-hidden rounded-full bg-[#fbf8f0]">
                        <img src={avatar} />
                      </span>
                      {/* <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        className="sr-only"
                        // value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                      /> */}
                      <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        className="sr-only"
                        ref={(input) => setAvatar(input)}
                      />
                    </label>
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label for="fname" className="block text-sm font-medium">
                    First name
                  </label>
                  <input
                    type="text"
                    name="fname"
                    id="fname"
                    className="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 sm:text-sm"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label for="lname" className="block text-sm font-medium">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lname"
                    id="lname"
                    className="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 sm:text-sm"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label for="email" className="block text-sm font-medium">
                    Email address
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label for="phone" className="block text-sm font-medium">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="mt-2 block w-full rounded-md border-2 border-gray-200 p-2 sm:text-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* <!-- Submit --> */}
              <div className="p-4 text-right">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md bg-[#f1996f] py-2 px-4 text-sm font-medium text-white hover:bg-[#f7af8d]"
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
