'use client'
import React from "react";

const Searchimg={
    image:"/images/find.png"
}
export default function(){
    return(
        <div className="flex items-center"> {/* Added flex container */}
            <input className="w-250 h-10 pl-8  bg-white border-b border-gray-300 
            focus:outline-none left-1 ml-6.5 rounded-lg focus:border-blue-500"/>
            <img 
            src={Searchimg.image}
            alt="search-bar"
            className="ml-2 w-9 h-9"/> {/* Added margin-left and fixed size */}
        </div>
    )
}