import React, { useEffect, useState } from "react";
import OneLine from "../../../components/oneLine/OneLine";
import "./Settings.css";
import Button from "@mui/material/Button";
import { Box, FormControl } from "@mui/material";
import axios from "axios";
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
const checkOldPassword = (e) => {
  return true;
};

const Settings = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  let isNameChanged = false;
  const checkRepeatPassword = (e) => {
    return e === "" || newPasswordRepeat === "" || e === newPasswordRepeat;
  };
  const saveChange = () => {};
  const handleCallbackFullname = (childData) => {
    setFullname(childData);
    isNameChanged = true;
  };
  const handleCallbackEmail = (childData) => {
    setEmail(childData);
  };
  const handleCallbackUsername = (childData) => {
    setUsername(childData);
  };
  const handleCallbackOldPassword = (childData) => {
    setOldPassword(childData);
  };
  const handleCallbackNewPassword = (childData) => {
    setNewPassword(childData);
  };
  const handleCallbackNewPasswordRepeat = (childData) => {
    setNewPasswordRepeat(childData);
  };

  const handleUpdate = () => {
    let token = localStorage.getItem("token");
    const api_fullName = "https://api.ezmeets.live/v1/Users/ChangeFullName";
    const api_Password = "https://api.ezmeets.live/v1/Users/ChangePassword";
    if (isNameChanged) {
      let data = {
        newFullName: fullname,
      };

      axios
        .post(api_fullName, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => console.log(res));
    }
    console.log(newPassword);
    if (
      oldPassword !== "" &&
      newPassword !== "" &&
      newPasswordRepeat !== "" &&
      newPassword === newPasswordRepeat &&
      newPassword !== undefined &&
      newPasswordRepeat !== undefined
    ) {
      let data = {
        currentPassword: oldPassword,
        newPassword: newPassword,
      };
      axios
        .post(api_Password, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => console.log(res));
    }
  };
  useEffect(() => {
    console.log("aaaaaa");
    const api = "https://api.ezmeets.live/v1/Users/CurrentUser";
    let token = localStorage.getItem("token");
    try {
      axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          console.log(res.data);
          setFullname(res.data.fullName);
          setEmail(res.data.email);
          setUsername(res.data.userName);
        })
        .catch(function (error) {
          console.log(error.response.status); // 401
          console.log(error.response.data.error); //Please Authenticate or whatever returned from server

          alert(error.response.data.error);
        });
    } catch (e) {
      console.log("resdsdsads");
    }
  }, []);
  return (
    <div>
      <h1 className="textName">Настройки пользователя</h1>
      <div style={{ height: "50px" }} />
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
              <OneLine
                type="text"
                text="ФИО"
                parentCallback={handleCallbackFullname}
                value={fullname}
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
                disabled={true}
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
            </FormControl>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl
                sx={{
                  height: 110,
                }}
                variant="standard"
              >
                <OneLine
                  type="password"
                  text="Старый пароль"
                  parentCallback={handleCallbackOldPassword}
                  check={checkOldPassword}
                  warning=""
                />
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl
                sx={{
                  height: 110,
                }}
                variant="standard"
              >
                {" "}
                <OneLine
                  type="password"
                  text="Новый пароль"
                  parentCallback={handleCallbackNewPassword}
                  check={checkPassword}
                  warning="В пароле должно быть 6 символов и хотя бы одна цифра, заглавная и строчная буквы"
                />
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl
                sx={{
                  height: 110,
                }}
                variant="standard"
              >
                <OneLine
                  type="password"
                  text="Подтвердить новый пароль"
                  parentCallback={handleCallbackNewPasswordRepeat}
                  check={checkPassword}
                  warning="В пароле должно быть 6 символов и хотя бы одна цифра, заглавная и строчная буквы"
                />
                <div style={{ height: "50px" }} />
                <Button
                  style={{
                    width: 150,
                    marginLeft: "500px",
                    marginBottom: "-100px",
                    height: 50,
                  }}
                  onClick={handleUpdate}
                  variant="outlined"
                >
                  Сохранить
                </Button>
              </FormControl>
            </Box>
          </FormControl>
        </Box>
      </div>
    </div>
    // <div className="settings">
    //   <OneLine
    //     type="text"
    //     placeholder=""
    //     value={fullname}
    //     onChange={setFullname}
    //     className="inputField"
    //     text="ФИО"
    //     warning="sdasjhkjhkfgfdgfdddsvsdjhjkhjhjkhjjhjkhjkhjhgyuguyguygygygdsada"
    //     check={false}
    //   ></OneLine>
    //   <OneLine
    //     type="text"
    //     placeholder=""
    //     value={email}
    //     onChange={setEmail}
    //     className="email"
    //     text="Почта"
    //     warning="sdasjhkjhkfgfdgfdddsvsdjhjkhjhjkhjjhjkhjkhjhgyuguyguygygygdsada"
    //     check={false}
    //   ></OneLine>
    //   <OneLine
    //     type="text"
    //     placeholder=""
    //     value={username}
    //     onChange={setUsername}
    //     className="inputField"
    //     text="Логин"
    //     warning="sdasjhkjhkfgfdgfdddsvsdjhjkhjhjkhjjhjkhjkhjhgyuguyguygygygdsada"
    //     check={false}
    //   ></OneLine>
    //   <OneLine
    //     type="password"
    //     placeholder=""
    //     value={oldPassword}
    //     onChange={oldPassword}
    //     className="inputField"
    //     text="Старый пароль"
    //     warning="sdasjhkjhkfgfdgfdddsvsdjhjkhjhjkhjjhjkhjkhjhgyuguyguygygygdsada"
    //     check={false}
    //   ></OneLine>
    //   <OneLine
    //     type="password"
    //     placeholder=""
    //     value={newPassword}
    //     onChange={newPassword}
    //     className="inputField"
    //     text="Новый пароль"
    //     warning="sdasjhkjhkfgfdgfdddsvsdjhjkhjhjkhjjhjkhjkhjhgyuguyguygygygdsada"
    //     check={false}
    //   ></OneLine>
    //   <OneLine
    //     type="password"
    //     placeholder=""
    //     value={newPasswordRepeat}
    //     onChange={setNewPasswordRepeat}
    //     className="inputField"
    //     text="Подтвердить новый пароль"
    //     warning="sdasjhkjhkfgfdgfdddsvsdjhjkhjhjkhjjhjkhjkhjhgyuguyguygygygdsada"
    //     check={false}
    //   ></OneLine>

    //   <Button
    //     style={{
    //       bottom: 0,
    //       // right: 0,
    //       marginRight: "-50pc",
    //       top: "unset",
    //       left: "unset",
    //     }}
    //     variant="outlined"
    //   >
    //     Сохранить
    //   </Button>
    // </div>
  );
};
export default Settings;
