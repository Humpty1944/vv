import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import "./ReportPage.css";
import axios from "axios";
import ReactLoading from "react-loading";
import { List, ListItem, TableCell } from "@material-ui/core";

function Chapters({ value }) {
  const chapters = value.split("\n");

  return (
    <List>
      {chapters.map((chapter, i) => (
        <ListItem key={i}>{chapter}</ListItem>
      ))}
    </List>
  );
}
const ReportPage = (props) => {
  const [conferenceName, setConferenceName] = useState("ddddd");
  const [conferenceOrginizer, setConferenceOrginizer] = useState("John Doe");
  const [conferenceStart, setConferenceStart] = useState("12:20");
  const [conferenceParticipantsCount, setConferenceParticipantsCount] =
    useState("2");
  const [stp, setStp] = useState("replace");
  const createLabel = (sep) => {
    return (
      "Наименование конференции: " +
      conferenceName +
      sep +
      "Дата и время начала конференции: " +
      conferenceStart +
      sep +
      "Кол-во участников: " +
      conferenceParticipantsCount +
      sep
    );
  };
  const columns = [
    {
      name: "fullName",
      label: "ФИО",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "email",
      label: "Почта",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "group",
      label: "Группа",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "status",
      label: "Статус",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (data, type, row) => {
          let text = data;
          if (text !== "Ссылка не сгенерирована")
            text = "Нажмите на строку, чтобы скопировать ссылку";

          let value = <Chapters value={data} />;
          return <TableCell key={row}>{value}</TableCell>;
        },
      },
    },
    {
      name: "allTime",
      label: "Общее время пребывания",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
  const [data, setData] = useState([]);

  let filename = conferenceName + "_" + conferenceStart;
  const options = {
    selectableRows: false,
    pagination: false,
    rowsPerPageOptions: [30],
    selectToolbarPlacement: stp,

    onDownload: (buildHead, buildBody, columns, data) => {
      let x = [];
      let count = 0;
      // for (let i of data) {
      //   let j = Object.assign({}, i.data.slice(0, 4));
      //   console.log(j);
      //   x.push({ index: count, data: i.data.slice(0, 4) });
      //   count++;
      // }
      for (let i of data) {
        let j = Object.assign({}, i.data);

        x.push({ index: count, data: i.data });
        count++;
      }

      return (
        "\uFEFF" + createLabel(";\n") + buildHead(columns) + buildBody(x)
        // buildHead(columns.slice(0, 4)) +
        // buildBody(x)
      );
    },
    downloadOptions: { filename: filename + ".csv", separator: ";" },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <customToolbarSelect
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
      />
    ),
  };

  async function fetchData() {
    let id = sessionStorage.getItem("infoID");
    const api1 = "https://api.ezmeets.live/v1/Meetings/Get?id=" + id;
    let token = sessionStorage.getItem("token");
    let response = await axios
      .get(api1, {
        headers: { Authorization: `Bearer ${token}` },
      })

      .catch(function (error) {
        console.log(error);
      });
    let result = await response.data;

    setConferenceName(result.name);
    setConferenceStart(new Date(result.startTime).toLocaleString());
    setConferenceParticipantsCount(result.usersAtMeeting.length);
    let dd = [];

    for (let i = 0; i < result.usersAtMeeting.length; i++) {
      let currTime = workWithLog(result.usersAtMeeting[i].connectionLogs);
      //let endTiem = new Date(result.endingTime);
      console.log(currTime);
      dd.push({
        fullName: result.usersAtMeeting[i].user.fullName,
        email: result.usersAtMeeting[i].user.email,
        group: result.usersAtMeeting[i].user.group,
        status: currTime[0],
        allTime: Number(currTime[1].toFixed(1)) + " мин",
      });
    }
    setData(dd);
    setIsLoading(false);
  }
  const workWithLog = (connectionLogs) => {
    let res = "";
    let sumTime = 0;
    let resArray = [];
    let enter = 0;
    let leave = 0;
    console.log(connectionLogs.length);
    for (let i = 0; i < connectionLogs.length; i++) {
      if (connectionLogs[i].action === "enter") {
        enter = new Date(connectionLogs[i].dateTime);
      }
      if (connectionLogs[i].action === "leave") {
        leave = new Date(connectionLogs[i].dateTime);
        sumTime += leave - enter;
      }

      if (resArray[connectionLogs[i].action] === undefined) {
        resArray[connectionLogs[i].action] = 1;
      } else {
        resArray[connectionLogs[i].action] += 1;
      }
    }

    const sumValues = (resArray) =>
      Object.values(resArray).reduce((a, b) => a + b);
    const sumCount = sumValues(resArray);
    console.log(sumCount);
    for (const [key, value] of Object.entries(resArray)) {
      console.log(key, value);
      res += "\n" + key + ": " + Number((value / sumCount).toFixed(3));
    }
    return [res, sumTime / 6000];
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);
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
    <div className="reportPage">
      <h1 className="headerRes" style={{ color: "rgb(185, 184, 184)" }}>
        Результат мониторинга конференции
      </h1>
      <div className="divInfoLables">
        <div style={{ height: "20px" }}></div>
        <label className="infoLable">{createLabel("\n")}</label>
      </div>
      <MUIDataTable data={data} columns={columns} options={options} />
    </div>
  );
};
export default ReportPage;
