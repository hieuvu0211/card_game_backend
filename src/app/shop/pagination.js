import React from 'react';
import { useRouter, useSearchParams } from "next/navigation"
export default function Pagination({ totalPage}) {
    const searchParam = useSearchParams();
    const page = parseInt(searchParam.get('page') ?? 1);
    console.log(page)
    const route = useRouter();
    const handlePageClick = (index) => {
        route.push(`/shop/?page=${index}`);
    }

    return (
        <>
        { [...Array(totalPage)].map((_, index) => (
            <button key={index} className={` text-black font-bold px-2 mx-2 my-2 rounded-md hover:bg-amber-500 
            ${(index+1)===page 
                ? 'bg-amber-500'
                : ' bg-zinc-300'
            }`} onClick={() => {handlePageClick(index+1)}}>
                {index+1}
            </button>
            
        ))}
        </>
    )
}