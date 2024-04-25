'use client'
import CreateGame from "../game/CreateGame"
export default function Page() {
    return (
        // <>
        // <div className=" min-h-screen flex items-center justify-center w-full">
        //     <div className=" text-black font-bold text-xl relative flex flex-col py-2 items-center justify-start min-h-96 h-fit bg-slate-500 rounded-xl w-1/3">
        //         <div>ROOM ID: #3579

        //         </div>
        //         <div className="flex flex-row w-full">
        //             <div className=" flex justify-center basis-1/2">Participant Name</div>
        //             <div className=" flex justify-center basis-1/2 ">Elo</div>
        //         </div>
        //         <div className="absolute bottom-0 mb-2 px-2 rounded-lg text-2xl  bg-green-500">
        //             Start Game
        //         </div>
        //     </div>
        // </div>
        // </>
        <div className="flex items-center justify-center min-h-screen">
            <CreateGame></CreateGame>
        </div>


    )

}