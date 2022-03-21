import React, { useEffect, useState } from "react";
import "./PastConeference.css";
import MaterialTable from "material-table";
import { NavLink, useNavigate } from "react-router-dom";
import { AddBox, ArrowDownward } from "@material-ui/icons";
import report_img from "./report.png";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import ReactLoading from "react-loading";
import Popup from "react-popup";

const PastConference = (props) => {
  let navigate = useNavigate();
  const showInfo = (rowData) => {
    // props.parentCallback(report_id);
    var ind = dataUsers.findIndex((object) => {
      return object.name === rowData[0];
    });

    sessionStorage.setItem("info", rowData);
    sessionStorage.setItem("infoID", data_index[ind]);
    navigate("/report");
  };
  const options = {
    filterType: "checkbox",
    pagination: true,
    rowsPerPage: 6,
    selectableRows: false,
    onRowClick: showInfo,
    downloadOptions: { filename: "pastConference.csv", separator: ";" },
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
  };

  const columns = [
    {
      name: "name",
      label: "Название",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Дата",
      name: "date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      label: "Участники",
      name: "participants",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "report",
      label: "Отчет",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];
  const data = [
    {
      name: "Joe James",
      date: "Test Corp",
      participants: "Yonkers",

      report: "Готов",
      id: 1,
    },
    {
      name: "John Walsh",
      date: "Test Corp",
      participants: "Hartford",

      report: "Готов",
      id: 2,
    },
    {
      name: "Bob Herm",
      date: "Test Corp",
      participants: "Tampa",

      report: "Готов",
      id: 3,
    },
    {
      name: "James Houston",
      date: "Test Corp",
      participants: "Dallas",

      report: "Не готов",
      id: 4,
    },
  ];
  const [size, setSize] = useState();

  const [isLoading, setIsLoading] = useState(true);

  const handleLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);
  const handleResize = (e) => {
    setSize(window.innerWidth);
  };
  useEffect(() => {
    setSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
  }, []);
  const [dataUsers, setData] = useState([]);
  const [data_index, setIndexes] = useState([]);
  // const data_index = [123, 435345, 657846746, 12312, 345643, 435643];
  useEffect(() => {
    const api = "https://api.ezmeets.live/v1/Meetings/GetAll";
    let token = sessionStorage.getItem("token");
    try {
      axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          let r = res.data.filter((w) => new Date(w.startTime) <= new Date());

          let d = [];
          let idd = [];

          for (let i = 0; i < r.length; i++) {
            console.log(r[i].started);
            d.push({
              name: r[i].name,
              date: new Date(r[i].startTime).toLocaleString(),
              participants: r[i].usersAtMeeting.length,
              report: "ДА",
            });
            idd.push(r[i].meetingID);
          }
          setData(d);
          setIndexes(idd);
          setIsLoading(false);
          // setFullname(res.data.fullName);
          // setEmail(res.data.email);
          // setUsername(res.data.userName);
        })
        .catch(function (error) {
          if (error.response.status == 403 || error.response.status == 401) {
            sessionStorage.setItem("token", "");
            localStorage.setItem("date", "");
            navigate("/login");
          } else {
            Popup.alert(
              "Пожалуйста, подождите несколько минут и повторите запрос"
            );
          }
        });
    } catch (e) {}
  }, []);
  return isLoading ? (
    <ReactLoading type={"spin"} color="#000" />
  ) : (
    <div
      style={{
        margin: "0 auto",
        marginTop: size < 970 ? "400px" : "60px",
        width: "calc(100vw / 2)",
        /* height: calc(100vh / 2); */
        position: "relative",
        cursor: "pointer",
        // overflow: size < 970 ? "scroll" : "hidden",
      }}
    >
      <MUIDataTable
        title={"Прошедшие  конференции"}
        data={dataUsers}
        columns={columns}
        options={options}
      />
    </div>
  );
};
export default PastConference;
