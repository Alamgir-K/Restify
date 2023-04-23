import React from "react";
import { Link } from "react-router-dom";
import Notifications from "./notifications";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";

// Need to convert a tags into Link tags

const NavBar = () => {
  const [hidden, setHidden] = useState(true);
  const { clearAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleHidden = () => {
    setHidden(!hidden);
  };

  const handleLogout = () => {
    clearAccessToken();
    navigate("/login");
  };

  return (
    <header className="bg-[#fbf8f0]">
      <div class="container mx-auto p-4">
        <nav class="flex justify-between items-center">
          <div>
            <Link to="/" className="">
              <p class="text-xl md:text-2xl font-semibold">Restify</p>
            </Link>
            {/* <a href="index.html">
              <p class="text-xl md:text-2xl font-semibold">Restify</p>
            </a> */}
          </div>
          <div class="flex justify-between">
            <div class="mx-2 sm:mx-4">
              <a onClick={handleLogout}>
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/log-out-svgrepo-com.svg"
                />
              </a>
            </div>
            <div class="mx-2 sm:mx-4">
              <Link to="/search" className="">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/search-svgrepo-com.svg"
                />
              </Link>
            </div>
            <div class="mx-2 sm:mx-4">
              <Link to="/reservations" className="">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/suitcase-2-svgrepo-com.svg"
                />
              </Link>
            </div>
            <div class="mx-2 sm:mx-4">
              <a href="/host-home">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/price-tag-svgrepo-com.svg"
                />
              </a>
            </div>
            <div class="mx-2 sm:mx-4">
              <span onClick={toggleHidden}>
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/bell-svgrepo-com.svg"
                />
              </span>
              <Notifications hidden={hidden} />
            </div>
            <div class="mx-2 sm:mx-4">
              <Link to="/profile" className="">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/user-svgrepo-com.svg"
                />
              </Link>
              {/* <a href="profile.html">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/user-svgrepo-com.svg"
                />
              </a> */}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
