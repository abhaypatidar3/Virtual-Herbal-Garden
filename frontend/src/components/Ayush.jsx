import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
const Ayush = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  console.log(user);
  return (
    <div className={`w-screen bg-[url('src/assets/Ayush.jpg')] h-screen bg-cover bg-center flex flex-col sm:flex-row border border-b-black`}>
     {/* right side */}
     <div className='w-full sm:w-1/2 ml-[5vw] h-[60vh]'>
        <div className='bg-black/60 border-slate-500 border w-[90vw] sm:w-[35vw] h-[40vh] sm:h-[70vh] mt-[20vh] sm:mx-[6vw] rounded-3xl gap-0'>
            <div className='text-4xl sm:text-[70px] font-itim text-white px-[10vw] mt-[6vh] sm:mt-[10vh] flex justify-center w-full'>
                <h1>AYUSH</h1>
            </div>
            <p className='font-itim text-white text-xl sm:text-4xl text-center px-[4vw] mt-[2vh] sm:mt-[5vh]'>Discover the healing power of nature with our premium Ayurvedic and medicinal plant products, nurtured for your health and well-being. Embrace sustainable wellness through traditional wisdom and modern quality standards.</p>
        </div>
        <div className='flex flex-col sm:hidden h-[20vh] w-[70vw] mx-[17vw] mt-[10vh] gap-[5vh] justify-center'>
            <div>
              {
                isAuthenticated ? (<button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className='bg-[#556B2F] w-[50vw] h-[7vh] mx-[2vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition'>Logout</button>
                ):(
                  <button onClick={()=>loginWithRedirect()} className='bg-[#556B2F] w-[50vw] h-[7vh] mx-[2vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition'>Login</button>
                )
              }
            </div>
            <button className='bg-[#556B2F] w-[50vw] h-[7vh] mx-[2vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition'>SIGN UP</button>
        </div>
     </div>
     {/* left side */}
     <div className="hidden sm:block sm:w-50vw h-[50px] sm:h-screen">
        <div className='h-[40vh] w-[25vw] mx-[12vw] my-[10vh] sm:my-[30vh] flex flex-col gap-[5vh] justify-center'>
            <div>
              {
                isAuthenticated ? (<div className='bg-black/60 border-slate-500 border w-[30vw] sm:w-[25vw] h-[20vh] sm:h-[10vh] mt-[2vh] rounded-3xl gap-0'><div className='font-itim text-white text-xl sm:text-4xl text-start px-[4vw] mt-[2vh] sm:mt-[25px]'>Hello, {user.name}</div></div>) : null
              }
            </div>
            <div>
              {
                isAuthenticated ? (<button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className='bg-[#556B2F] w-[20vw] h-[7vh] mx-[3vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition'>LOGOUT</button>
                ):(
                  <button onClick={()=>loginWithRedirect()} className='bg-[#556B2F] w-[20vw] h-[7vh] mx-[3vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition'>LOGIN</button>
                )
              }
            </div>
            <button className={`bg-[#556B2F] w-[20vw] h-[7vh] mx-[3vw] rounded-3xl font-itim text-2xl hover:bg-[#6B8E23] transition ${isAuthenticated ? 'hidden' : 'block'}`}>SIGN UP</button>
        </div>
     </div>
    </div>
  )
}

export default Ayush
