export default function Page() {
    return (
        <>
        <div className=" min-h-screen flex items-center justify-center w-full">
            <div className=" text-black font-bold text-xl flex flex-col py-2 px-2 items-center justify-center h-fit bg-slate-500 rounded-xl w-fit">
                <div className=" mb-2">
                    ROOM ID: <input className=" text-md rounded-md px-1 outline-none" type="text" placeholder="Type here"></input>
                </div>
                <div className=" rounded-lg text-2xl  bg-green-500 px-2">
                    Find Room
                </div>
            </div>
        </div>
        </>

    )

}