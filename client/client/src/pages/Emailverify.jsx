import React from 'react';
import { useContext } from 'react';
import { Appcontext } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Emailverify() {
 axios.defaults.withCredentials = true;
    const {backendUrl,isLoggedin,usersdata,setuserdata} = useContext(Appcontext)
  const inputRef = React.useRef([]);
const navigate = useNavigate()
  const handleInput = (e, index) => {
    const value = e.target.value;

    if (value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index)=>{
    if(e.key === 'Backspace' && e.target.value === '' && index>0){
        inputRef.current[index - 1].focus();
    }
  };

  const handelPaste = (e)=>{
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index)=>{
        if(inputRef.current[index]){
            inputRef.current[index].value = char;
        }
    })
  }

  const onsubbmithandler = async (e)=>{
    try {
        e.preventDefault();
        const otpArray = inputRef.current.map(e => e.value);
        const otp = otpArray.join('');

        const {data} = await axios.post(backendUrl+'/api/auth/verify-account',{otp})
        if(data.success){
            toast.success(data.message);
            setuserdata();
            navigate('/')
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message);
    }
  }

  useEffect(()=>{
    isLoggedin && usersdata && usersdata.isAccountVerified && navigate('/')

  },[isLoggedin, usersdata])

  return (
    <div className="p-10 flex flex-col items-center">
      <form onSubmit={onsubbmithandler} className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Email Verification</h2>
        <p className="text-sm text-gray-600">Enter the 6-digit OTP sent to your email</p>

        <div className="flex justify-center gap-2" onPaste={handelPaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRef.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e)=>handleKeyDown(e,index)}
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
    </div>
  );
}

export default Emailverify;
