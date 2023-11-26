"use client"
import Image from 'next/image'
import { useSession } from 'next-auth/react'

const files = [
    {
        title: 'DORKO HUNGARY',
        size: 4500,
        source:
            '/dorkored.jpg',
    },
    {
        title: 'DORKO BASIC',
        size: 5000,
        source:
            '/dorkoblack.jpg',
    },
    {
        title: 'DORKO TEAM HUN',
        size: 4350,
        source:
            '/dorkowhite.jpg',
    }
    
  ]
  
  const session = useSession();

  export default function ProductCard() {
    return (
        <div className="flex flex-row justify-between flex-wrap">
            {files.map((file) => (
                <div key={file.source} className="relative ">
                    <Image src={file.source} alt="" width={400} height={1000} className="" />
                    <div className='mt-4 mb-4'>
                        <p className="">{file.title}</p>
                        <p className="">{file.size} Ft</p>
                    </div>
                    <button
                        type="button"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        
                    >
                        Buy Now
                    </button>

                </div>
            ))}
        </div>
        
    )
  }
  