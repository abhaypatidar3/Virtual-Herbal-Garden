import React from 'react'

const PlantCard = (props) => {
  return (
    <div className='w-[30vh] h-[33vh] sm:w-[36vh] sm:h-[39vh] border border-gray-400 flex flex-col justify-center rounded-3xl mb-[2vw] bg-slate-200 hover:scale-105'>
        <div className='ml-[2.3vh] sm:ml-[1.5vw]'>
            <img src={props.image} className='bg-slate-500 h-[22vh] sm:h-[27vh] w-[25vh] sm:w-[30vh] rounded-xl border border-gray-400' />
        </div>
        <p className='pl-[2.5vh] sm:pl-[1.7vw] font-itim text-2xl text-gray-800'>Plant: {props.name}</p>
        <p className='pl-[2.5vh] sm:pl-[1.7vw] font-itim text-base text-slate-600'>Region: {props.region}</p>
    </div>
  )
}

export default PlantCard
