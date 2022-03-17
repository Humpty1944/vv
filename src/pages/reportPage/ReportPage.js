import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import "./ReportPage.css";
import axios from "axios";
import ReactLoading from "react-loading";
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
      },
    },
    {
      name: "photo",
      label: "Фото",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
  const data = [
  
  ];

  let filename = conferenceName + "_" + conferenceStart;
  const options = {
    selectableRows: false,
    pagination: false,
    rowsPerPageOptions: [30],
    selectToolbarPlacement: stp,
    onDownload: (buildHead, buildBody, columns, data) => {
      let x = [];
      let count = 0;
      for (let i of data) {
        let j = Object.assign({}, i.data.slice(0, 4));
        console.log(j);
        x.push({ index: count, data: i.data.slice(0, 4) });
        count++;
      }

      console.log(x);
      console.log(data);
      return (
        "\uFEFF" +
        createLabel(";\n") +
        buildHead(columns.slice(0, 4)) +
        buildBody(x)
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
  useEffect(() => {
    let dataBase = sessionStorage.getItem("info").split(",");
    let id = sessionStorage.getItem("infoID");
    const api1 = "https://api.ezmeets.live/v1/Meetings/Get";
    let token = localStorage.getItem("token");
    let response =  axios
      .get(api1, {
        params: {
          id: id,
        },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setConferenceName(res.data.name)
        setConferenceStart(new Date(res.data.startTime).toLocaleString())
        setConferenceParticipantsCount(res.data.usersAtMeeting.length)
        setIsLoading(false)
        //buildData(res.data.)
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(dataBase);
   
    // "Наименование конференции: " +
    // conferenceName +
    // sep +
    // "Организатор конференции: " +
    // conferenceOrginizer +
    // sep +
    // "Дата и время начала конференции: " +
    // conferenceOrginizer +
    // sep +
    // "Кол-во участников: " +
    // conferenceParticipantsCount +
    // sep
    // const api = "https://api.ezmeets.live/v1/Users/CurrentUser";
    // let token = localStorage.getItem("token");
    // try {
    //   axios
    //     .get(api, { headers: { Authorization: `Bearer ${token}` } })
    //     .then((res) => {
    //       console.log(res.data);
    //       setUserName(res.data.fullName);
    //       setUserRole("Admin");
    //       let api_user = "https://api.ezmeets.live/v1/Users/CurrentUserRole";
    //       axios
    //         .get(api_user, { headers: { Authorization: `Bearer ${token}` } })
    //         .then((res) => {
    //           console.log(res.data);
    //           setUserRole("Admin");
    //           //setUserRole(res.data);
    //         });
    //     })
    //     .catch(function (error) {
    //       if (error.response.status == 401) {
    //         localStorage.setItem("token", "");
    //         localStorage.setItem("date", "");
    //         navigate("/login");
    //       }
    //     });
    // } catch (e) {
    //   console.log("resdsdsads");
    // }
  }, []);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoading = () => {
    console.log(isLoading)
    setIsLoading(false);
    }
    
    useEffect(()=>{
      console.log(isLoading)
    window.addEventListener("load",handleLoading);
    return () => window.removeEventListener("load",handleLoading);
    },[])
  return isLoading ? (<div style={{position: 'relative', height:'100%'}}><div style={{ position: 'absolute',
    bottom: '50%',
    left: '50%',
    transform: "translate(-50%, -50%)"}}><ReactLoading type={'spin'} color="#000" /></div></div> ): (
    <div className="reportPage">
      <h1 className="headerRes" style={{ color: "rgb(185, 184, 184)" }}>
        Результат мониторинга конференции
      </h1>
      <div className="divInfoLables">
        <div style={{ height: "30px" }}></div>
        <label className="infoLable">{createLabel("\n")}</label>
      </div>
      <div style={{ height: "24px" }}></div>

      <MUIDataTable data={data} columns={columns} options={options} />
    </div>
  );
};
export default ReportPage;
