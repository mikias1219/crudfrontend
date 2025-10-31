'use client'
import React from "react";

const HeaderComponents = {
  title: "My-Music-library-Manager-App",
  image: "/file.svg"
}

export default function () {
  return (

    <div className=" flex relative bg-amber-500 items-center justify-between">
      <img src={HeaderComponents.image} 
      alt="logo"
      className="w-10 h-10 object-contain" />
      <h1 className="font-sans text-xl md:text-2xl text-gray-800 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {HeaderComponents.title}</h1>
      </div>
      
   
  )
}
