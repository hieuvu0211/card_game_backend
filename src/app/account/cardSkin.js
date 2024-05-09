import { Image } from "@nextui-org/react";
import { useState, useEffect } from "react";
export default function CardSkin({ id, player_id }) {
  const [avatarInfo, setAvatarInfo] = useState();
  useEffect(() => {
    async function fetData() {
      fetch(`http://localhost:8080/getskinbyid/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setAvatarInfo(data);
        });
    }
    fetData();
  }, [id]);
  const handleChangeAvatar = async (newid) => {
    const res = await fetch(
      `http://localhost:8080/updateskinuser/${player_id}/${newid}`,
      { method: "PUT" }
    );
    // res = res.json();
    if(res.status != 400) {
        alert("ok, done!")
        localStorage.setItem("idSkin", newid)
        window.location.reload()
    }else {
        alert("failed")
    }
    console.log("res = ", res);
    console.log("id = ", player_id, " newid = ", newid);
  };
  return (
    <div
      style={{
        marginLeft: "10px",
        marginRight: "10px",
        textAlign: "center",
      }}
    >
      {avatarInfo && (
        <div style={{
          marginBottom : "50px"
        }}>
          <div
            style={{
              width: "170px",
              height: "180px",
              backgroundImage: `url("skin/${id}.png")`,
              backgroundRepeat  :"no-repeat",
              backgroundSize: 'cover'
            }}
          ></div>
          <h1>{avatarInfo[0].skin_name}</h1>
          <button
            style={{
              width: "80px",
              height: "30px",
              border: "1px solid black",
              borderRadius: "5px",
            }}
            className="hover:bg-emerald-300"
            onClick={() => handleChangeAvatar(id)}
          >
            Active
          </button>
        </div>
      )}
    </div>
  );
}
