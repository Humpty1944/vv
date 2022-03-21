import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserInfo from "../../components/userInfoSideBar/UserInfo";
import "./SideBar.css";
import { Label } from "@material-ui/icons";
const SideBar = (props) => {
  const [page, setPage] = useState("");
  const changePage = (e) => {
    setPage(e.target.textContent);
    props.parentCallback(e.target.textContent);
    e.preventDefault();
  };
  const checkOptions = () => {
    if (props.userRole === "SuperAdmin") {
      return (
        <SubMenu title="Участники">
          <MenuItem onClick={(e) => changePage(e)}>
            Добавить нового участника
          </MenuItem>
          <MenuItem onClick={(e) => changePage(e)}>Список участников</MenuItem>
        </SubMenu>
      );
    }
    if (props.userRole === "Admin") {
      return (
        <SubMenu title="Участники">
          <MenuItem onClick={(e) => changePage(e)}>Список участников</MenuItem>
        </SubMenu>
      );
    }
    return;
  };
  const checkOptionsConference = () => {
    if (props.userRole !== "User") {
      return (
        <SubMenu title="Конференции">
          <MenuItem onClick={(e) => changePage(e)}>
            Создать конференцию
          </MenuItem>
          <MenuItem onClick={(e) => changePage(e)}>
            Предстоящие конференции
          </MenuItem>
          <MenuItem onClick={(e) => changePage(e)}>
            Прошедшие конференции
          </MenuItem>
        </SubMenu>
      );
    }
    return;
  };
  return (
    <div className="mainPageBar">
      <ProSidebar>
        <Menu iconShape="square">
          <SidebarContent>
            <UserInfo username={props.userName} role={props.userRole} />
            <div style={{ borderBottom: "1px solid gray" }}>
              <p className="roleText">{props.userRole}</p>
            </div>
          </SidebarContent>
          {checkOptionsConference()}
          {checkOptions()}
          <MenuItem onClick={(e) => changePage(e)}>
            Настройки пользователя
          </MenuItem>
          <MenuItem onClick={(e) => changePage(e)}>Выйти из аккаунта</MenuItem>
        </Menu>
      </ProSidebar>
    </div>
  );
};
export default SideBar;
