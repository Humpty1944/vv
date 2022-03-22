import React, { useEffect, useState } from "react";
import OneLine from "../../../components/oneLine/OneLine";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { AsyncPaginate } from "react-select-async-paginate";
import ru from "date-fns/locale/ru";
import { DateTimePicker } from "@mui/lab";
import TextField from "@mui/material/TextField";
import "./NewConference.css";
import SubmitButton from "../../../components/submitButton/SubmitButton";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import FormControl from "@mui/material/FormControl";
import CheckboxLabel from "../../../components/checkBox/CheckboxLabel";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
//import loadOptions from "./loadOptions.js";
import axios from "axios";
import ReactLoading from "react-loading";
import { NavLink, useNavigate } from "react-router-dom";
import Popup from "react-popup";
import { SelectAllOutlined } from "@material-ui/icons";

registerLocale("ru", ru);

const buttonLabel = (pageName) => {
  if (pageName === "Create") {
    return "Создать";
  } else {
    return "Сохранить";
  }
};

const customStyles = {
  option: (provided, state) => ({
    // ...provided,

    color: "black",
    //background:  state.isFocused? "#d5e5ff" : "transparent",
    ":hover": {
      backgroundColor: "lightgray",
      color: "black",
    },
    height: "10px",
    padding: 10,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    width: 300,
    minheight: 40,
    border: 0,
  }),
  input: () => ({
    width: 300,
    minheight: 40,
    border: 0,
  }),
  multiValue: (provided) => ({
    ...provided,
    minwidth: 70,
  }),
  control: (provided, state) => ({
    ...provided,
    border: state.isSelected ? "none" : "none",
    borderRadius: 0,
    width: "490px",
    ":hover": {
      borderBottom: "solid 2px black",
    },
    borderBottom: state.isSelected ? "solid 3px lightblue" : "solid 1px gray",
  }),
};

const NewConference = (props) => {
  const [nameConference, setNameConference] = useState("");
  const [date, setDate] = useState(new Date());
  const [value, setValue] = React.useState([]);
  const [result, setResult] = React.useState([]);
  const videoUrls = async (val) => {
    const api = "https://api.ezmeets.live/v1/Users/GetUsersByGroup";
    let token = sessionStorage.getItem("token");
    let i = 0;
    let urllist = [];
    for (i; i < val.length; i++) {
      const response = await fetch(api + "?Group=" + val[i].label, {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      urllist.push(json);
      console.log({ urllist });
    }
    let a = await urllist;
    return a;
  };
  // const videoUrls = (val) => {
  //   const api = "https://api.ezmeets.live/v1/Users/GetUsersByGroup";
  //   let token = sessionStorage.getItem("token");
  //   const promises = val.map((item) => {
  //     return fetch(api + "?Group=" + val.label, {
  //       method: "get",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }).then((response) => {
  //       return response.json();
  //     });
  //   });

  //   Promise.all(promises).then((results) => {
  //     const videos = results;
  //     console.log(videos);
  //     setResult({ videos });
  //   });
  // };
  // const [result, setResult] = useState([]);
  function abc(arr) {
    const api = "https://api.ezmeets.live/v1/Users/GetUsersByGroup";
    let d = [];
    let token = sessionStorage.getItem("token");
    try {
      for (let i = 0; i < arr.length; i++) {
        axios
          .get(api + "?Group=" + arr[i].label, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            let idd = [];

            for (let i = 0; i < res.data.length; i++) {
              d.push(res.data[i].id);

              // idd.push(r[i].meetingID);
            }
            console.log(d);
            // setData(d);
            // setIndexes(idd);
            // setIsLoading(false);
            // setFullname(res.data.fullName);
            // setEmail(res.data.email);
            // setUsername(res.data.userName);
          })
          .catch(function (error) {});
      }
    } catch (e) {}
    console.log(d);
    setResult(d);
    console.log(result);
    return result;
  }

  const navigate = useNavigate();
  const [usersAll, setUserAll] = useState([]);
  async function fetchData() {
    const api1 = "https://api.ezmeets.live/v1/Meetings/Get?meetingID=";
    let token = sessionStorage.getItem("token");
    let response = await axios
      .get(api1 + props.conferenceID, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        return res;
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

    let user = await response.data;
    console.log(user);
    let allowed = await response.data.allowedUsers;
    let date = new Date(user.startTime);
    date.setHours(date.getHours() + 3);
    setNameConference(user.name);
    setUserAll(allowed);

    setDate(date);
  }

  const [isLoading, setIsLoading] = useState(true);

  const handleLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);
  useEffect(() => {
    if (props.pageName === "Update") {
      let rowData = sessionStorage.getItem("fut_conf").split(",");

      setNameConference(rowData[0]);
      fetchData();
      setIsLoading(false);
    } else if (props.pageName === "Update") {
      setIsLoading(true);
      setNameConference("");
      setDate(new Date());
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    if (props.pageName === "Update") {
    } else {
      setIsLoading(true);
      setNameConference("");
      setDate(new Date());
      setIsLoading(false);
    }
  }, [props.pageName]);
  const creatUser = (a) => {
    let ret = [];
    let idUser = localStorage.getItem("idUser");
    console.log(idUser);
    let findCopy = usersAll.find((r) => r.userID === idUser);
    console.log(findCopy);
    if (findCopy === undefined || findCopy === null || findCopy === "") {
      ret.push({ userID: idUser });
    }
    console.log(a);
    for (let i = 0; i < a.length; i++) {
      let findCopy = usersAll.find((r) => r.userID === a[i]);

      if (findCopy === undefined || findCopy === null) {
        ret.push({ userID: a[i] });
      }
    }

    console.log(ret);
    return ret;
  };
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function createNewConference() {
    //let a = getGroupsUsers();
    let a = await videoUrls(value);
    let resNew = [];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[i].length; j++) {
        resNew.push(a[i][j].id);
      }
    }

    const api = "https://api.ezmeets.live/v1/Meetings/ScheduleMeeting";
    let token = sessionStorage.getItem("token");
    let users = creatUser(resNew);
    let res = await fetch(api, {
      method: "post",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: nameConference,
        startTime: date.toISOString(),
        allowedUsers: users,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "Error") {
          Popup.alert(
            "Пожалуйста, подождите несколько минут и повторите запрос"
          );
        } else {
          props.parentCallback("a");
        }
      });
    await sleep(1000);
    window.location.reload(false);
    props.parentCallback("a");
  }
  const postReq = async () => {
    if (this.state.theUrl.length > 0) {
      /* await for the request to be finished */
      await axios
        .post("http://localhost:5000/check", {
          url: this.state.theUrl,
        })
        .then(function (response) {
          console.log("Success");
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      return 1;
    }
    return "Finished";
  };
  async function updateConference() {
    //  setIsLoading(true);
    console.log("update");
    let a = await videoUrls(value);
    let resNew = [];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[i].length; j++) {
        resNew.push(a[i][j].id);
      }
    }
    console.log(a);
    console.log(resNew);
    console.log(nameConference);
    const api = "https://api.ezmeets.live/v1/Meetings/UpdateScheduledMeeting";
    let token = sessionStorage.getItem("token");
    let users = creatUser(resNew);

    let res = await fetch(api, {
      method: "put",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        meetingID: props.conferenceID,
        name: nameConference,
        startTime: date.toISOString(),
        allowedUsers: users,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        // if (responseJson.status === "Error") {
        //   Popup.alert(
        //     "Пожалуйста, подождите несколько минут и повторите запрос"
        //   );
        // } else {
        //   setIsLoading(false);
        // }
      });
    let f = await res;
    console.log(f);
    // await sleep(1000);
    window.location.reload(false);
    props.parentCallback("a");
  }
  function chooseAction() {
    if (!nameConference.includes(" ") && nameConference === "") {
      if (props.pageName === "Create") {
        console.log(props.pageName === "Create");
        console.log("wtf");
        createNewConference();
        //createNewConference();
      } else {
        console.log(props.pageName === "Create");
        updateConference();
      }
    }
  }
  const handleCallbackNameConference = (childData) => {
    console.log(childData);
    setNameConference(childData);
    // setUsername(childData);
  };
  const buttonCreateNewConference = () => {
    console.log(nameConference);
    console.log(nameConference === "");
    if (!nameConference.includes(" ") && nameConference !== "") {
      if (props.pageName === "Create") {
        console.log(props.pageName === "Create");
        console.log("wtf");
        createNewConference();
        //createNewConference();
      } else {
        console.log(props.pageName === "Create");
        updateConference();
      }
    }
    //chooseAction();
    // if (props.pageName == "Create") {
    //   createNewConference();
    //   //createNewConference();
    // } else {
    //   updateConference();
    // }
    props.parentCallback("a");
    //window.location.reload(false);
  };
  // const check = (e) => {
  //   return true;
  // };
  const checkName = (e) => {
    return !e.includes(" ") || e === "";
  };
  async function loadOptions(search, loadedOptions) {
    let token = sessionStorage.getItem("token");

    const api = "https://api.ezmeets.live/v1/Users/GetGroups";
    let options = [];

    let a = await axios
      .get(api, { headers: { Authorization: `Bearer ${token}` } })
      .catch(function (error) {
        Popup.alert("Пожалуйста, подождите несколько минут и повторите запрос");
      });

    let res = await a.data;

    let help = res.filter((n) => n);

    for (let i = 0; i < help.length; i++) {
      options.push({
        value: help[i],
        label: help[i],
      });
    }
    let filteredOptions;

    if (!search) {
      filteredOptions = options;
    } else {
      const searchLower = search.toLowerCase();

      filteredOptions = options.filter(({ label }) =>
        label.toLowerCase().includes(searchLower)
      );
    }
    const hasMore = false;
    const slicedOptions = filteredOptions;

    return {
      options: slicedOptions,
      hasMore,
    };
  }

  return isLoading ? (
    <ReactLoading type={"spin"} color="#000" />
  ) : (
    <div>
      <div id="newConference">
        <Box
          component="form"
          sx={{
            display: "flex",
            flexWrap: "wrap",

            height: "600px",
            width: "700px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "200px",
          }}
        >
          <FormControl
            sx={{
              m: "100px",
              spacing: "100px",
              minWidth: "250px",

              marginTop: "-15pc",
            }}
            variant="standard"
          >
            <FormControl
              sx={{
                height: 150,
              }}
              variant="standard"
            >
              <h1 className="textName">
                {props.pageName == "Create"
                  ? "Создать конференцию"
                  : "Обновить данные конференции"}
              </h1>
            </FormControl>
            <FormControl
              sx={{
                height: 110,
              }}
              variant="standard"
            >
              <OneLine
                type="text"
                placeholder=""
                value={nameConference}
                parentCallback={handleCallbackNameConference}
                className="inputField"
                text="Наименование конференции"
                warning="Название конференции не должно быть пробелов"
                check={checkName}
              ></OneLine>
            </FormControl>
            <FormControl
              sx={{
                height: 80,
              }}
              variant="standard"
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Дата и время конференции"
                  value={date}
                  format="DD.MM.YYYY HH:mm"
                  // toolbarFormat="DD.MM.YYYY HH:mm"
                  ampm={false}
                  ampmInClock={false}
                  onChange={(newValue) => {
                    if (newValue >= new Date()) {
                      setDate(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl
                sx={{
                  height: 90,
                }}
                variant="standard"
              >
                <p id="labelParticipant">Участники конференции</p>
                <AsyncPaginate
                  value={value || ""}
                  isMulti
                  styles={customStyles}
                  loadOptions={loadOptions}
                  onChange={setValue}
                  isSearchable={true}
                  placeholder=""
                />

                <Button
                  style={{
                    width: 150,
                    marginLeft: "500px",
                    marginBottom: "-100px",
                    height: 50,
                  }}
                  variant="outlined"
                  onClick={buttonCreateNewConference}
                >
                  {buttonLabel(props.pageName)}
                </Button>
              </FormControl>
            </Box>
          </FormControl>
        </Box>
      </div>
    </div>
  );
};

export default NewConference;
