import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../AuthContext";

const Notifications = ({ hidden }) => {
  const [notifications, setNotifications] = useState([]);
  const { token } = useContext(AuthContext);

  const hiddenClass = hidden
    ? "rounded-lg ring-1 ring-[#f1996f] bg-white shadow-lg absolute z-10 w-80 hidden transform p-2 translate-y-5 -translate-x-60 md:w-96"
    : "rounded-lg ring-1 ring-[#f1996f] bg-white shadow-lg absolute z-10 w-80 transform p-2 translate-y-5 -translate-x-60 md:w-96";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/notifications/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setNotifications(response.data.results);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  if (!notifications) {
    return <div>Loading...</div>;
  }

  return (
    <div class={hiddenClass} id="notification-menu">
      <div class="relative grid gap-4 p-2 text-left">
        {notifications.map((notification) => (
          <a href="#" key={notification.id} class="flex items-start">
            <div class="ml-4">
              <p class="font-medium">{notification.username}</p>
              <p class="text-sm">{notification.message}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
