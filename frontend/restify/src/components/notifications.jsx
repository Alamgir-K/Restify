// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useContext } from "react";
// import AuthContext from "../AuthContext";

// const Notifications = ({ hidden }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [count, setCount] = useState(0);
//   const { token } = useContext(AuthContext);

//   const hiddenClass = hidden
//     ? "rounded-lg ring-1 ring-[#f1996f] bg-white shadow-lg absolute z-10 w-80 hidden transform p-2 translate-y-5 -translate-x-60 md:w-96"
//     : "rounded-lg ring-1 ring-[#f1996f] bg-white shadow-lg absolute z-10 w-80 transform p-2 translate-y-5 -translate-x-60 md:w-96";

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8000/api/notifications/?page=${currentPage}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log(response);
//         setCount(response.data.count);
//         setNotifications(response.data.results);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();
//   }, [token, currentPage]);

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   if (!notifications) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div class={hiddenClass} id="notification-menu">
//       <div class="relative grid gap-4 p-2 text-left">
//         {notifications.map((notification) => (
//           <a href="#" key={notification.id} class="flex items-start">
//             <div class="ml-4">
//               <p class="font-medium">{notification.username}</p>
//               <p class="text-sm">{notification.message}</p>
//             </div>
//           </a>
//         ))}
//       </div>
//       <div class="flex justify-center mt-4">
//         <button
//           class="mx-1 px-3 py-1 rounded border"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Prev
//         </button>
//         <button
//           class="mx-1 px-3 py-1 rounded border"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage * count > count}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Notifications;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../AuthContext";

const Notifications = ({ hidden }) => {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useContext(AuthContext);

  const hiddenClass = hidden
    ? "rounded-lg ring-1 ring-[#f1996f] bg-white shadow-lg absolute z-10 w-80 hidden transform p-2 translate-y-5 -translate-x-60 md:w-96"
    : "rounded-lg ring-1 ring-[#f1996f] bg-white shadow-lg absolute z-10 w-80 transform p-2 translate-y-5 -translate-x-60 md:w-96";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/notifications/?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setNotifications(response.data.results);
        setCount(response.data.count);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/notifications/${notificationId}/read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markNotificationCleared = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/notifications/${notificationId}/clear/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(
        notifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error clearing notification:", error);
    }
  };

  if (!notifications) {
    return <div>Loading...</div>;
  }

  return (
    <div class={hiddenClass} id="notification-menu">
      {/* <div class="relative grid gap-4 p-2 text-left">
        {notifications.map((notification) => (
          <div key={notification.id} class="flex items-center">
            <div class="flex-grow">
              <p class="font-medium">{notification.username}</p>
              <p class="text-sm">{notification.message}</p>
            </div>
            <div class="flex-shrink-0 flex items-center">
              {!notification.is_read && (
                <button
                  class="px-2 py-1 text-sm rounded border"
                  onClick={() => markNotificationRead(notification.id)}
                >
                  Read
                </button>
              )}
              <button
                class="ml-2 px-2 py1 text-sm rounded border"
                onClick={() => markNotificationCleared(notification.id)}
              >
                Clear
              </button>
            </div>
          </div>
        ))}
      </div> */}

      <div class="relative grid gap-4 p-2 text-left">
        {notifications.map((notification) => (
          <div key={notification.id} class="flex items-center">
            <div class="flex-grow">
              <p
                class={`font-medium ${
                  notification.is_read ? "text-gray-500" : "text-gray-900"
                }`}
              >
                {notification.username}
              </p>
              <p
                class={`text-sm ${
                  notification.is_read ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {notification.message}
              </p>
            </div>
            <div class="flex-shrink-0 flex items-center">
              {!notification.is_read && (
                <button
                  class="px-2 py-1 text-sm rounded border"
                  onClick={() => markNotificationRead(notification.id)}
                >
                  Read
                </button>
              )}
              <button
                class="ml-2 px-2 py1 text-sm rounded border"
                onClick={() => markNotificationCleared(notification.id)}
              >
                Clear
              </button>
            </div>
          </div>
        ))}
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
          disabled={currentPage * count >= count}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Notifications;
