import React, { useEffect, useRef, useState } from "react";
import "./FutureConference.css";
import MaterialTable from "material-table";
import { AddBox, ArrowDownward, AssessmentRounded } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { frCA } from "date-fns/locale";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { createTheme } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import Popup from "react-popup";
import Tooltip from "@material-ui/core/Tooltip";

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
        filter: true,
        sort: true,

        customBodyRender: (data, type, row) => {
          let text = data;
          if (text !== "Ссылка не сгенерирована")
            text = "Нажмите на строку, чтобы скопировать ссылку";
          else {
            text = "Ссылка не сгенерирована";
          }

          return (
            <div
              style={{
                flexDirection: "row",
              }}
            >
              <p style={{ flexShrink: 1 }}>{text}</p>
            </div>
          );
        },
      },
    },
  ];
  const navigate = useNavigate();
  const ref = useRef(null);
  const [size, setSize] = useState();
  const [id, setId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const showInfo = (index) => {
    sessionStorage.setItem("fut_conf", dataUsers[index]);
    props.parentCallback(data_index[index]);
  };
  const handleLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);

  async function deleteRequest(rowsDeleted) {
    let token = sessionStorage.getItem("token");

    var ind = dataUsers.findIndex((object) => {
      return object.date === rowsDeleted[1] && object.name === rowsDeleted[0];
    });

    for (let i = 0; i < rowsDeleted.data.length; i++) {
      let idUsr = data_index[rowsDeleted.data[i].index];
      let apiURL =
        "https://api.ezmeets.live/v1/Meetings/DeleteScheduledMeeting" +
        "?meetingID=" +
        idUsr;
      fetch(apiURL, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => console.log(res))
        .then((responseJson) => {
          if (
            responseJson.status === 401 ||
            responseJson.status === 404 ||
            responseJson.status === 500
          ) {
            // Popup.alert("Проверьте правльность введенных данных");
            return;
          } else {
            sessionStorage.setItem("token", "");
            localStorage.setItem("date", "");
            navigate("/");
          }
        });
    }
  }
  const copyURL = (rowData) => {
    var ind = dataUsers.findIndex((object) => {
      return object.date === rowData[1] && object.name === rowData[0];
    });

    navigator.clipboard.writeText(dataUsers[ind].url);
  };
  const options = {
    filterType: "checkbox",
    downloadOptions: { filename: "futureConference.csv", separator: ";" },
    rowsPerPage: 6,
    onRowClick: copyURL,
    setRowProps: (row, dataIndex) => ({
      onDoubleClick: () => {
        showInfo(dataIndex);
      },
    }),
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      deleteRequest(rowsDeleted);
    },
    // selectableRows: true,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <customToolbarSelect
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
      />
    ),
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

  const [load, setLoad] = useState(false);
  function remove_duplicates_es6(arr) {
    const ids = arr.map((o) => o.userID);
    const filtered = arr.filter(
      ({ userID }, index) => !ids.includes(userID, index + 1)
    );
    return filtered;
  }
  async function fetchData(arr, token, d, idd, usAl) {
    const currUserRole = sessionStorage.getItem('roleUser')
    for (let i = 0; i < arr.length; i++) {
      try {
        let f = await fetch(
          "https://api.ezmeets.live/v1/Meetings/Join?meetingID=" + arr[i],
          {
            method: "post",
            headers: { Authorization: "Bearer " + token },
          }
        ).then((response) => {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then((data) => {
              if (data.message === "Meeting has not started yet") {
                d[i]["url"] = "Ссылка не сгенерирована";
              }
             else if (
                data.status === 400 ||
                data.status === 404 ||
                data.status === 204 ||
                data.message === "You are not allowed at that meeting"
              ) {
                d[i]["url"] = "delete";
              }
             
            //  else if (currUserRole==='SuperAdmin'){
            //   console.log(currUserRole)
            //     d[i]["url"] = "У вас нет доступа к ссылке на данную конференцию";
            //   }
            });
          } else {
            return response.text().then((text) => {
              d[i]["url"] = text;
              // if (currUserRole==='SuperAdmin'){
              //   console.log(currUserRole)
              //     d[i]["url"] = "У вас нет доступа к ссылке на данную конференцию";
              //   }
            });
          }
        });

        let ee = await f;
      } catch (e) {}
    }
    const arrD = d.filter((r) => r["url"] !== "delete");
    let idNew = [];
    let usAlNew = [];

    for (let i = 0; i < d.length; i++) {
      if (d[i]["url"] !== "delete") {
        idNew.push(idd[i]);
        usAlNew.push(usAl[i]);
      }
    }
    const indices = Array.from(arrD.keys());
  //  indices.sort((a, b) => arrD[a].date.localeCompare(arrD[b].date));
    indices.sort((a, b) => arrD[a].dateToString - (arrD[b].dateToString));
    console.log(indices)
    const sortedDate = indices.map((i) => arrD[i]);
    const sortedId = indices.map((i) => idNew[i]);
    const sortedusAl = indices.map((i) => usAlNew[i]);
    setData(sortedDate);
    setUserAllowed(sortedusAl);
    setIndexes(sortedId);
    setLoad(true);
    return d;
  }
  const [load2, setLoad2] = useState(false);
  const [userAllowed, setUserAllowed] = useState([]);
  async function fetchAllData() {
     const api = "https://api.ezmeets.live/v1/Meetings/GetAll";
    //const api = "https://api.ezmeets.live/v1/Meetings/GetScheduled";
    let token = sessionStorage.getItem("token");

    let idUser = localStorage.getItem("idUser");
    let ax = await axios
      .get(api, { headers: { Authorization: `Bearer ${token}` } })
      .catch(function (error) {
        if (error.response.status == 403 || error.response.status == 401) {
          sessionStorage.setItem("token", "");
          localStorage.setItem("date", "");
          navigate("/login");
        } else {
        //  Popup.alert("Проверьте правльность введенных данных");
        }
      });
    let res = await ax.data;

    let d = [];
    let idd = [];
    let usAl = [];
    const currUserRole = sessionStorage.getItem('roleUser')
    for (let i = 0; i < res.length; i++) {
      let findSameUser = res[i].allowedUsers.find((r) => r.userID === idUser);
      if ((findSameUser !== undefined && findSameUser !== null)||currUserRole==='SuperAdmin') {
        let dateCur = new Date(res[i].startTime);
        dateCur.setHours(dateCur.getHours() + 3);
        const diff = (dateCur-new Date())/36000000
        // console.log(diff)
        // console.log((diff<0&& diff>-2)||(diff>0))
        if (res[i].hasEnded === false) {
        if ((diff<0&& diff>-2)||(diff>0)){
          // console.log(res);
          d.push({
            name: res[i].name,
            date: dateCur.toLocaleString(),
            participants: remove_duplicates_es6(res[i].allowedUsers).length,
            url: "resURL",
            dateToString: dateCur
          });
          idd.push(res[i].meetingID);
          usAl.push(res[i].allowedUsers);
        
        }
      }
      }
    }

    let urlF = fetchData(idd, token, d, idd, usAl);
    setLoad2(true);
  }
  useEffect(() => {
    if (load && load2) {
      setIsLoading(false);
    }
  }, [load, load2]);
  useEffect(() => {
    fetchAllData();
  }, []);

  return !isLoading ? (
    <div
      ref={ref}
      style={{
        margin: "0 auto",
        marginTop: size < 970 ? "650px" : "60px",
        width: "calc(100vw / 2)",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <Tooltip
        title="Для редактирование данных нажмите два раза на нужной строке"
        placement="top"
      >
        <div
          style={{
            margin: "0 auto",
            marginLeft: size / 2,
            marginBottom: "20px",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <HelpIcon />
        </div>
      </Tooltip>

      <MUIDataTable
        title={"Предстоящие конференции"}
        data={dataUsers}
        columns={columns}
        options={options}
      />
    </div>
  ) : (
    <ReactLoading type={"spin"} color="#000" />
  );
};
export default FutureConference;
