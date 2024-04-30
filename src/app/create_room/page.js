'use client'
import CreateGame from "../game/CreateGame"
export default function Page() {
    return (

        <div className="relative flex flex-col items-center justify-center min-h-screen w-full ">
            <div className=" w-full h-32 "></div>
            <CreateGame></CreateGame>
            <div className=" w-full h-32 "></div>
        </div>


    )

}