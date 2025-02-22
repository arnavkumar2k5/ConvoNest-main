import Load from '@/lib/load'
import { animationDefaultOptions } from '@/lib/utils'
import React from 'react'
import Lottie from 'react-lottie'
import Loader from './box'

function EmptyContainer() {
    return (
        <div className='hidden md:flex flex-1 h-screen md:bg-[#E9EAEB] md:flex-col justify-center items-center border border-r-1 border-white duration-1000'>
            <Loader/>
            <h1 className="font-extrabold text-center text-7xl text-[#1565C0] p-2 pt-4" style={{fontFamily: "cursive"}}><span className="text-9xl font-extrabold">C</span>ONVO<span className="text-9xl">N</span>EST</h1>
            <span className='text-4xl font-semibold text-[#1565C0] mt-2' style={{fontFamily: "cursive"}}>..MAKE YOUR CHAT EXPERIENCE SMOOTH..</span>
        </div>
    )
}

export default EmptyContainer
