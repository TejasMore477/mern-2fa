import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
function ResetPassword() {
  axios.defaults.withCredentials = true;
  const { backendUrl } = useContext(Appcontext);
  const inputRef = React.useRef([]);
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [newPassword , setpassword] = useState("");

  const [isEmailsent, setisemailsent] = useState();
  const [otp, setotp] = useState(0);
  const [isOtpSubmited, setISoptsubmitted] = useState(false);

  const handelemailsubbmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setisemailsent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const subbmitnewPasswords = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email , otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onsubmitOtp = async (e)=>{
e.preventDefault();
try {
        const otpArray = inputRef.current.map(e => e.value);
        setotp( otpArray.join(''));
        setISoptsubmitted(true);

} catch (error) {
    toast.error(error.message);
}
  }

  const handleInput = (e, index) => {
    const value = e.target.value;

    if (value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handelPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  return (
    <div className="p-10">
      ResetPassword
      {!isEmailsent && (
        <form onSubmit={handelemailsubbmit}>
          <p>enter emial</p>

          <input
            onChange={(e) => setemail(e.target.value)}
            value={email}
            type="email"
            placeholder="enter regsiter imali"
            required
          />
          {/* <input type="password" placeholder='enter new password' />
        <input type="password" placeholder='check password' /> */}
          <button>subbmit</button>
        </form>
      )}
      {/* // otpinpute form */}
      {!isOtpSubmited && isEmailsent && (
        <form
          onSubmit={onsubmitOtp}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-xl font-bold">reset passward</h2>
          <p className="text-sm text-gray-600">
            Enter the 6-digit OTP sent to your email
          </p>

          <div className="flex justify-center gap-2" onPaste={handelPaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRef.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  type="text"
                  maxLength="1"
                  required
                  className="w-10 h-10 text-center border border-gray-300 rounded"
                />
              ))}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Verify OTP
          </button>
        </form>
      )}
      {/* set new password */}
      {isOtpSubmited && isEmailsent && (
        <form onSubmit={subbmitnewPasswords}>
          <p>new passwords</p>

          <input
            type="password"
            onChange={(e) => setpassword(e.target.value)}
            value={newPassword }
            placeholder="enter new password"
          />

          <button>subbmit</button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
