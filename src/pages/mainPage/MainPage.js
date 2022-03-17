import { setISODay } from "date-fns";
import React, { useEffect, useState } from "react";
import SideBar from "../../components/sideBar/SideBar";
import ReportPage from "../reportPage/ReportPage";
import NewConference from "./createNewConference/NewConference";
import FutureConference from "./futureConference/FutureConference";
import "./MainPage.css";
import CreateNewParticipant from "./participant/createParticipant/CreateNewParticipant";
import LookParticipants from "./participant/lookOnParticipant/LookParticipants";
import PastConference from "./pastConference/PastConference";
import Settings from "./settings/Settings";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { CatchingPokemonSharp } from "@mui/icons-material";
const MainPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userID, setUserID] = useState("");
  const [conferenceID, setConferenceID] = useState("");
  const [pageLook, setPageLook] = useState();
  const [isUser, setIsUser] = useState(false);
  const [isConference, setIsConference] = useState(false);
  let a = 1;
  const handleCallback = (childData) => {
    setPage(childData);
  };
  const logOut = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("date", "");
    navigate("/login");
  };
  const handleCallbackUserData = (childData) => {
    setPage("UserData");
    setUserID(childData);
  };
  const handleCallbackFutureConference = (childData) => {
    setPage("FutureReport");
    setConferenceID(childData);
  };
  const handleNewParticipantBack = (childData) => {
    setPage("Список участников");
   // setConferenceID(childData);
  };
  const handleCallbackNewConference = (childData) => {
    setPage("Предстоящие конференции");
   // setConferenceID(childData);
  };
  
  useEffect(() => {
    const api = "https://api.ezmeets.live/v1/Users/CurrentUser";
    let token = localStorage.getItem("token");
    try {
      axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          
          console.log(res.data.id);
          setUserName(res.data.fullName);
          localStorage.setItem("idUser", res.data.id);
          // setUserRole("Admin");
          let api_user = "https://api.ezmeets.live/v1/Users/CurrentUserRole";
          axios
            .get(api_user, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
              console.log(res.data.id);
              
              setUserRole(res.data);
              //setUserRole(res.data);
            });
        })
        .catch(function (error) {
          if (error.response.status == 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("date", "");
            navigate("/login");
          }
        });
    } catch (e) {
      console.log("resdsdsads");
    }
  }, []);
  const choosePage = () => {
    // if (userID !== "") {
    //   setUserID("");
    //   return <CreateNewParticipant userID={userID} />;
    // }
    console.log(page)
    if (userRole === "User" && page === "") {
      return <Settings />;
    }
    if (page === "UserData") {
      return <CreateNewParticipant userID={userID} pageName={"Update"} />;
    }
    if (page === "FutureReport") {
      return (
        <NewConference
          conferenceID={conferenceID}
          pageName={"Update"}
        ></NewConference>
      );
    }
    if (page === "Создать конференцию") {
      return (
        <NewConference conferenceID={0} pageName={"Create"} parentCallback={handleCallbackNewConference}></NewConference>
      );
    }
    if (page === "Предстоящие конференции" || page === "") {
      return (
        <FutureConference parentCallback={handleCallbackFutureConference} />
      );
    }
    if (page === "Прошедшие конференции") {
      return <PastConference />;
    }
    if (page === "Добавить нового участника") {
      return <CreateNewParticipant userID={0} pageName={"Create"} parentCallback={handleNewParticipantBack}/>;
    }
    if (page === "Список участников") {
      return <LookParticipants parentCallback={handleCallbackUserData} />;
    }
    if (page === "Настройки пользователя") {
      return <Settings />;
    }
    if (page === "Выйти из аккаунта") {
      logOut();
      return;
    }
  };

  const handelPageLook = () => {
    setPageLook(choosePage());
    return pageLook;
  };
  return (
    <div className="mainPage">
      <SideBar
        // className="sideBarMainPage"
        parentCallback={handleCallback}
        userName={userName}
        userRole={userRole}
      ></SideBar>
      <div id="pageWork">
        {/* <NewConference></NewConference> */}
        {choosePage()}
      </div>
    </div>
  );
};
export default MainPage;
