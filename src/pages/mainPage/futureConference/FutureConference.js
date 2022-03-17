import React, { useEffect, useRef, useState } from "react";
import "./FutureConference.css";
import MaterialTable from "material-table";
import { AddBox, ArrowDownward } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
// const showInfo = (rowData) => {
//   sessionStorage.setItem("fut_conf", rowData);
//   console.log(rowData);
// };
const FutureConference = (props) => {
  const columns = [
    {
      label: "Название",
      name: "name",
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
      label: "URL",
      name: "url",
      options: {
        filter: false,
        sort: true,
      },
    },
  ];
  //let data = [];
  const navigate = useNavigate();
  const ref = useRef(null);
  const [size, setSize] = useState();
  const [id, setId] = useState();
  const showInfo = (rowData) => {
    var ind = dataUsers.findIndex((object) => {
      return object.date === rowData[1] && object.name === rowData[0];
    });
    console.log(rowData);
    console.log(ind);
    console.log(data_index);
    sessionStorage.setItem("fut_conf", rowData);
    sessionStorage.setItem("fut_conf_date", new Date(rowData[1]));
    //sessionStorage.setItem("fut_conf_ind", rowData);
    //sessionStorage.setData("fut_conf", rowData);
    props.parentCallback(data_index[ind]);
  };
  const options = {
    filterType: "checkbox",
    downloadOptions: { filename: "futureConference.csv", separator: ";" },
    rowsPerPage: 6,
    onRowClick: showInfo,
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
  };
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
  async function fetchData(name, token) {
    let apiURL = "https://api.ezmeets.live/v1/Meetings/Join?roomName=" + name;
    let url = axios.post(apiURL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let urlRes = await url;
    console.log(urlRes);
    return urlRes;
  }
  useEffect(() => {
    const api = "https://api.ezmeets.live/v1/Meetings/GetScheduled";
    let token = localStorage.getItem("token");
    try {
      axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          console.log("ddddddddddddddddddddddddddddddddddddddddd");
          console.log(res.data);
          let d = [];
          let idd = [];
          for (let i = 0; i < res.data.length; i++) {
            let apiURL =
              "https://api.ezmeets.live/v1/Meetings/Join?roomName=" +
              res.data[i].name;
            let resURL = fetchData(res.data[i].name, token);
            let dateCur = new Date(res.data[i].startTime).toLocaleString();
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            console.log(dateCur);
            d.push({
              name: res.data[i].name,
              date: dateCur,
              participants: res.data[i].usersAtMeeting.length,
              url: "resURL",
            });
            idd.push(res.data[i].meetingID);
            console.log();
          }
          setData(d);
          setIndexes(idd);
          // setFullname(res.data.fullName);
          // setEmail(res.data.email);
          // setUsername(res.data.userName);
        })
        .catch(function (error) {
          console.log(error); // 401
          console.log(error); //Please Authenticate or whatever returned from server
          // if (error.response.status == 403 || error.response.status == 401) {
          //   localStorage.setItem("token", "");
          //   localStorage.setItem("date", "");
          //   navigate("/login");
          // }
        });
    } catch (e) {
      console.log(e);
    }
    console.log(dataUsers);
  }, []);
  return (
    <div
      ref={ref}
      style={{
        margin: "0 auto",
        marginTop: size < 970 ? "640px" : "60px",
        width: "calc(100vw / 2)",
        /* height: calc(100vh / 2); */
        position: "relative",
        cursor: "pointer",
        // overflow: size < 970 ? "scroll" : "hidden",
      }}
    >
      <MUIDataTable
        title={"Предстоящие конференции"}
        data={dataUsers}
        columns={columns}
        options={options}
      />
    </div>
  );
};
export default FutureConference;
