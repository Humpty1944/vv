import React, { useState } from "react";
//import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import user_img from "../../assets/user.png";

import "./UserInfo.css";
const UserInfo = (props) => {
  return (
    <div className="userInfo">
      <img id="userImg" src={user_img}></img>
      <p id="userName">{props.username}</p>
    </div>
  );
};
export default UserInfo;
