import React, { useEffect, useState } from "react";
import OneLine from "../../../components/oneLine/OneLine";
import "./Settings.css";
import Button from "@mui/material/Button";
import { Box, FormControl } from "@mui/material";
import axios from "axios";
import Popup from "react-popup";
import ImageUploader from "react-images-upload";
import { NavLink, useNavigate } from "react-router-dom";

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
  return (
    e === "" ||
    e.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/
    )
  );
};
const checkOldPassword = (e) => {
  return true;
};

const Settings = (props) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [file, setFile] = useState();
  const role = sessionStorage.getItem("roleUser");
  let isNameChanged = false;
  const checkRepeatPassword = (e) => {
    return e === "" || newPasswordRepeat === "" || e === newPassword;
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

  const checkRole = (role) => {
    if (role !== "SuperAdmin") {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <FormControl
            sx={{
              height: 180,
              marginLeft: "30px",
            }}
            variant="standard"
          >
            <div className="imageUpload">
              <ImageUploader
                withPreview={true}
                label={""}
                withIcon={false}
                buttonText="Загрузите свое фото"
                onChange={onDrop}
                imgExtension={[".jpg", ".png", ".jpeg"]}
                singleImage={true}
                className="fileContainer"
              />
              <div
                style={{
                  height: "50px",
                }}
              ></div>
            </div>
          </FormControl>
        </Box>
      );
    }
  };
  const handleUpdate = () => {
    let token = localStorage.getItem("token");
    const api_fullName =
      "https://api.ezmeets.live/v1/Users/ChangeFullName?newFullName=";
    const api_Password = "https://api.ezmeets.live/v1/Users/ChangePassword?";
    const api_Avatar = "https://api.ezmeets.live/v1/Users/ChangeAvatar";
    if (isNameChanged) {
      axios
        .post(api_fullName + fullname, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          //Popup.alert("Данные изменены");
          props.parentCallback("yes");
        });
    }

    if (
      oldPassword !== "" &&
      newPassword !== "" &&
      newPasswordRepeat !== "" &&
      newPassword === newPasswordRepeat &&
      newPassword !== undefined &&
      newPasswordRepeat !== undefined
    ) {
      // let data = {
      //   currentPassword: oldPassword,
      //   newPassword: newPassword,
      // };
      axios
        .post(
          api_Password +
            "currentPassword=" +
            oldPassword +
            "&newPassword=" +
            newPassword,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          Popup.alert("Данные изменены");
          props.parentCallback("yes");
        });
    }
    // console.log(file);
    if (file !== null || file !== undefined || file !== "") {
      console.log(file);
      try {
        fetch(api_Avatar, {
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
            if (
              responseJson.status === 401 ||
              responseJson.status === 404 ||
              responseJson.status === 500
            ) {
              Popup.alert("Проверьте правльность введенных данных");
              return;
            } else {
              window.location.reload(false);
              // setIsLoading(false);
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    const api = "https://api.ezmeets.live/v1/Users/CurrentUser";
    let token = localStorage.getItem("token");
    try {
      axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setFullname(res.data.fullName);
          setEmail(res.data.email);
          setUsername(res.data.userName);
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("date", "");
            navigate("/login");
          } else {
            Popup.alert(
              "Пожалуйста, подождите несколько минут и повторите запрос"
            );
          }
        });
    } catch (e) {}
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
            {checkRole(role)}
            {/* <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl
                sx={{
                  height: 180,
                }}
                variant="standard"
              >
                <div className="imageUpload">
                  <ImageUploader
                    withPreview={true}
                    label={""}
                    withIcon={false}
                    buttonText="Загрузите свое фото"
                    onChange={onDrop}
                    imgExtension={[".jpg", ".png", ".jpeg"]}
                    singleImage={true}
                    className="fileContainer"
                  />
                  <div
                    style={{
                      height: "50px",
                    }}
                  ></div>
                </div>
              </FormControl>
            </Box> */}
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
                  warning="В пароле должно быть от 6 до 12 символов и хотя бы одна цифра, заглавная, строчная буквы, специальный символ"
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
                  check={checkRepeatPassword}
                  warning="Пароли должны совпадать"
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
  );
};
export default Settings;
