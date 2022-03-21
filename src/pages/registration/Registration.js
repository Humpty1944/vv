import { Box, Button, FormControl } from "@material-ui/core";
import React, { useState } from "react";
import OneLine from "../../components/oneLine/OneLine";
import { useNavigate } from "react-router-dom";

import Popup from "react-popup";
import "./Registration.css";
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

const Registration = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const navigate = useNavigate();
  const checkRepeatPassword = (e) => {
    return e === "" || password === "" || e === password;
  };

  const handleCallbackFullname = (childData) => {
    setFullname(childData);
  };
  const handleCallbackEmail = (childData) => {
    setEmail(childData);
  };
  const handleCallbackUsername = (childData) => {
    setUsername(childData);
  };
  const handleCallbackPassword = (childData) => {
    setPassword(childData);
  };
  const handleCallbackPasswordRepeat = (childData) => {
    setPasswordRepeat(childData);
  };
  const buttonDecline = () => {
    navigate(-1);
  };
  const checkAllFields = () => {
    if (
      !checkEmail(email) &&
      !checkPassword(password) &&
      !checkFullName(fullname) &&
      !checkUserName(username) &&
      !checkRepeatPassword(passwordRepeat) &&
      email !== "" &&
      username !== "" &&
      fullname !== "" &&
      passwordRepeat !== "" &&
      password !== ""
    ) {
      return false;
    }
    return true;
  };
  const buttonRegister = () => {
    if (
      checkEmail(email) &&
      checkPassword(password) &&
      checkFullName(fullname) &&
      checkUserName(username) &&
      checkRepeatPassword(passwordRepeat) &&
      email !== "" &&
      username !== "" &&
      fullname !== "" &&
      passwordRepeat !== "" &&
      password !== ""
    ) {
      try {
        let res = fetch("https://api.ezmeets.live/v1/Users/Register", {
          method: "post",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: username,
            password: password,
            fullName: fullname,
            email: email,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            if (responseJson.status === "Error") {
              Popup.alert(responseJson.message);
            } else {
              navigate("/login");
            }
          });
      } catch (e) {
        console.log(e);
      }
    } else {
      Popup.alert("Данные введены не коректно");
    }
  };
  return (
    <div className="registration">
      <div className="form">
        <h1>Регистрация</h1>
        <div id="fieldsInput">
          <OneLine
            type="text"
            text="ФИО"
            parentCallback={handleCallbackFullname}
            check={checkFullName}
            warning="Необходима как минимум фамилия и  имя "
          />
          <div style={{ height: "20px" }}></div>
          <OneLine
            type="email"
            text="Почта"
            parentCallback={handleCallbackEmail}
            check={checkEmail}
            warning="Введите корректную почту"
          />
          <div style={{ height: "20px" }}></div>
          <OneLine
            type="text"
            text="Логин"
            parentCallback={handleCallbackUsername}
            check={checkUserName}
            warning="Введите корректный логин"
          />
          <div style={{ height: "20px" }}></div>
          <OneLine
            type="password"
            text="Пароль"
            parentCallback={handleCallbackPassword}
            check={checkPassword}
            warning="В пароле должно быть от 6 до 12 символов и хотя бы одна цифра, заглавная, строчная буквы, специальный символ"
          />
          <div style={{ height: "20px" }}></div>
          <OneLine
            type="password"
            text="Подтвердить пароль"
            parentCallback={handleCallbackPasswordRepeat}
            check={checkRepeatPassword}
            warning="Пароль не совпадает"
          />
        </div>
        <div style={{ height: "50px" }}></div>

        <div className="buttons">
          <Button variant="outlined" onClick={buttonRegister}>
            Регистрация
          </Button>

          <Button variant="outlined" onClick={buttonDecline}>
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Registration;
