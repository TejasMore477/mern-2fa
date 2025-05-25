import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const { backendUrl, setisloggedin, getUserData } = useContext(Appcontext);

  const [state, setState] = useState("Sign up");
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpASSWORD] = useState("");

  const onSubmitHandler  = async (e) => {
    try {
      e.preventDefault();
      //to send cookies with the reauest
      axios.defaults.withCredentials = true;

      if (state === "Sign up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if (data.sucess) {
          setisloggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          setisloggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }

    } catch (error) {
     toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };
  return (
    <div className="p-10">
      <h2>
        {state === "Sign up"
          ? "create your account"
          : "loginin tot your account!"}
      </h2>
      {/* <p>{state === 'Sign up' ? "create your account" : "loginin tot your account!"}</p> */}

      <form onSubmit={onSubmitHandler } className="p-20 flex flex-col gap-2">
        {state === "Sign up" && (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="full name"
            required
          />
        )}
        <input
          onChange={(e) => setemail(e.target.value)}
          value={email}
          type="email"
          placeholder="email ID"
          required
        />

        <input
          onChange={(e) => setpASSWORD(e.target.value)}
          value={password}
          type="password"
          placeholder="password"
          required
        />
        <p
          onClick={() => navigate("/reset-password")}
          className="bg-red-900 text-white cursor-pointer"
        >
          forgot password?
        </p>
        <button className="bg-red-300">{state}</button>
      </form>

      {state === "Sign up" ? (
        <p>
          Already have an account?
          <span onClick={() => setState("Login")}> Login here</span>
        </p>
      ) : (
        <p>
          dont have an sccount?
          <span onClick={() => setState("Sign up")}> signup here</span>
        </p>
      )}
    </div>
  );
}

export default Login;
