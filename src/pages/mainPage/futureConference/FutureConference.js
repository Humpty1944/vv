import React, { useEffect, useRef, useState } from "react";
import "./FutureConference.css";
import MaterialTable from "material-table";
import { AddBox, ArrowDownward, AssessmentRounded } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { frCA } from "date-fns/locale";

// const showInfo = (rowData) => {
//   sessionStorage.setItem("fut_conf", rowData);
//   console.log(rowData);
// };
const FutureConference = (props) => {
  const columns = [
    {
      label: "Название",
      name: "name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Дата",
      name: "date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      label: "Участники",
      name: "participants",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "URL",
      name: "url",
      options: {
        filter: false,
        sort: true,
      },
    },
  ];
  //let data = [];
  const navigate = useNavigate();
  const ref = useRef(null);
  const [size, setSize] = useState();
  const [id, setId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const showInfo = (rowData) => {
    var ind = dataUsers.findIndex((object) => {
      return object.date === rowData[1] && object.name === rowData[0];
    });
    console.log(rowData);
    console.log(ind);
    console.log(data_index);
    sessionStorage.setItem("fut_conf", rowData);
    sessionStorage.setItem("fut_conf_date", new Date(rowData[1]));
    //sessionStorage.setItem("fut_conf_ind", rowData);
    //sessionStorage.setData("fut_conf", rowData);
    props.parentCallback(data_index[ind]);
  };
  const handleLoading = () => {
    console.log(isLoading)
    setIsLoading(false);
    }
    
    useEffect(()=>{
      console.log(isLoading)
    window.addEventListener("load",handleLoading);
    return () => window.removeEventListener("load",handleLoading);
    },[])
 
  async function deleteRequest(rowsDeleted){
    let token = localStorage.getItem("token");
    console.log(token)
    var ind = dataUsers.findIndex((object) => {
      return object.date === rowsDeleted[1] && object.name === rowsDeleted[0];
    });
    console.log(rowsDeleted.data[0].index);
    
    console.log(data_index[rowsDeleted.data[0].index]);

    for (let i=0;i<rowsDeleted.data.length;i++){
      let idUsr = data_index[rowsDeleted.data[i].index]
      let apiURL = "https://api.ezmeets.live/v1/Meetings/DeleteScheduledMeeting"+ "?meetingID="+idUsr;
      fetch(apiURL, {
        method: 'DELETE',
        headers: {
          ContentType: "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res)=>console.log(res))
    }
    // let apiURL = "https://api.ezmeets.live/v1/Meetings/DeleteScheduledMeeting"+ "?meetingID="+data_index[rowsDeleted.data[0].index] ;
    // fetch(apiURL, {
    //   method: 'DELETE',
    //   headers: {
    //     ContentType: "multipart/form-data",
    //     Accept: "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // }).then((res)=>console.log(res))
    
    // let url = axios.delete(apiURL,
    //   {
    //     headers: {
    //       Authorization:{ Authorization: `Bearer ${token}`}
    //     }
    //   })
   // let res = await url;
   // console.log(res);
    //return urlRes;
  }
  const options = {
    filterType: "checkbox",
    downloadOptions: { filename: "futureConference.csv", separator: ";" },
    rowsPerPage: 6,
    onRowClick: showInfo,
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      console.log(rowsDeleted)
      deleteRequest(rowsDeleted)
      // const idsToDelete = dataRows.map(d => data[d.dataIndex].id); // array of all ids to to be deleted
      // http.delete(idsToDelete, res).then(window.alert('Deleted!')); // your delete request here
    }
  };
  const handleResize = (e) => {
    setSize(window.innerWidth);
  };
  useEffect(() => {
    setSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
  }, []);
  const [dataUsers, setData] = useState([]);
  const [data_index, setIndexes] = useState([]);
  // const data_index = [123, 435345, 657846746, 12312, 345643, 435643];

  const [a, setURL] = useState([])
  async function fetchData(arr, token) {
    let urlRe = []
    var headers = {
      withCredentials: true,
      headers: { 'Authorization': 'Bearer ' + token }
    }
    for (let i=0;i<arr.length;i++){
      let urlRes=""
      try{
      let f = await fetch('https://api.ezmeets.live/v1/Meetings/Join?meetingID='+arr[i], {
        method: 'post',
        headers: {'Authorization': 'Bearer ' + token,},
    
       }).then((response) => {
        setURL()
        urlRe.push(response)
       return response
    })
       let ee = await f
      //  console.log(ee.url)
      //  urlRe.push(ee.url)
      }catch(e){
        setURL(prevPosts => [...prevPosts,  "Ссылка не готова"])
        //ret.push("Ссылка не готова")
      }
     // ret.push(urlRes)
   
    }
    console.log("sddsfdsjfdksfjdfdsfhdjshfgjdhgdhsghdsjhgudshfusdhfudshf")
    console.log(a)
   return a;
   
   
    // let apiURL = "https://api.ezmeets.live/v1/Meetings/Join?meetingID=" + name;
    // api
    // let url = axios.post(apiURL, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // let urlRes = await s;
    // console.log(urlRes);
    //return urlRes;
  }
  async function fetchAllData(){
    const api = "https://api.ezmeets.live/v1/Meetings/GetAll";
  let token = localStorage.getItem("token");
   let ax = await axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .catch(function (error) {
          //alert(error.response)
          console.log(error.message); // 401
          console.log(error); //Please Authenticate or whatever returned from server
         // alert(error.response)
           if (error.response.status == 403 || error.response.status == 401) {
            localStorage.setItem("token", "");
            localStorage.setItem("date", "");
            navigate("/login");
          }
        });
        let res = await ax.data
       
        
          let d = [];
          let idd = [];
          for (let i = 0; i < res.length; i++) {
           
        
            let dateCur = new Date(res[i].startTime).toLocaleString();
          
            if (res[i].hasEnded===false){
            d.push({
              name: res[i].name,
              date: dateCur,
              participants: res[i].allowedUsers.length,
              url: "resURL",
            });
            idd.push(res[i].meetingID);
           }
          }
          let urlF = fetchData(idd, token)
          for (let i=0;i<d.length;i++){
            console.log(urlF[i])
            d[i]['url'] = urlF[i]
          }

          setData(d)
          setIndexes(idd)
          setIsLoading(false)
      
  }
  useEffect(() => {
    fetchAllData()
    // const api = "https://api.ezmeets.live/v1/Meetings/GetAll";
    // let token = localStorage.getItem("token");
    // try {
    //   axios
    //     .get(api, { headers: { Authorization: `Bearer ${token}` } })
    //     .then((res) => {
    //       console.log("ddddddddddddddddddddddddddddddddddddddddd");
    //       console.log(res.data);
    //       let d = [];
    //       let idd = [];
    //       for (let i = 0; i < res.data.length; i++) {
           
    //         let resURL = fetchData(res.data[i].meetingID, token);
        
    //         let dateCur = new Date(res.data[i].startTime).toLocaleString();
            
    //         if (res.data[i].hasEnded===true){
    //         d.push({
    //           name: res.data[i].name,
    //           date: dateCur,
    //           participants: res.data[i].allowedUsers.length,
    //           url: resURL,
    //         });
    //         idd.push(res.data[i].meetingID);
           
    //       }
    //       }
    //       console.log('aaaaaassdasfklsdfjdsf')
    //       console.log(d)
    //       setData(d);
    //       setIndexes(idd);
    //       setIsLoading(false)
    //       // setFullname(res.data.fullName);
    //       // setEmail(res.data.email);
    //       // setUsername(res.data.userName);
    //     })
    //     .catch(function (error) {
    //       //alert(error.response)
    //       console.log(error.message); // 401
    //       console.log(error); //Please Authenticate or whatever returned from server
    //      // alert(error.response)
    //        if (error.response.status == 403 || error.response.status == 401) {
    //         localStorage.setItem("token", "");
    //         localStorage.setItem("date", "");
    //         navigate("/login");
    //       }
    //     });
    // } catch (e) {
    //   console.log(e);
    // }
    // console.log(dataUsers);

  }, []);
  return (
    !isLoading ? (
      <div
      ref={ref}
      style={{
        margin: "0 auto",
        marginTop: size < 970 ? "640px" : "60px",
        width: "calc(100vw / 2)",
        /* height: calc(100vh / 2); */
        position: "relative",
        cursor: "pointer",
        // overflow: size < 970 ? "scroll" : "hidden",
      }}
    >
      <MUIDataTable
        title={"Предстоящие конференции"}
        data={dataUsers}
        columns={columns}
        options={options}
      />
    </div>
    ):(
<ReactLoading type={'spin'} color="#000" />
    )



  
  );
};
export default FutureConference;
