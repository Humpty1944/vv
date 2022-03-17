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
import loadOptions from "./loadOptions";
import axios from "axios";
registerLocale("ru", ru);

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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const NewConference = (props) => {
  const [nameConference, setNameConference] = useState("");
  const [date, setDate] = useState(new Date());
  const [personName, setPersonName] = React.useState([]);
  const [isGroup, setIsGroup] = useState(false);
  const [value, setValue] = React.useState([]);
  const [onlyGroup, setOnlyGroup] = useState(false);
  const [regionName, setregionName] = useState("The North");
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleCallback = (childData) => {
    console.log(childData);
    setIsGroup(childData);
  };
  const [result, setResult] = useState([]);
  const getUserByGroup = () => {
    const api = "https://api.ezmeets.live/v1/Users/GetUsersByGroup";
    let token = localStorage.getItem("token");
    let r = [];
    if (value.length > 0) {
      try {
        let res = fetch(api + "?Group=" + value[0].label, {
          method: "get",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => console.log(response));
      } catch (e) {
        console.log(e);
      }
    }
    setResult(r);
    console.log(result);
  };
  async function fetchData() {
    const api1 = "https://api.ezmeets.live/v1/Meetings/Get";
    let token = localStorage.getItem("token");
    let response = await axios
      .get(api1, {
        params: {
          id: props.conferenceID,
        },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch(function (error) {
        console.log(error);
        // if (error.response.status == 401) {
        //   localStorage.setItem("token", "");
        //   localStorage.setItem("date", "");
        //   // navigate("/login");
        // }
      });

    let user = await response.data;
    setDate(new Date(user.startTime));
    // setFullname(user.fullName);
    // setEmail(user.email);
    // setGroup(user.group);
    // setValue(formValue(group));
    // setRole(roleaw);
    // setId(user.id);
  }
  useEffect(() => {
    if (props.pageName === "Update") {
      let rowData = sessionStorage.getItem("fut_conf").split(",");

      setNameConference(rowData[0]);
      fetchData();
    } else {
      setNameConference("");
      setDate(new Date());
    }
    // setDate(sessionStorage.getItem("fut_conf_date"));
    // console.log(new Date(sessionStorage.getItem("fut_conf_date")));
  }, []);
  const creatUser = () => {
    let ret = [];
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      ret.push({ userID: result[i] });
    }
    return ret;
  };
  const createNewConference = () => {
    getUserByGroup();
    const api = "https://api.ezmeets.live/v1/Meetings/ScheduleMeeting";
    let token = localStorage.getItem("token");
    let users = creatUser();
    console.log(users);
    let res = fetch(api, {
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
          alert(responseJson.title);
        } else {
          console.log(responseJson);
        }
      });
  };
  const updateConference = () => {
    getUserByGroup();
    const api = "https://api.ezmeets.live/v1/Meetings/UpdateScheduledMeeting";
    let token = localStorage.getItem("token");
    let users = creatUser();
    console.log(users);
    let res = fetch(api, {
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
        if (responseJson.status === "Error") {
          alert(responseJson.title);
        } else {
          console.log(responseJson);
        }
      });
  };
  const buttonCreateNewConference = () => {
    if (props.pageName == "Create") {
      createNewConference();
    } else {
      updateConference();
    }
    // axios
    //   .post(
    //     api,
    //     { headers: { Authorization: `Bearer ${token}` } },
    //     {
    //       name: nameConference,
    //       startTime: date.toISOString(),
    //       allowedUsers: creatUser(),
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch(function (error) {
    //     if (error.response.status == 401) {
    //       localStorage.setItem("token", "");
    //       localStorage.setItem("date", "");
    //       //navigate("/login");
    //     }
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  };
  const check = (e) => {
    return true;
  };
  const onClick = () => {};

  return (
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
                parentCallback={setNameConference}
                className="inputField"
                text="Наименование конференции"
                warning="sd"
                check={check}
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
                  format="DD/MM/YYYY HH:mm"
                  ampm={false}
                  ampmInClock={false}
                  onChange={(newValue) => {
                    setDate(newValue);
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
                {/* <AsyncPaginate
                  value={value || ""}
                  isMulti
                  styles={customStyles}
                  loadOptions={loadOptions}
                  getOptionValue={(option) => option.name}
                  getOptionLabel={(option) => option.name}
                  onChange={setValue}
                  isSearchable={true}
                  placeholder=""
                  additional={{
                    page: 1,
                  }}
                /> */}
                {/* <div id="checkBox">
                  <CheckboxLabel
                    parentCallback={handleCallback}
                    text="Только группы"
                  ></CheckboxLabel>
                </div> */}
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
                  Создать конференцию
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

{
  /* <div className="oneLine">
<div className="warning">
  {/* <AsyncPaginate
    key={JSON.stringify(opt)}
    value={value || ""}
    isMulti
    styles={customStyles}
    loadOptions={loadOptions}
    getOptionValue={(option) => option.name}
    getOptionLabel={(option) => option.name}
    onChange={setValue}
    isSearchable={false}
    placeholder="Выберите участников"
    additional={{
      page: 1,
    }}
  /> */
}
//   <div>
//     <input
//       type="checkbox"
//       id="topping"
//       name="topping"
//       value={onlyGroup}
//       onChange={handleChange}
//     />
//     Только группы
//   </div>
// </div> */}
{
  /* <FormControl sx={{ m: 1, width: 300 }}>
<InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
<Select
  labelId="demo-multiple-checkbox-label"
  id="demo-multiple-checkbox"
  multiple
  value={personName}
  onChange={handleChange}
  input={<OutlinedInput label="Tag" />}
  renderValue={(selected) => selected.join(", ")}
  MenuProps={MenuProps}
>
  {names.map((name) => (
    <MenuItem key={name} value={name}>
      <Checkbox checked={personName.indexOf(name) > -1} />
      <ListItemText primary={name} />
    </MenuItem>
  ))}
</Select>
</FormControl> */
}
