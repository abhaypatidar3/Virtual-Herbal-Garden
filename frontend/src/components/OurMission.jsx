import React from 'react'

const OurMission = () => {
  return (
    <div className='h-[100vh] w-[100vw] flex flex-row'>
    {/* right side */}
        <div className='h-screen w-full sm:w-[60vw] right-0'>
            <div className='text-[70px] font-itim text-[#306203] mt-[22vh] mr-[4vw] flex justify-center w-full mb-[30px]'>
                <h1>OUR MISSION</h1>
            </div>
            <p className='font-itim text-black text-4xl text-center px-[6vw]'>Our mission is to promote holistic health and wellness by providing high-quality, sustainably sourced Ayurvedic and medicinal plant products. We are dedicated to preserving traditional knowledge while innovating for a healthier tomorrow.</p>
        </div>
        <div className='bg-black left-0 h-screen w-[40vw] hidden sm:block'>
                <div className={`bg-[url('src/assets/verticle_image2.jpg')] h-[90vh] w-[35vw] bg-cover bg-center mt-[6vh] ml-[50px] rounded-xl`}>
                </div>
        </div>
    </div>
  )
}

export default OurMission
