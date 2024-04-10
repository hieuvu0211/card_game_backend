'use client'
import React from "react";
import { useState } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, useDisclosure} from "@nextui-org/react"
export default function Login() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const handlerClick = () => {
        console.log(name)
        console.log(pass)
        fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify({username: name, password: pass})
        })
        .then(response => response.json())
        .then(data => { onOpen();
            console.log(data)})
        .catch((error => console.error("Error: ", error)))
    };
    const handleKeyPress = (e) => {
        if(e.key ==="Enter") {
            handlerClick();
        }
    }
    return (
        <>
        <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col w-96 items-center justify-center text-center border-8 rounded-xl border-zinc-800 bg-zinc-800 shadow-2xl p-4">
            <div className="w-full font-bold text-2xl text-white pl-2">
                <span className=" text-green-400">Sign</span>Up
            </div>
            <div className="flex flex-col w-full justify-start items-start text-gray-300">
                <label className="my-2">UserName:</label>
                <input onKeyDown={handleKeyPress} value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Enter Username" className=" bg-gray-500 rounded-xl p-2 w-full"></input>
                <label className="my-2">Password:</label>
                <input onKeyDown={handleKeyPress} value={pass} onChange={e => setPass(e.target.value)} type="text" placeholder="Enter Password" className=" bg-gray-500 rounded-xl p-2 w-full"></input>
            </div>
                <button onClick={() => handlerClick()} className="flex items-center justify-center bg-blue-300 mt-8 h-8 rounded-xl w-full p-2">
                        Sign Up
                </button>
            <div className="pt-2 text-white">
                <Link href="/">Access HomePage</Link>
            </div>
        </div>
        </div>
    <Modal isOpen={isOpen} onClose={onClose} placement="top" backdrop="blur" motionProps={{
          variants: {
            enter: {
              opacity: 1,
              transition: {
                duration: 0.1,

              },
            },
            exit: {
              opacity: 0,
              transition: {
                duration: 0.1,
              },
            },
          }
        }} size="sm">
        <ModalContent className=" items-center pb-4">
            {()=> (
                <>
                <ModalHeader className=" text-black">Thông báo</ModalHeader>
                <ModalBody className=" text-green-500">
                    <div>Đăng ký tài khoản thành công!</div>
                </ModalBody>       
                </>
            )}
        </ModalContent>
    </Modal>
    </>
    );

}