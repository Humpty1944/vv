import { Box, Button, FormControl } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import OneLine from "../../components/oneLine/OneLine";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Password } from "@mui/icons-material";
import Popup from "react-popup";
import PopupReact from "react-popup/dist/Popup.react";
const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const buttonSignIn = (e) => {
    try {
      let res = fetch("https://api.ezmeets.live/v1/Users/Login", {
        method: "post",

        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: login,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (
            responseJson.status === 401 ||
            responseJson.status === 404 ||
            responseJson.status === 500
          ) {
            Popup.alert("Проверьте правльность введенных данных");
            return;
          } else {
            sessionStorage.setItem("token", responseJson.token);
            localStorage.setItem("date", new Date(responseJson.expiration));
            navigate("/");
          }
        });
    } catch (e) {
      Popup.alert(e.message);

      return;
    }
  };
  const handleCallbackLogin = (childData) => {
    setLogin(childData);
  };
  const handleCallbackPassword = (childData) => {
    setPassword(childData);
  };
  const handleCallbackFullname = (childData) => {
    setLogin(childData);
  };
  const checkFullName = (e) => {
    return true;
  };
  const buttonRegistration = (e) => {
    navigate("/registration");
  };
  useEffect(() => {
    if (new Date(localStorage.getItem("date")) >= new Date()) {
      navigate("/");
    }
  }, []);

  return (
    <div className="loginPage">
      <div className="form">
        <h1>Вход</h1>
        <div id="fieldsInput">
          <OneLine
            type="text"
            text="Логин"
            parentCallback={handleCallbackFullname}
            check={checkFullName}
            warning="Необходима фамилия, имя и отчество"
          />
          <div style={{ height: "20px" }}></div>
          <OneLine
            type="password"
            text="Пароль"
            parentCallback={handleCallbackPassword}
            check={checkFullName}
            warning="Необходима фамилия, имя и отчество"
          />
        </div>
        {/* <p id="forgetPassword">Забыли пароль?</p> */}
        <div className="buttons">
          <Button variant="outlined" onClick={buttonSignIn}>
            Войти
          </Button>

          <Button variant="outlined" onClick={buttonRegistration}>
            Регистрация
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Login;
