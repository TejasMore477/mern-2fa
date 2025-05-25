import React from 'react'
import Navbar from '../components/Navbar'
import { useContext } from 'react'
import { Appcontext } from '../context/Appcontext'

function Home() {
    const {usersdata} = useContext(Appcontext);
    console.log(usersdata, "form userdata --------------------")
  return (
    <div className='p-10'>
        <Navbar/>
        <h1>hey {usersdata ? usersdata.name : "user!"}</h1>
        <button className='bg-green-200'>get started</button>
        
    </div>
  )
}

export default Home