import React from 'react'
import { assets } from '../assets/assets'

const PlantCard = (props) => {
  return (
    <div className='w-[30vh] h-[33vh] sm:w-[36vh] sm:h-[39vh] border border-[#008080] flex flex-col justify-center rounded-3xl mb-[2vw] bg-white hover:scale-105 duration-150 hover:shadow-[0_0_20px_2px_rgba(0,128,128,0.4)] hover:border-[#00a0a0]'>
        <div className='ml-[2.3vh] sm:ml-[1.5vw]'>
            <img src={props.image} className='bg-slate-500 h-[22vh] sm:h-[27vh] w-[25vh] sm:w-[30vh] rounded-3xl border border-gray-400' />
        </div>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col'>
            <p className='pl-[2.5vh] pt-2 sm:pl-[1.7vw] font-itim text-2xl text-gray-800'>Plant: {props.name}</p>
            <p className='pl-[2.5vh] sm:pl-[1.7vw] font-sans italic text-base text-slate-600'>Scientific Name: {props.SN}</p>
          </div>
          <img src={assets.bookmark} className='w-5 h-5 mt-7 mr-7 cursor-pointer' alt="bookmark image" />
        </div>
    </div>
  )
}

export default PlantCard
