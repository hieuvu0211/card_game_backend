
import { useState, useEffect } from "react";
export default function Deposit({id}) {
    const [depoData, setDepoData] = useState();
    useEffect(() => {
        async function fetData() {
          fetch(`http://localhost:8080/getalldeposithistory/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setDepoData(data);
            });
        }
        fetData();
      }, [id]);
  return (
    <>
      <div style={{
                    width : "99%",
                    height : "100%"
                }}>
                <div style={{
                        fontSize : "30px",
                        fontWeight : "bold",
                        display : "flex",
                        justifyContent : "center"
                    }}>
                        Deposit History
                    </div>
                    {depoData && depoData.map((item, index) => {
                        return (
                            <div key={index} style={{
                                width : "90%",
                                height : "70px",
                                borderBottom : "1px solid red",
                                marginLeft : "4%",
                                display : "flex",
                                justifyContent : "space-around"
                            }}>
                                <div className="flex mt-3" style={{
                                    fontSize : "25px"
                                }}>
                                    <h1>Amount</h1>
                                    <h1>: {item.deposit_amount}</h1>
                                </div>
        
                                <div className="flex mt-3" style={{
                                    fontSize : "25px"
                                }}>
                                    <h1>Date</h1>
                                    <h1>: {item.deposit_date}</h1>
                                </div>
                            </div>
                        )
                    })}
                    
                    
                </div>
    </>
  );
}
