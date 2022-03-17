import React, { useEffect, useState } from "react";
import "./LookParticipants.css";
import MaterialTable from "material-table";
import { AddBox, ArrowDownward } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import { PromptProps } from "react-router-dom";
import axios from "axios";

const LookParticipants = (props) => {
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
      name: "photo",
      label: "Есть фото",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const [dataUsers, setData] = useState([]);
  const [data_index, setIndexes] = useState([]);
  const showInfo = (rowData) => {
    var ind = dataUsers.findIndex((object) => {
      return object.email === rowData[1];
    });
    props.parentCallback(data_index[ind]);
  };
  const options = {
    filterType: "checkbox",
    pagination: "true",
    rowsPerPage: 6,
    onRowClick: showInfo,
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
    downloadOptions: { filename: "participants.csv", separator: ";" },
  };
  const [size, setSize] = useState();
  let d = [];
  const handleResize = (e) => {
    setSize(window.innerWidth);
  };

  useEffect(() => {
    setSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const api = "https://api.ezmeets.live/v1/Users/GetAll";
    setData();
    let token = localStorage.getItem("token");
    try {
      axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          let idd = [];
          for (let i = 0; i < res.data.length; i++) {
            console.log(res.data);
            d.push({
              fullName: res.data[i].fullName,
              email: res.data[i].email,
              group: res.data[i].group,
              photo:
                res.data[i].avatarPath === null ||
                res.data[i].avatarPath === undefined ||
                res.data[i].avatarPath === ""
                  ? "НЕТ"
                  : "ДА",
            });
            idd.push(res.data[i].id);
          }
          setData(d);
          setIndexes(idd);
        })

        .catch(function (error) {
          console.log(error);
          // if (error.response.status == 401) {
          //   localStorage.setItem("token", "");
          //   localStorage.setItem("date", "");
          //   // navigate("/login");
          // }
        });
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <div
      style={{
        margin: "0 auto",
        marginTop: size < 970 ? "570px" : "60px",
        width: "calc(100vw / 2)",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <MUIDataTable
        title={"Список зарегистрированных участников"}
        data={dataUsers}
        columns={columns}
        options={options}
      />
    </div>
  );
};
export default LookParticipants;
