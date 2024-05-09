import { useState, useEffect } from "react";
import CardSkin from "./cardSkin";
export default function Avatar({ id }) {
  const [avatar, setAvatar] = useState();
  useEffect(() => {
    async function fetData() {
      fetch(`http://localhost:8080/getskinbyidplayer/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setAvatar(data);
        });
    }
    fetData();
  }, [id]);
  return (
    <>
      <div
        style={{
          width: "99%",
          height: "100%",
          // overflow: "auto",
        }}
      >
        <div
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Avatar
        </div>
        <div className="flex px-3 py-3" style={{
          display: "flex",
          flexWrap  :"wrap",
        }}>
          {avatar &&
            avatar.map((item, index) => {
              return (
                <div key={index}>
                  <CardSkin id={item.skin_id} player_id={id} />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
