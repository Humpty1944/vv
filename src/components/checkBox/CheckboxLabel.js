import React, { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function CheckboxLabel(props) {
  const [check, setCheck] = useState(false);
  const changeList = (e) => {
    setCheck(!check);

    props.parentCallback(check);
    // e.preventDefault();
  };
  return (
    <div>
      <FormControlLabel
        sx={{ m: "20px", marginRight: "330px" }}
        control={<Checkbox onChange={changeList} />}
        label={props.text}
      />
    </div>
  );
}
