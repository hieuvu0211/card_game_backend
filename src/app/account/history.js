import { useEffect, useState } from "react";
export default function History({ id }) {
  const [hisData, setHisData] = useState();
  useEffect(() => {
    async function fetData() {
      fetch(`http://localhost:8080/getmatchparticipantbyid/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setHisData(data);
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
          // borderRight : "1px solid green",
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
          Match History
        </div>
        {hisData &&
          hisData.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  width: "90%",
                  height: "70px",
                  borderBottom: "1px solid red",
                  marginLeft: "4%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <div
                  className="flex mt-3"
                  style={{
                    fontSize: "25px",
                  }}
                >
                  <h1>Match ID</h1>
                  <h1>: {item.match_id}</h1>
                </div>

                <div
                  className="flex mt-3"
                  style={{
                    fontSize: "25px",
                  }}
                >
                  <h1>Result</h1>
                  <h1>: Rank {item.result}</h1>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
