'use client'
import React from "react";
import { useState } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";
export default function Login() {

    return (
        <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col w-96 items-center justify-center text-center border-8 rounded-xl border-zinc-800 bg-zinc-800 shadow-2xl p-4">
            <div className="w-full font-bold text-2xl text-white pl-2">
                <span className=" text-green-400">Sign</span>Up
            </div>
            <div className="flex flex-col w-full justify-start items-start text-gray-300">
                <label className="my-2">UserName:</label>
                <input type="text" placeholder="Enter Username" className=" bg-gray-500 rounded-xl p-2 w-full"></input>
                <label className="my-2">Password:</label>
                <input type="text" placeholder="Enter Password" className=" bg-gray-500 rounded-xl p-2 w-full"></input>
            </div>
                <button onClick={() => handlerClick()} className="flex items-center justify-center bg-blue-300 mt-8 h-8 rounded-xl w-full p-2">
                        Sign Up
                </button>
            <div className="pt-2 text-white">
                <Link href="/">Access HomePage</Link>
            </div>
        </div>
        </div>

    );

}