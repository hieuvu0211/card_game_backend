'use client'
import React, { useEffect } from "react";
import { useState } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { useCookies } from 'react-cookie';
export default function Login() {
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['login']);
    let count = 1;
    const handlerClick =  () => {
        fetch('http://localhost:8080/login', {method: 'POST',  headers: {
            'Content-Type': 'application/json',
          }, body: JSON.stringify({username: value1, password: value2})})
        .then(response => response.json())
        .then(data => {
            if(data.length > 0)
            {
                setCookie('login', true, {
                    path: '/'
                })
                router.push('/');
            }
        })
        .catch((error) => console.error('Error: ', error))

        // console.log(data);
        // const respone = await fetch('http://localhost:8080/login', {value1, value2});
        // const data = await respone.json();
        // console.log(data);
        // count+=1;
        // console.log(count);
        // data.map(item => {
        //     if (value1 === item.username) {
        //         if(value2 === item.password)
        //         router.push('/')
        //     }
        // })
        }
    const handleKeyPress = (e) => {
        if(e.key ==="Enter") {
            handlerClick();
        }
    }
    return (
                        <div className="flex min-h-screen items-center justify-center ">
                            <div className="flex flex-col w-96 items-center justify-center text-center border-8 rounded-xl border-zinc-800 bg-zinc-800 shadow-2xl p-4">
                                <div className="w-full font-bold text-2xl text-white pl-2">
                                    <span className=" text-green-400">Log</span>In
                                </div>
                                <div className="flex flex-col w-full justify-start items-start text-gray-300">
                                    <label className="my-2">UserName:</label>
                                    <input onKeyDown={handleKeyPress} type="text" value={value1} onChange={e => { setValue1(e.currentTarget.value) }} placeholder="Enter Username" className=" bg-gray-500 rounded-xl p-2 w-full"></input>
                                    <label className="my-2">Password:</label>
                                    <input onKeyDown={handleKeyPress} type="text" value={value2} onChange={e => { setValue2(e.currentTarget.value) }} placeholder="Enter Password" className=" bg-gray-500 rounded-xl p-2 w-full"></input>
                                </div>
                                    <button onClick={() => handlerClick()} className="flex items-center justify-center bg-blue-300 mt-8 h-8 rounded-xl w-full p-2">
                                            Login
                                    </button>
                                <div className="pt-2 text-white">
                                    <Link href="/">Access without login</Link>
                                </div>
                            </div>
                        </div>

    );

}