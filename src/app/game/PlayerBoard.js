import { NavbarMenu } from "@nextui-org/react";
import React, { useEffect } from "react";
export default function PlayerBoard(props) {
  let boardItems = null;
  if (props.players.length > 1) {
    console.log("list = ", props.players);
    boardItems = props.players.map((player, index) => {
      let nameP = "";
      let idP = "";
      let check = false;
      let isStart = 0;
      for (let i = 0; i < player.name.length; i++) {
        if (player.name[i] == "-") {
          check = true;
          isStart = i + 1;
          break;
        }
        nameP += player.name[i];
      }
      if (check) {
        for (let i = isStart; i < player.name.length; i++) {
          idP += player.name[i];
        }
        if(idP == "") idP = "14";
      } else {
        idP = "14";
      }
      return (
        <div key={index}>
          <div style={{
            border : "1px solid white",
            marginLeft : "10px",
            marginRight : "10px",
            color : "white",
            borderRadius : "5px",
            padding: "5px"
          }}>
            <div
              style={{
                width: "150px",
                height: "180px",
                backgroundImage: `url("/skin/${idP}.png")`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }}
            ></div>
            <h2 className=" text-xl">{nameP}</h2>
            <p className=" text-lg">Coins: {player.money}</p>
            <p className=" text-lg">influences: {player.influences.length}</p>
          </div>

          
        </div>
      );
    });
  }
  return <div className=" flex items-center justify-center">{boardItems}</div>;
}
