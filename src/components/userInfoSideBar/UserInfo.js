import React, { useState } from "react";
//import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import user_img from "../../assets/user.png";

import "./UserInfo.css";
const UserInfo = (props) => {
  let url = sessionStorage.getItem("url");
  let role = sessionStorage.getItem("roleUser");
  if (
    props.role === "SuperAdmin" ||
    url === null ||
    url === undefined ||
    url === "" ||
    url === "null"
  ) {
    url = user_img;
  }

  return (
    <div className="userInfo">
      <img id="userImg" src={url}></img>
      <p id="userName">{props.username}</p>
    </div>
  );
};
export default UserInfo;
