import React, { useState } from "react";
import axios from "axios";
import AuthContext from "../AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setAccessToken } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username: username,
        password: password,
      });

      // Save the tokens and handle navigation to another page or component.
      setAccessToken(response.data.access);
      setError("");
      navigate("/");
      console.log(response.data);
    } catch (error) {
      console.error("Error during sign in:", error.response.data);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="bg-[#fbf8f0] min-h-screen">
      <header className="bg-[#fbf8f0]">
        <div className="container mx-auto p-4">
          <nav className="flex justify-center items-center">
            <div>
              <a href="navbar.html">
                <p className="text-xl md:text-3xl font-bold">Restify</p>
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main className="">
        <div className="flex min-h-full items-center justify-center py-12 sm:px-6 lg:px-8 px-4">
          <div className="w-full max-w-md space-y-8">
            <div>
              <p className="mt-6 text-center text-3xl font-semibold">
                Sign in to your account
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="-space-y-px ">
                <div>
                  <input
                    name="username"
                    type="text"
                    required
                    className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 placeholder-gray-500 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="relative block w-full border border-gray-300 px-3 py-2 placeholder-gray-500 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              <div className="flex items-center">
                <p className="font-light text-gray-500">
                  By signing in, I agree to the Restify Terms and Conditions and
                  Privacy Statement.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md bg-[#f1996f] py-2 px-4 text-sm font-medium text-white hover:bg-[#f7af8d]"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Don't have an account?
                <Link
                  to="/signup"
                  className="font-medium text-[#f1996f] hover:text-[#f7af8d] m-1"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
