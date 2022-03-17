import React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { AsyncPaginate } from "react-select-async-paginate";
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
    borderBottom: state.isSelected ? "solid 1px gray" : "solid 1px lightblue",
  }),
};
const Autocomplete = (props) => {
  return (
    <div>
      {" "}
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <FormControl sx={{ width: "30ch" }} variant="standard">
          <p id="labelParticipant">Участники конференции</p>
          <AsyncPaginate
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
          />
        </FormControl>
      </Box>
    </div>
  );
};
export default Autocomplete;
