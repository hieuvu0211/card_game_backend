import React from "react";
export default function PlayerBoard(props) {
    let boardItems = null
    if(props.players.length > 1) {
        boardItems = props.players.map((player, index) =>
            <span style={{ backgroundColor: `${player.color}`}} key={index}>
                <h2>{player.name}</h2>
                <p>Coins: {player.money}</p>
                <p>influences: {player.influences.length}</p>
            </span>
    )
    }
    return (
        <div className=" flex items-center justify-center">
            {boardItems}
        </div>
    )
}
