import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const Appcontext = createContext();

export const Appcontextprovider = (props) => {

    axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setisloggedin] = useState(false);
  const [usersdata, setuserdata] = useState(false);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/isauth");
      if (data.success) {
        setisloggedin(true);
        getUserData();
      }
    } catch (error) {
      toast.error(data.message);
    }
  };
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      console.log(data, "fonr data================");
      data.success ? setuserdata(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const values = {
    backendUrl,
    isLoggedin,
    setisloggedin,
    usersdata,
    setuserdata,
    getUserData,
  };

  return (
    <Appcontext.Provider value={values}>{props.children}</Appcontext.Provider>
  );
};
