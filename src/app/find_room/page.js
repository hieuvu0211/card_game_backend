'use client'
import JoinGame from "../game/JoinGame"
export default function Page() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full ">
            <div className=" w-full h-32 "></div>
            <JoinGame></JoinGame>
            <div className=" w-full h-32 "></div>
        </div>

    )

}