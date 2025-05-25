import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Appcontext } from '../context/Appcontext'
import { useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function Navbar() {
    const navigate = useNavigate()
    const {usersdata, backendUrl, setuserdata,setisloggedin} = useContext(Appcontext)
  
    const sendVerficationEmail = async ()=>{
        try {
           axios.defaults.withCredentials = true;
           const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp') 
        if(data.success){
            navigate('/email-verify');
            toast.success(data.message)
        }else{
            toast.error(data.message);
        }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const logout = async () =>{
        try {
            axios.defaults.withCredentials = true;
            const {data} = await axios.post( backendUrl + '/api/auth/logout')
            data.success && setisloggedin(false);
            data.success && setuserdata(false)
            navigate('/')
        } catch (error) {
            toast.error(data.message)
        }
    }
  
    return (
    <div onClick={()=>navigate('/login')} className='w-screen bg-red-500'>
        {usersdata ? <div className='size-7 bg-red-900 text-white relative group'>{usersdata.name[0].toUpperCase()}
            <div className='absolute top-1 right-[-800%] w-[550%] bg-black'>
                <ul className='flex flex-col gap-3 font-bold'>
                    {!usersdata.isAccountVerified &&  <li onClick={(e)=>{
                        e.stopPropagation();
                        sendVerficationEmail();
                    }}>verify email</li>}
                   
                    <li onClick={(e)=>{e.stopPropagation();
                         logout()}}>logout</li>
                </ul>
            </div>
        </div> : <button className='bg-red-300'>Login button</button>}
    </div>
  )
}

export default Navbar