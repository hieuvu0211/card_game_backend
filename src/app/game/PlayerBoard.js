import React from "react";
export default function PlayerBoard(props) {
    let boardItems = null
    if(props.players.length > 1) {
        boardItems = props.players.map((player, index) =>
            <span className="flex flex-col items-center justify-center rounded-md p-2 mx-2 mt-2" style={{ backgroundColor: `${player.color}`}} key={index}>
                <h2 className=" text-xl">{player.name}</h2>
                <p className=" text-lg">Coins: {player.money}</p>
                <p className=" text-lg">influences: {player.influences.length}</p>
            </span>
    )
    }
    return (
        <div className=" flex items-center justify-center">
            {boardItems}
        </div>
    )
}
