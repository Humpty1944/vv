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
import Popup from "react-popup";
import ReactLoading from "react-loading";
const MainPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userID, setUserID] = useState("");
  const [conferenceID, setConferenceID] = useState("");
  const [pageLook, setPageLook] = useState();
  const [isRender, setRender] = useState(false);
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
  const handleCallbackNewConference = () => {
    setPage("Предстоящие конференции");
    // setConferenceID(childData);
  };
  const handleRerender = (childData) => {
    setRender(true);
    // setConferenceID(childData);
  };
  useEffect(() => {
    const api = "https://api.ezmeets.live/v1/Users/CurrentUser";
    let token = sessionStorage.getItem("token");

    axios
      .get(api, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUserName(res.data.fullName);
        localStorage.setItem("idUser", res.data.id);
        let api_user = "https://api.ezmeets.live/v1/Users/CurrentUserRole";
        axios
          .get(api_user, { headers: { Authorization: `Bearer ${token}` } })
          .then((resNew) => {
            setUserRole(resNew.data);
            setIsLoading(false);
          });
      })
      .catch(function (error) {});
  }, [isRender]);
  const [url, setURL] = useState("");

  useEffect(() => {
    sessionStorage.setItem("url", url);
  }, [url]);
  useEffect(() => {
    const api = "https://api.ezmeets.live/v1/Users/CurrentUser";
    let token = sessionStorage.getItem("token");

    axios
      .get(api, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUserName(res.data.fullName);
        setURL(res.data.avatarPath);
        console.log(res.data.id);
        localStorage.setItem("idUser", res.data.id);
        let api_user = "https://api.ezmeets.live/v1/Users/CurrentUserRole";
        axios
          .get(api_user, { headers: { Authorization: `Bearer ${token}` } })
          .then((resNew) => {
            setUserRole(resNew.data);
            sessionStorage.setItem("roleUser", resNew.data);
            setIsLoading(false);
          });
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          sessionStorage.setItem("token", "");
          localStorage.setItem("date", "");
          navigate("/login");
          return;
        } else {
          // Popup.alert(
          //   "Пожалуйста, подождите несколько минут и повторите запрос"
          // );
          // return;
        }
      });
  }, []);
  const choosePage = () => {
    if (userRole === "User" && page === "") {
      return <Settings parentCallback={handleRerender} />;
    }
    if (userRole === "" && page === "") {
      return <Settings parentCallback={handleRerender} />;
    }
    if (page === "UserData") {
      return (
        <CreateNewParticipant
          userID={userID}
          pageName={"Update"}
          parentCallback={handleNewParticipantBack}
        />
      );
    }
    if (page === "FutureReport") {
      return (
        <NewConference
          conferenceID={conferenceID}
          pageName={"Update"}
          parentCallback={handleCallbackNewConference}
        ></NewConference>
      );
    }
    if (page === "Создать конференцию") {
      return (
        <NewConference
          conferenceID={0}
          pageName={"Create"}
          parentCallback={handleCallbackNewConference}
        ></NewConference>
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
      return (
        <CreateNewParticipant
          userID={0}
          pageName={"Create"}
          parentCallback={handleNewParticipantBack}
        />
      );
    }
    if (page === "Список участников") {
      return <LookParticipants parentCallback={handleCallbackUserData} />;
    }
    if (page === "Настройки пользователя") {
      return <Settings parentCallback={handleRerender} />;
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
  const [isLoading, setIsLoading] = useState(true);
  return isLoading ? (
    <div style={{ position: "relative", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          bottom: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <ReactLoading type={"spin"} color="#000" />
      </div>
    </div>
  ) : (
    <div className="mainPage">
      <SideBar
        parentCallback={handleCallback}
        userName={userName}
        userRole={userRole}
      ></SideBar>
      <div id="pageWork">{choosePage()}</div>
    </div>
  );
};
export default MainPage;
