import React from 'react'

const ExpPlantsHero = () => {
  return (
    <div className={`w-[100vw] bg-[url('src/assets/expPlants.jpg')] h-screen bg-cover bg-center border border-t-black`}>
      <div className='text-[60px] sm:text-[70px] font-itim text-[#306203] mt-[6vh] mr-[4vw] flex justify-center text-center w-full mb-[30px]'>
        <h1>Explore Plants</h1>
      </div>
      <div className=' h-[50vh] w-[80vw] sm:w-[50vw] rounded-3xl mx-[10vw] sm:mx-[25vw] my-[2vh]'>
        <p className='font-itim text-2xl sm:text-3xl text-center px-0 sm:mx-[2vw] sm:pb-[5vh]'>
          Discover a diverse collection of medicinal and Ayurvedic plants with detailed information on their benefits, uses, and cultivation tips to help you embrace natural healing and wellness.
        </p>
        <button className='bg-[#556B2F] font-itim w-[60vw] sm:w-[20vw] h-[7vh] rounded-3xl mx-[10vw] sm:mx-[15vw] text-2xl mt-8 sm:mt-0  text-white hover:bg-[#6B8E23] transition'>
          Explore More
        </button>
      </div>
    </div>
  )
}

export default ExpPlantsHero
