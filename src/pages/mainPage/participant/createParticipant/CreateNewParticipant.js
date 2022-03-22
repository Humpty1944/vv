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
//import loadOptions from "./loadOptions";
import { useNavigate } from "react-router-dom";

import Popup from "react-popup";
import ReactLoading from "react-loading";
const headerLabel = (pageName) => {
  if (pageName === "Create") {
    return "Добавить нового участника";
  } else {
    return "Изменить данные участника";
  }
};
const buttonLabel = (pageName) => {
  if (pageName === "Create") {
    return "Добавить";
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
    minheight: 5,
    border: 0,
    // marginLeft: "-10px",
    // marginBottom: "-20px",
    // marginTop: "10px",
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
  return e === "" || e.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/);
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
  const [username, setUsername] = useState("");
  const [file, setFile] = useState();
  const [email, setEmail] = useState("");
  const [value, setValue] = useState([]);
  const [regionName, setregionName] = useState("The North");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [roleUser, setRole] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
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

  const [isLoading, setIsLoading] = useState(true);
  const handleCallbackUsername = (childData) => {
    setUsername(childData);
  };
  const handleLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);

  async function fetchData() {
    const api1 = "https://api.ezmeets.live/v1/Users/Get";
    const apiRole = "https://api.ezmeets.live/v1/Users/GetUserRole";
    let token = sessionStorage.getItem("token");
    let response = await axios
      .get(api1, {
        params: {
          userID: props.userID,
        },
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
    let responseRole = await axios
      .get(apiRole, {
        params: {
          userID: props.userID,
        },
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
    let roleaw = await responseRole.data;
    // let blob = await fetch(user.avatarPath).then((r) => r.blob());

    setFullname(user.fullName);
    setEmail(user.email);
    setGroup([user.group]);
    setImageURL(user.avatarPath);

    setValue([
      {
        value: user.group,
        label: user.group,
      },
    ]);
    setRole(translate(roleaw));
    setId(user.id);

    setIsLoading(false);
  }
  useEffect(() => {
    if (props.pageName === "Update") {
      setIsLoadingFile(true);
      fetchData();
    } else {
      setFullname("");
      setEmail("");
      setFile(null);
      setGroup([]);
      setRole("");
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    if (props.pageName === "Update") {
      setIsLoadingFile(true);
      fetchData();
    } else {
      setFullname("");
      setEmail("");
      setFile(null);
      setGroup([]);
      setRole("");
      setIsLoading(false);
    }
  }, [props.pageName]);
  async function fileGet(url) {
    let blob = await fetch(url).then((r) => r.blob());
    return blob;
  }
  const onDrop = (pictureFiles, pictureDataURLs) => {
    let form = new FormData();

    if (pictureFiles.length === 1) {
      form.append("File", pictureFiles[0], pictureFiles[0].name);

      setFile(form);
    } else {
      setFile(null);
    }
    // }
    // setIsLoadingFile(false);
  };
  const handleRole = (event) => {
    setRole(event.target.value);
  };

  const handleCallbackFullname = (childData) => {
    setFullname(childData);
  };
  const handleCallbackEmail = (childData) => {
    setEmail(childData);
  };
  const handleCallback = (childData) => {};
  const handleGroup = (childData) => {
    setGroup(group.concat(childData.label));
    setValue(childData);
  };
  const addNewPhoto = () => {
    let token = sessionStorage.getItem("token");
    try {
      fetch("https://api.ezmeets.live/v1/Users/UpdateAvatar?userID=" + id, {
        method: "put",
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
          if (
            responseJson.status === 401 ||
            responseJson.status === 404 ||
            responseJson.status === 500
          ) {
            Popup.alert("Проверьте правильность введенных данных");
            return;
          } else {
            setIsLoading(false);
          }
        });
    } catch (e) {}
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

      axios
        .post(api, {
          userName: email,
          password: "123456Password@",
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
          console.log(error);
          if (error.response.status == 401) {
            sessionStorage.setItem("token", "");
            localStorage.setItem("date", "");
            navigate("/login");
          } else {
          }
        });

      props.parentCallback("a");
    }
  };

  const updateUser = () => {
    if (
      checkEmailFinal(email) &&
      checkFullnameFinal(fullname) &&
      roleUser !== "" &&
      roleUser !== undefined
    ) {
      let token = sessionStorage.getItem("token");
      const api = "https://api.ezmeets.live/v1/Users/Update";
      let data = {
        id: id,
        userName: email,
        fullName: fullname,
        email: email,
        group: group[0],
      };
      axios
        .put(api, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res);
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            sessionStorage.setItem("token", "");
            localStorage.setItem("date", "");
            //navigate("/login");
          }
        });

      if (file !== null && file !== undefined) {
        addNewPhoto();
      }

      if (roleUser !== "Участник") {
        getPromotion();
      }
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "text/plain",
          "Content-Type": "application/json-patch+json",
        },
      };

      props.parentCallback("a");
    }
  };

  const buttonCreateNewParticipant = () => {
    setIsLoading(true);

    if (props.pageName === "Create") {
      createUser();
      setIsLoading(false);
    } else {
      updateUser();
    }
    props.parentCallback("a");
    window.location.reload(false);
  };
  const getPromotion = () => {
    const apiAdmin = "https://api.ezmeets.live/v1/Users/MakeAdmin?userID=" + id;
    const apiSuperAdmin = "https://api.ezmeets.live/v1/Users/MakeSuperAdmin";
    let token = sessionStorage.getItem("token");
    const secret = "(Swk9kWq7;/3(*d-_<7uXscp9u%tjWmn9u%tjWmn";

    if (roleUser === "Модератор") {
      axios
        .post(apiAdmin, null)
        .then((res) => {
          console.log(res);
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            sessionStorage.setItem("token", "");
            localStorage.setItem("date", "");
            //navigate("/login");
          }
        });
    }
    if (roleUser === "Администратор") {
      axios
        .post(apiAdmin + "?userID=" + id + "&secret=" + secret, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {})
        .catch(function (error) {
          // if (error.response.status == 401) {
          //   localStorage.setItem("token", "");
          //   localStorage.setItem("date", "");
          //   //navigate("/login");
          // }
        });
    }
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
  const [imgURL, setImageURL] = useState("");
  const showImage = (img) => {
    if (props.pageName === "Update" && (img !== null || img != undefined)) {
      return (
        <div
          style={
            {
              /*paddingRight: "200px" */
            }
          }
        >
          <a href={img} target="_blank">
            Предыдущая фотография
          </a>

          {/* <h3>Фото</h3>
          <img src={img} alt="new" /> */}
        </div>
      );
    }
  };

  const constCreateUserFirstTime = () => {
    if (props.pageName === "Update") {
      return (
        <div>
          <FormControl
            sx={{
              height: 80,
              // marginLeft: "130px",
            }}
            variant="standard"
          >
            <div className="imageUpload" style={{ marginLeft: "220px" }}>
              <ImageUploader
                withPreview={true}
                label={""}
                withIcon={false}
                buttonText="Загрузите фото участника"
                onChange={onDrop} //{this.onDrop}
                imgExtension={[".jpg", ".png", ".jpeg"]}
                singleImage={true}
                className="fileContainer"
              />
              {/* <div
                style={{
                  height: "120px",
                }}
              ></div> */}
            </div>
          </FormControl>
          <Box sx={{ display: "flex", flexWrap: "wrap", height: "10px" }}>
            <FormControl
              sx={{
                height: 120,
                // marginLeft: "130px",
              }}
              variant="standard"
            >
              <div style={{ height: "370px" }}></div>
              {showImage(imgURL)}
            </FormControl>
          </Box>
          <div style={{ height: "170px" }}></div>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl
              sx={{
                height: 90,
              }}
              variant="standard"
            >
              <p style={{ marginLeft: "-20px" }} id="labelParticipant">
                Группа
              </p>
              <CreatableAsyncPaginate
                value={value}
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
                  marginBottom: "-80px",
                  height: 50,
                }}
                variant="outlined"
                onClick={buttonCreateNewParticipant}
                text="sdfsddfsfdsfsd"
              >
                {buttonLabel(props.pageName)}
              </Button>
            </FormControl>
          </Box>
        </div>
      );
    } else {
      return (
        <FormControl
          sx={{
            height: 110,
          }}
          variant="standard"
        >
          <OneLine
            disabled={true}
            type="text"
            text="Логин"
            value={username}
            parentCallback={handleCallbackUsername}
            check={checkUserName}
            warning="Введите корректный логин"
          />
          <div style={{ height: "40px" }} />
          <Button
            style={{
              width: 150,
              marginLeft: "500px",
              marginBottom: "-50px",
              height: 50,
            }}
            variant="outlined"
            onClick={buttonCreateNewParticipant}
            text="sdfsddfsfdsfsd"
          >
            {buttonLabel(props.pageName)}
          </Button>
        </FormControl>
      );
    }
  };
  const onRole = (role) => {
    if (role === "Администратор") {
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
            <MenuItem disabled value={"Администратор"}>
              Администратор
            </MenuItem>
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
            {constCreateUserFirstTime()}
            {/* <FormControl
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
                />
                <div
                  style={{
                    height: "20px",
                  }}
                ></div>
                {showImage(imgURL)}
              </div>
            </FormControl>
            <div style={{ height: "170px" }}></div>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl
                sx={{
                  height: 90,
                }}
                variant="standard"
              >
                <p style={{ marginLeft: "-20px" }} id="labelParticipant">
                  Группа
                </p>
                <CreatableAsyncPaginate
                  value={value}
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
                    marginBottom: "-80px",
                    height: 50,
                  }}
                  variant="outlined"
                  onClick={buttonCreateNewParticipant}
                  text="sdfsddfsfdsfsd"
                >
                  {buttonLabel(props.pageName)}
                </Button>
              </FormControl>
            </Box> */}
          </FormControl>
        </Box>
      </div>
    </div>
  );
};
export default CreateNewParticipant;
