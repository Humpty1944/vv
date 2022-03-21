import React, { useEffect, useState } from "react";
import InputField from "../inputField/InputField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./OneLine.css";

const OneLine = (props) => {
  const [values, setValues] = React.useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });
  const [isError, setError] = useState(false);
  let stylesBox = {
    color: props.check ? "white" : "red",
    opacity: props.check ? 0 : 1,
    height: "60px",
    maxWidth: "350px",
    border: "solid",
    wordWrap: "break-word",
  };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    props.parentCallback(event.target.value);

    if (!props.check(event.target.value)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const isPassword = () => {
    if (props.type === "password") {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {values.showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      );
    }
    return;
  };
  const checkType = () => {
    if (props.type === "password") {
      return values.showPassword ? "text" : "password";
    }
    return props.type;
  };
  useEffect(() => {
    if (props.value !== null || props.value != "") {
      setValues({ ...values, ["password"]: props.value });
      props.parentCallback(props.value);
    }
  }, [props.value]);
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      <FormControl sx={{ width: "500px" }} variant="standard">
        <InputLabel
          error={isError}
          shrink={true}
          htmlFor="standard-adornment-password"
        >
          {props.text}
        </InputLabel>
        <Input
          disabled={props.disabled}
          id="standard-adornment-password"
          type={checkType()}
          value={values.password}
          onChange={handleChange("password")}
          error={isError}
          endAdornment={
            isPassword()
            // <InputAdornment position="end">
            //   <IconButton
            //     aria-label="toggle password visibility"
            //     onClick={handleClickShowPassword}
            //     onMouseDown={handleMouseDownPassword}
            //   >
            //     {values.showPassword ? <VisibilityOff /> : <Visibility />}
            //   </IconButton>
            // </InputAdornment>
          }
        />
        <FormHelperText id="component-error-text" error={isError}>
          {isError ? props.warning : ""}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};
export default OneLine;
