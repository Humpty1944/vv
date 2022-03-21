import axios from "axios";
import { useNavigate } from "react-router-dom";

import Popup from "react-popup";
let token = localStorage.getItem("token");

const api = "https://api.ezmeets.live/v1/Users/GetGroups";

const options = [];

axios
  .get(api, { headers: { Authorization: `Bearer ${token}` } })
  .then((res) => {
    let help = res.data.filter((n) => n);
    for (let i = 0; i < help.length; i++) {
      options.push({
        value: help[i],
        label: help[i],
      });
    }
  })
  .catch(function (error) {
    Popup.alert("Пожалуйста, подождите несколько минут и повторите запрос");
  });
const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const loadOptions = async (search, prevOptions) => {
  await sleep(1000);

  let filteredOptions;
  if (!search) {
    filteredOptions = options;
  } else {
    const searchLower = search.toLowerCase();

    filteredOptions = options.filter(({ label }) =>
      label.toLowerCase().includes(searchLower)
    );
  }

  const hasMore = filteredOptions.length > prevOptions.length + 10;
  const slicedOptions = filteredOptions.slice(
    prevOptions.length,
    prevOptions.length + 10
  );

  return {
    options: slicedOptions,
    hasMore,
  };
};

export default loadOptions;
// axios
//   .get(api, { headers: { Authorization: `Bearer ${token}` } })
//   .then((res) => {
//     let help = res.data.filter((n) => n);

//     for (let i = 0; i < help.length; i++) {
//       options.push({
//         value: help[i],
//         label: help[i],
//       });
//     }
//   })
//   .catch(function (error) {
//     if (error.response.status == 401) {
//     }
//   });

// const sleep = (ms) =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, ms);
//   });

// const loadOptions = async (search, prevOptions) => {
//   await sleep(1000);

//   let filteredOptions;
//   if (!search) {
//     filteredOptions = options;
//   } else {
//     const searchLower = search.toLowerCase();

//     filteredOptions = options.filter(({ label }) =>
//       label.toLowerCase().includes(searchLower)
//     );
//   }

//   const hasMore = filteredOptions.length > prevOptions.length + 10;
//   const slicedOptions = filteredOptions.slice(
//     prevOptions.length,
//     prevOptions.length + 10
//   );

//   return {
//     options: slicedOptions,
//     hasMore,
//   };
// };

// export default loadOptions;
