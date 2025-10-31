'use client'
import Image from "next/image";
import Header from "@/components/layout/Header";
import Searchbar from "@/components/ui/Searchbar";
import { useState } from "react";
import Album from './album/page';
import Artist from "./artist/page";
import Song from './songs/page';
import Dashboard from './dashboard/page';
export const buttons={
    num1:'/images/bin.png',
    num2:'/images/plus.png',
    num3:'/images/update.png',
    num4:'./images/artist.png',
    num5:'./images/album.png',
    num6:'./images/song.png'

}
 
export default function Home() {
 const [activeView,setActiveView]=useState('dashboard');
 const renderComponent = () => {
    switch(activeView) {
      case 'artist':
        return <Artist />;
      
      case 'album':
        return <Album />;
        case 'songs':
        return <Song />;
      default:
        return <Dashboard />;
    }
  }
  return (
    <div  >
      <div className="bg-amber-500  ">
      <div><Header/></div>
      {/* <div>
        <div className="mt-10 flex justify-between ml-4"><Searchbar />
      </div> */}
      </div>
      
      {/* <div className="flex justify-end bg-gray-700">
          <img className="ml-2 w-9 h-9" src={buttons.num1}/>
       
        <img className="ml-2 w-9 h-9" src={buttons.num3}/></div>
    */}
    <div className='flex mt-10 border-amber-500 justify-center gap-10'>
  <div className='w-30 h-30 bg-amber-200 rounded-lg shadow-md flex items-center justify-center text-lg font-medium'
  onClick={()=>setActiveView('artist')
    
  }>
    <h1>Artist</h1>
     <img src={buttons.num4} className="w-10 h-10"/>
  </div>
  <div className='w-30 h-30 bg-amber-200 rounded-lg shadow-md flex items-center justify-center text-lg font-medium'
  onClick={()=>setActiveView('songs')}>
    
    <h1>Songs</h1>
     <img src={buttons.num5} className="w-10 h-10"/>
  </div>
  <div className='w-30 h-30 bg-amber-200 rounded-lg shadow-md flex items-center justify-center text-lg font-medium'
  onClick={()=>setActiveView('album')}>
    <h1>Album</h1>
    <img src={buttons.num6}
    className="w-10 h-10"/>
  </div>
</div>
<div>{renderComponent()}</div>
    </div> 

  );
}
