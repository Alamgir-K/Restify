import React from "react";
import { Link } from "react-router-dom";

// Need to convert a tags into Link tags

const NavBar = () => {
  return (
    <header className="bg-[#fbf8f0]">
      <div class="container mx-auto p-4">
        <nav class="flex justify-between items-center">
          <div>
            <a href="index.html">
              <p class="text-xl md:text-2xl font-semibold">Restify</p>
            </a>
          </div>
          <div class="flex justify-between">
            <div class="mx-2 sm:mx-4">
              <a href="index.html">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/log-out-svgrepo-com.svg"
                />
              </a>
            </div>
            <div class="mx-2 sm:mx-4">
              <a href="search.html">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/search-svgrepo-com.svg"
                />
              </a>
            </div>
            <div class="mx-2 sm:mx-4">
              <a href="reservations.html">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/suitcase-2-svgrepo-com.svg"
                />
              </a>
            </div>
            <div class="mx-2 sm:mx-4">
              <a href="host_home.html">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/price-tag-svgrepo-com.svg"
                />
              </a>
            </div>
            <div class="mx-2 sm:mx-4">
              <a href="notifications.html">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/bell-svgrepo-com.svg"
                />
              </a>
            </div>
            <div class="mx-2 sm:mx-4">
              <a href="profile.html">
                <img
                  class="h-7 w-7 overflow-hidden rounded-full"
                  src="/images/user-svgrepo-com.svg"
                />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;