import React from 'react'
import PlantCard from '../components/PlantCard'
import { plants } from '../data/plants'

const Explore = () => {
  return (
    <div className='bg-[#E1EEBC] w-full h-full pb-[2vw]'>
      <div className='pt-[13vh] pl-[5vw]'>
        {/* top */}
        <div className='flex flex-row gap-[1vw] pb-2'>
          <p className='text-3xl font-itim '>Explore Plants:</p>
          <select name="" id="filter" className='border border-gray-600 rounded-full w-[30vw] sm:w-[12vw] text-xl text-center h-[37px] mt-[3px] bg-[#e5eccf] font-itim'>
            <option value="filter" className='font-itim pt-[5px]'>FILTER</option>
            <option value="filter" className='font-itim'>FILTER</option>
            <option value="filter" className='font-itim'>FILTER</option>
            <option value="filter" className='font-itim'>FILTER</option>
          </select>
        </div>
      </div>
      <div className='border bg-[#EAFFD8] border-gray-400 mx-[5vw] h-[100vh] overflow-y-auto grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-[3vh] sm:pt-[5vh] px-[5vw] sm:px-0 gap-[2vh] sm:pl-[4vw] rounded-2xl'>
         {
           plants.map((plant,index)=>(
            <PlantCard name={plant.name} region={plant.region} key={index} image={plant.image}/>
           ))
         }
      </div>
    </div>
  )
}

export default Explore
