//DON'T USE THIS FILE
import mysql from "mysql2";

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '021103',
    database: 'CardGame'
})
db.connect((err) => {
    if(err) {
        stack
        console.log(`error connecting ${err.stack}`)
        return;
    }
    console.log(`database connection established`);
})

export function GetAllPlayers() {
    const query = 'select * from players';
    db.query(query, (err, data) => {
        if(err){
            console.log(`error get all player: ${err}`);
            return null;
        }
        return data;
    })
}

