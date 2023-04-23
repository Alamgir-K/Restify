import React, { useState } from "react";
import axios from "axios";
import AuthContext from "../AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { setAccessToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        user: {
          email: email,
          username: username,
          first_name: fname,
          last_name: lname,
          password: password1,
          password2: password2,
        },
        phone_number: phone,
        is_host: false,
      });

      setAccessToken(response.data.access);
      setError("");
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error during sign up:", error.response.data);

      if (Object.keys(error.response.data)[0] != "user") {
        setError(error.response.data[Object.keys(error.response.data)[0]]);
      } else {
        setError("Invalid password");
      }
    }
  };

  return (
    <div className="bg-[#fbf8f0] min-h-screen">
      <div className="bg-[#fbf8f0]">
        <div className="container mx-auto p-4">
          <nav className="flex justify-center items-center">
            <div>
              <a href="navbar.html">
                <p className="text  -xl md:text-3xl font-bold">Restify</p>
              </a>
            </div>
          </nav>
        </div>
      </div>

      <main className="">
        <div className="flex min-h-full items-center justify-center py-12 sm:px-6 lg:px-8 px-4">
          <div className="w-full max-w-md space-y-8">
            <div>
              <p className="mt-6 text-center text-3xl font-semibold">
                Create your account
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
              <div className="-space-y-px">
                <div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 placeholder-gray-500 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    name="username"
                    type="text"
                    required
                    className="relative block w-full border border-gray-300 px-3 py-2 placeholder-gray-500 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    name="fname"
                    type="text"
                    required
                    className="relative block w-full border border-gray-300 px-3 py-2 placeholder-gray-500 sm:text-sm"
                    placeholder="First name"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    name="lname"
                    type="text"
                    required
                    className="relative block w-full border border-gray-300 px-3 py-2 placeholder-gray-500 sm:text-sm"
                    placeholder="Last name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="relative block w-full border border-gray-300 px-3 py-2 placeholder-gray-500 sm:text-sm"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    name="password1"
                    type="password"
                    required
                    className="relative block w-full border border-gray-300 px-3 py-2 placeholder-gray-500 sm:text-sm"
                    placeholder="Password"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    name="password2"
                    type="password"
                    required
                    className="relative block w-full border border-gray-300 px-3 py-2 placeholder-gray-500 sm:text-sm"
                    placeholder="Repeat password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              <div className="flex items-center">
                <p className="font-light text-gray-500">
                  By signing up, I agree to the Restify Terms and Conditions and
                  Privacy Statement.
                </p>
              </div>

              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-[#f1996f] py-2 px-4 text-sm font-medium text-white hover:bg-[#f7af8d]"
              >
                Sign up
              </button>
            </form>

            <div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account?
                <Link
                  to="/login"
                  className="font-medium text-[#f1996f] hover:text-[#f7af8d] m-1"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
