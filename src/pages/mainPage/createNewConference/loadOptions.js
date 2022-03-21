// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import Popup from "react-popup";
// let token = localStorage.getItem("token");

// const api = "https://api.ezmeets.live/v1/Users/GetGroups";
// let options = [];
// function remove_duplicates_es6(arr) {
//   let s = new Set(arr);
//   let it = s.values();
//   return Array.from(it);
// }
// let a = axios
//   .get(api, { headers: { Authorization: `Bearer ${token}` } })
//   // .then((res) => {
//   //   let help = res.data.filter((n) => n);

//   //   for (let i = 0; i < help.length; i++) {
//   //     options.push({
//   //       value: help[i],
//   //       label: help[i],
//   //     });
//   //   }
//   //   console.log(options);
//   // })
//   .catch(function (error) {
//     Popup.alert("Пожалуйста, подождите несколько минут и повторите запрос");
//   });

// let res = a.data;
// let help = res.filter((n) => n);

// for (let i = 0; i < help.length; i++) {
//   options.push({
//     value: help[i],
//     label: help[i],
//   });
// }

// //let options = getOptions();
// //options = remove_duplicates_es6(options);
// const sleep = (ms) =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, ms);
//   });

// const loadOptions = async (search, prevOptions) => {
//   await sleep(1000);
//   //let opt = getOptions();

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
