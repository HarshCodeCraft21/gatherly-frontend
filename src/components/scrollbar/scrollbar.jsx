import './scrollbar.css';
import React, { useEffect, useState } from 'react';
import { USER_LIST } from '../../api/api.js';
import axios from 'axios';

export const ScrollBar = ({ id, event }) => {
  const [userData, setUserData] = useState({ userInfo: 0, eventCapacity: 1 });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get(`${USER_LIST}/${id}`, {
          withCredentials: true,
        });
        setUserData({
          userInfo: res.data.total,
          eventCapacity: event.capacity,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserId();
  }, [id, event.capacity]);

  // Calculate percentage
  const percentage = Math.min(
    (userData.userInfo / userData.eventCapacity) * 100,
    100
  );

  return (
    <div className="scrollbar-container">
      <div className="scrollbar-track">
        <div
          className="scrollbar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="scrollbar-text">
        {userData.userInfo}/{userData.eventCapacity} joined
      </div>
    </div>
  );
};
