import "./CreateNewParticipant.css";
import React, { useEffect, useState } from "react";
import ImageUploader from "react-images-upload";
import OneLine from "../../../../components/oneLine/OneLine";
import SubmitButton from "../../../../components/submitButton/SubmitButton";
import { AsyncPaginate } from "react-select-async-paginate";
import { withAsyncPaginate } from "react-select-async-paginate";
import Creatable from "react-select/creatable";
import { Box, Button, FormControl } from "@mui/material";
import CheckboxLabel from "../../../../components/checkBox/CheckboxLabel";
import { InputLabel, MenuItem, OutlinedInput, Select } from "@material-ui/core";
import axios from "axios";
import loadOptions from "./loadOptions";
const headerLabel = (pageName) => {
  if (pageName === "Create") {
    return "Добавить нового участника";
  } else {
    return "Изменить данные участника";
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
const checkEmail = (e) => {
  return (
    e === "" ||
    e.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  );
};
const checkFullName = (e) => {
  return e === "" || e.trim().indexOf(" ") != -1;
};
const checkUserName = (e) => {
  return !e.includes(" ") || e === "";
};
const checkPassword = (e) => {
  return e === "" || e.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);
};
const checkEmailFinal = (e) => {
  return (
    e !== "" &&
    e.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) &&
    e !== undefined
  );
};
const checkFullnameFinal = (e) => {
  return e !== "" && e.includes(" ") && e !== undefined;
};
const CreateNewParticipant = (props) => {
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [group, setGroup] = useState([]);
  const [file, setFile] = useState();
  const [email, setEmail] = useState("");
  const [value, setValue] = useState([]);
  const [regionName, setregionName] = useState("The North");
  const [opt, setOpt] = useState([]);
  const [roleUser, setRole] = useState("");
  const [id, setId] = useState("");
  const translate = (roleName) => {
    if (roleName === "User") {
      return "Участник";
    }
    if (roleName === "Admin") {
      return "Модератор";
    }
    if (roleName === "SuperAdmin") {
      return "Администратор";
    }
  };
  const formValue = (group) => {
    return [
      {
        value: group,
        label: group,
      },
    ];
  };
  async function fetchData() {
    const api1 = "https://api.ezmeets.live/v1/Users/Get";
    const apiRole = "https://api.ezmeets.live/v1/Users/GetUserRole";
    let token = localStorage.getItem("token");
    let response = await axios
      .get(api1, {
        params: {
          userID: props.userID,
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
    let responseRole = await axios
      .get(apiRole, {
        params: {
          userID: props.userID,
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
    let roleaw = await responseRole.data;
    setFullname(user.fullName);
    setEmail(user.email);
    // setGroup(user.group);
    // setValue(formValue(group));
    setRole(translate(roleaw));
    setId(user.id);
    console.log(roleaw);
  }
  useEffect(() => {
    console.log(props.pageName);
    if (props.pageName === "Update") {
      fetchData();
    } else {
      setFullname("");
      setEmail("");
      setFile(null);
      setGroup([]);
      setRole("");
    }
  }, []);
  if (props.pageName === "Create") {
    console.log(props.userID);
  }

  const onDrop = (pictureFiles, pictureDataURLs) => {
    let form = new FormData();
    console.log(pictureFiles.length);
    if (pictureFiles.length === 1) {
      form.append("File", pictureFiles[0], pictureFiles[0].name);
      console.log(pictureFiles[0].name);
      setFile(form);
    } else {
      console.log(null);
      setFile(null);
    }
  };
  const handleRole = (event) => {
    console.log(event.target.value);
    setRole(event.target.value);
  };

  const handleCallbackFullname = (childData) => {
    setFullname(childData);
  };
  const handleCallbackEmail = (childData) => {
    setEmail(childData);
  };
  const handleCallback = (childData) => {
    console.log(childData);
  };
  const handleGroup = (childData) => {
    console.log(childData.label);
    setGroup(group.concat(childData.label));
    setValue(childData);
  };
  const addNewPhoto = () => {
    let token = localStorage.getItem("token");
    try {
      fetch("https://api.ezmeets.live/v1/Users/ChangeAvatar", {
        method: "post",
        headers: {
          ContentType: "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: file,
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const createUser = () => {
    if (
      checkEmailFinal(email) &&
      checkFullnameFinal(fullname) &&
      roleUser !== "" &&
      roleUser !== undefined &&
      group.length > 0
    ) {
      const api = "https://api.ezmeets.live/v1/Users/Register";
      try {
        axios
          .post(api, {
            userName: email,
            password:
              Math.random().toString(36).slice(-4) +
              "@" +
              Math.floor(Math.random() * 50) +
              Math.random().toString(36).slice(-4).toUpperCase(),
            fullName: fullname,
            email: email,
            group: group[0],
          })
          .then((res) => {
            console.log(res);
            if (file !== null) {
              addNewPhoto();
            }
            if (roleUser !== "Участник") {
              getPromotion();
            }
          })
          .catch(function (error) {
            if (error.response.status == 401) {
              localStorage.setItem("token", "");
              localStorage.setItem("date", "");
              //navigate("/login");
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const updateUser = () => {
    if (
      checkEmailFinal(email) &&
      checkFullnameFinal(fullname) &&
      roleUser !== "" &&
      roleUser !== undefined &&
      group.length > 0
    ) {
      const api = "https://api.ezmeets.live/v1/Users/Update";
      try {
        axios
          .put(api, {
            id: id,
            userName: email,
            fullName: fullname,
            email: email,
            group: group[0],
          })
          .then((res) => {
            console.log(res);
            if (file !== null) {
              addNewPhoto();
            }
            if (roleUser !== "Участник") {
              getPromotion();
            }
          })
          .catch(function (error) {
            if (error.response.status == 401) {
              localStorage.setItem("token", "");
              localStorage.setItem("date", "");
              //navigate("/login");
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  };
  const buttonCreateNewParticipant = () => {
    if (props.pageName === "Create") {
      createUser();
    } else {
      updateUser();
    }
  };
  const getPromotion = () => {};
  const onRole = (role) => {
    if (role == "Администратор") {
      return (
        <FormControl
          sx={{
            height: 180,

            display: "flex",
            textAlign: "start",
          }}
          variant="standard"
        >
          <div style={{ height: "50px" }}></div>
          <InputLabel
            id="select-standard-label"
            shrink={true}
            htmlFor="standard-adornment-password"
            sx={{
              color: "success.dark",
              display: "inline",
              fontWeight: "bold",
              paddingLeft: 100,
              fontSize: 14,
            }}
          >
            Роль
          </InputLabel>
          <Select
            labelId="select-standard-label"
            id="demo-simple-select-standard"
            value={roleUser}
            onChange={handleRole}
            label="Роль"
            sx={{
              color: "success.dark",
              display: "inline",
              fontWeight: "bold",
              mx: 0.5,
              fontSize: 14,
            }}
          >
            <MenuItem value={"Администратор"}>Администратор</MenuItem>
            <MenuItem value={"Модератор"}>Модератор</MenuItem>
            <MenuItem value={"Участник"}>Участник</MenuItem>
          </Select>
          <div style={{ height: "50px" }}></div>
        </FormControl>
      );
    } else {
      return <div style={{ height: "50px" }}></div>;
    }
  };
  const CreatableAsyncPaginate = withAsyncPaginate(Creatable);

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
                height: 110,
              }}
              variant="standard"
            >
              <h1 className="textName">{headerLabel(props.pageName)}</h1>
            </FormControl>
            <FormControl
              sx={{
                height: 110,
              }}
              variant="standard"
            >
              <OneLine
                type="text"
                text="ФИО"
                value={fullname}
                parentCallback={handleCallbackFullname}
                check={checkFullName}
                warning="Необходима фамилия, имя и отчество"
              />
            </FormControl>
            <FormControl
              sx={{
                height: 110,
              }}
              variant="standard"
            >
              <OneLine
                type="email"
                text="Почта"
                value={email}
                parentCallback={handleCallbackEmail}
                check={checkEmail}
                warning="Введите корректную почту"
              />
            </FormControl>
            <FormControl
              sx={{
                height: 80,
              }}
              variant="standard"
            >
              <div className="imageUpload">
                <ImageUploader
                  withPreview={true}
                  label={""}
                  withIcon={false}
                  buttonText="Загрузите фото участника"
                  onChange={onDrop} //{this.onDrop}
                  imgExtension={[".jpg", ".png", ".jpeg"]}
                  singleImage={true}
                  className="fileContainer"
                  // buttonStyles={styles.buttonCustom}
                  // fileContainerStyle={styles.title} (pictureFiles, pictureDataURLs) => this.props.onDrop(pictureFiles, pictureDataURLs)
                />
              </div>
            </FormControl>
            <div style={{ height: "100px" }}></div>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl
                sx={{
                  height: 90,
                }}
                variant="standard"
              >
                <p id="labelParticipant">Группа</p>
                <CreatableAsyncPaginate
                  value={value || ""}
                  styles={customStyles}
                  loadOptions={loadOptions}
                  onChange={handleGroup}
                  isSearchable={true}
                  placeholder=""
                />
                {onRole("Администратор")}
                <Button
                  style={{
                    width: 150,
                    marginLeft: "500px",
                    marginBottom: "-100px",
                    height: 50,
                  }}
                  variant="outlined"
                  onClick={buttonCreateNewParticipant}
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
export default CreateNewParticipant;
