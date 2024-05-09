"use client";

import { useEffect, useState } from "react";
import Deposit from "./deposit";
import History from "./history";
import Avatar from "./avarta";
export default function Account() {
  const [option, setOption] = useState(1);
  const [colorOption, setColorOption] = useState({
    color1: "1px solid green",
    color2: "0px solid green",
    color3: "0px solid green",
  });
  const [user, setUser] = useState({
    id : 0,
    username: "",
    score: 0,
    elo: 0,
    recharge_rank: 0,
    currentSkin : 0
  });
  useEffect(() => {
    async function fetData() {
      const id = localStorage.getItem("id");
      fetch(`http://localhost:8080/getuserbyid/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setUser({
            id : data[0].player_id,
            username: data[0].username,
            score: data[0].score,
            elo: data[0].elo,
            recharge_rank: data[0].recharge_rank,
            currentSkin : data[0].currentSkin
          });
        });
    }
    fetData();
  }, []);
  const handleOption = (n) => {
    setOption(n);
    const newColorOption = { ...colorOption };
    if (n == 1) {
      newColorOption.color1 = "1px solid green";
      newColorOption.color2 = "0px solid green";
      newColorOption.color3 = "0px solid green";
    }
    else if (n == 2) {
      newColorOption.color1 = "0px solid green";
      newColorOption.color2 = "1px solid green";
      newColorOption.color3 = "0px solid green";
    }
    else {
      newColorOption.color1 = "0px solid green";
      newColorOption.color2 = "0px solid green";
      newColorOption.color3 = "1px solid green";
    }
    setColorOption(newColorOption);
  };
  return (
    <div
      className="flex flex-col min-h-screen w-screen "
      style={{
        backgroundColor: "white",
        padding: "30px",
      }}
    >
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          height: "200px",
          padding: "10px",
          borderBottom: "0.01px solid black",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "170px",
            height: "180px",
            borderRadius: "10%",
            backgroundImage: `url("/skin/${user.currentSkin}.png")`,
            backgroundRepeat  :"no-repeat",
              backgroundSize: 'cover'
          }}
        ></div>
        <div
          style={{
            marginLeft: "70px",
            height: "90%",
            fontWeight: "600",
          }}
        >
          <h1 style={{ marginBottom: "20px" }}>Name</h1>
          <h1 style={{ marginBottom: "20px" }}>Coin</h1>
          <h1 style={{ marginBottom: "20px" }}>Elo</h1>
          <h1 style={{ marginBottom: "20px" }}>VIP</h1>
        </div>
        {user && (
          <div
            style={{
              marginLeft: "20px",
              height: "90%",
              fontWeight: "600",
            }}
          >
            <h1 style={{ marginBottom: "20px" }}>: {user.username}</h1>
            <h1 style={{ marginBottom: "20px" }}>: {user.score}</h1>
            <h1 style={{ marginBottom: "20px" }}>: {user.elo}</h1>
            <h1 style={{ marginBottom: "20px", color: "red" }}>
              : {user.recharge_rank}
            </h1>
          </div>
        )}
      </div>
      <div
        style={{
          width: "100%",
          height: "50px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            width: "50px",
            height: "50px",
            borderBottom: `${colorOption.color1}`,
            marginRight: "30px",
            marginLeft: "30px",
            fontSize: "20px",
            fontWeight: "500",
          }}
          onClick={() => handleOption(1)}
        >
          History
        </button>
        <button
          style={{
            width: "50px",
            height: "50px",
            borderBottom: `${colorOption.color2}`,
            marginRight: "30px",
            marginLeft: "30px",
            fontSize: "20px",
            fontWeight: "500",
          }}
          onClick={() => handleOption(2)}
        >
          Deposit
        </button>
        <button
          style={{
            width: "50px",
            height: "50px",
            borderBottom: `${colorOption.color3}`,
            marginRight: "30px",
            marginLeft: "30px",
            fontSize: "20px",
            fontWeight: "500",
          }}
          onClick={() => handleOption(3)}
        >
          Avatar
        </button>
      </div>
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          height: "100vh",
          padding: "10px",
          border: "0.01px solid red",
          borderRadius: "7px",
          
          flexWrap : "wrap"
        }}
      >
        {option == 1 ? (
          <History id={user.id} />
        ) : option == 2 ? (
          <Deposit id={user.id} />
        ) : (
          <Avatar id={user.id} />
        )}
      </div>
    </div>
  );
}
