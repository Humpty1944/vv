import React, { useEffect, useState } from "react";
import "./PastConeference.css";
import MaterialTable from "material-table";
import { NavLink, useNavigate } from "react-router-dom";
import { AddBox, ArrowDownward } from "@material-ui/icons";
import report_img from "./report.png";
import MUIDataTable from "mui-datatables";
import axios from "axios";

const PastConference = (props) => {
  let navigate = useNavigate();
  const showInfo = (rowData) => {
    // props.parentCallback(report_id);
    sessionStorage.setItem("info", rowData);
    navigate("/report");
  };
  const options = {
    filterType: "checkbox",
    pagination: true,
    rowsPerPage: 6,
    onRowClick: showInfo,
    downloadOptions: { filename: "pastConference.csv", separator: ";" },
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
  };

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: false,
        sort: true,
      },
    },
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
  const handleResize = (e) => {
    console.log(size);
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
    let token = localStorage.getItem("token");
    try {
      axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          console.log(res.data);
          let r = res.data.filter((w) => w.hasEnded == true);
          let d = [];
          let idd = [];
          for (let i = 0; i < r.length; i++) {
            d.push({
              name: r[i].name,
              date: r[i].started,
              participants: r[i].usersAtMeeting.length,
              report: "ДА",
            });
            idd.push(r[i].id);
          }
          setData(d);
          setIndexes(idd);
          // setFullname(res.data.fullName);
          // setEmail(res.data.email);
          // setUsername(res.data.userName);
        })
        .catch(function (error) {
          console.log(error.response.status); // 401
          console.log(error.response.data.error); //Please Authenticate or whatever returned from server
          if (error.response.status == 403 || error.response.status == 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("date", "");
            navigate("/login");
          }
        });
    } catch (e) {
      console.log("resdsdsads");
    }
  }, []);
  return (
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
