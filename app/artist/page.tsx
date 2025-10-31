'use client'
import React from "react"
import { buttons } from "../page"
import { useState } from "react"
import ArtistCard from "@/components/forms/ArtistFormCard";
import Searchbar from "@/components/ui/Searchbar";
export default function Artist(){
    const [showCard, setShowCard] = useState(false);
        
    const handleAddClick = () => {
        setShowCard(true)
    }
        
    const handleCloseCard = () => {
        setShowCard(false)
    }
    
    return(
       <div>
        {showCard ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border">
                <div className="bg-amber-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Add Artist</h2>
                        <button onClick={handleCloseCard} className="text-white text-xl">×</button>
                    </div>
                </div>
                <ArtistCard onClose={handleCloseCard} />
            </div>
        ) : (
            <div className="flex justify-end">
                <div className="flex justify-between items-center mt-10 ml-4">
                                       <Searchbar />
                                       <img 
                                           onClick={handleAddClick}
                                           className="w-9 h-9 cursor-pointer" 
                                           src={buttons.num2} 
                                           alt="Add"
                                       />
                                   </div>
                <div className="flex mt-10 justify-end gap-10 ">
                    <img className="ml-2 w-9 h-9" src={buttons.num3} alt="Update"/>
                    <img className="ml-2 w-9 h-9" src={buttons.num1} alt="Delete"/>
                </div>
            </div>
        )}
       </div>
    )
}