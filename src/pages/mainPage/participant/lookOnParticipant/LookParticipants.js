import React, { useEffect, useState } from "react";
import "./LookParticipants.css";
import MaterialTable from "material-table";
import { AddBox, ArrowDownward } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import { PromptProps } from "react-router-dom";
import axios from "axios";
import ReactLoading from "react-loading";
import { NavLink, useNavigate } from "react-router-dom";
import Popup from "react-popup";
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
  const [isLoading, setIsLoading] = useState(true);

  const handleLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);
  const [dataUsers, setData] = useState([]);
  const [data_index, setIndexes] = useState([]);
  const showInfo = (rowData) => {
    let roleCurr = sessionStorage.getItem("roleUser");
    if (roleCurr === "SuperAdmin") {
      var ind = dataUsers.findIndex((object) => {
        return object.email === rowData[1];
      });
      props.parentCallback(data_index[ind]);
    }
  };
  const options = {
    filterType: "checkbox",
    pagination: true,
    selectableRows:
      sessionStorage.getItem("roleUser") === "SuperAdmin" ? true : false,
    rowsPerPage: 6,
    onRowClick: showInfo,
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
    downloadOptions: { filename: "participants.csv", separator: ";" },
    onRowsDelete: (rowsDeleted, dataRows) => {
      deleteRequest(rowsDeleted);
      // const idsToDelete = dataRows.map(d => data[d.dataIndex].id); // array of all ids to to be deleted
      // http.delete(idsToDelete, res).then(window.alert('Deleted!')); // your delete request here
    },
  };
  const [size, setSize] = useState();
  let d = [];
  const handleResize = (e) => {
    setSize(window.innerWidth);
  };

  async function fetchData(token, id) {
    const apiRole = "https://api.ezmeets.live/v1/Users/GetUserRole";
    let responseRole = await axios
      .get(apiRole, {
        params: {
          userID: id,
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      .catch(function (error) {
        // if (error.response.status == 401) {
        //   localStorage.setItem("token", "");
        //   localStorage.setItem("date", "");
        //   // navigate("/login");
        // }
      });
    let res = await responseRole.data;

    return res;
  }
  async function deleteRequest(rowsDeleted) {
    let token = sessionStorage.getItem("token");

    for (let i = 0; i < rowsDeleted.data.length; i++) {
      let idUsr = data_index[rowsDeleted.data[i].index];
      let apiURL = "https://api.ezmeets.live/v1/Users" + "?userID=" + idUsr;
      fetch(apiURL, {
        method: "DELETE",
        headers: {
          ContentType: "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => console.log(res));
    }
  }
  const navigate = useNavigate();
  async function fetchDataAll() {
    const api = "https://api.ezmeets.live/v1/Users/GetAll";
    //setData();
    let token = sessionStorage.getItem("token");
    let work = await axios
      .get(api, { headers: { Authorization: `Bearer ${token}` } })
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
    let result = await work.data;
    console.log(result);
    let idd = [];
    for (let i = 0; i < work.data.length; i++) {
      d.push({
        fullName: result[i].fullName,
        email: result[i].email,
        group: result[i].group,
        photo:
          result[i].avatarPath === null ||
          result[i].avatarPath === undefined ||
          result[i].avatarPath === ""
            ? "НЕТ"
            : "ДА",
      });
      idd.push(result[i].id);
    }
    setData(d);
    setIndexes(idd);
    setIsLoading(false);
  }
  useEffect(() => {
    setSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    let token = sessionStorage.getItem("token");
    fetchDataAll();
  }, []);
  return isLoading ? (
    <ReactLoading type={"spin"} color="#000" />
  ) : (
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
