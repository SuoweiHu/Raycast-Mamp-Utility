import { open_Url_InChrome } from "./utils"
import { List, getPreferenceValues, render, showHUD } from "@raycast/api";
import mysql from "mysql";
import { useEffect, useState } from "react";


async function get_databases():Promise<string[]>{
    // Configure your MySQL connection settings
    const connection = mysql.createConnection({
        port       : 8889,
        host       : "localhost",
        user       : "root",
        password   : "root",
        socketPath : "/Applications/MAMP/tmp/mysql/mysql.sock",
        database   : "_asbfeo_d10_"
    });

    // Establish connection and retrive the databases
    connection.connect((err:any) => {
        if (err==true) { return console.error('[MYSQL] error connecting: ' + err.stack);                        }
        else {              /*console.log(  '[MYSQL] connected to database (thred-id=' + connection.threadId);*/}
    });
    connection.query("SHOW DATABASES;",(err:any, result) => {
        if (err==true) { return console.error('[MYSQL] error connecting: ' + err.stack);   }
        else{
            /* console.log(  '[MYSQL] result: ' + Object.keys(result)); */
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                console.log(element);
            }
        }
    });
    connection.end();
    // Process the result to retrive the required array of database names
    return ["asbfeo", "btaa", "calc", "stephanieslater", "superheroesact"];
}





function ListDatabase(){
    const [_listDatabases_, set_listDatabases_] = useState<string[]>([]);
    get_databases(); // .then((data) =>{set_listDatabases_(data)});
    return (
        <List>
            {_listDatabases_.map((item)=>{return <List.Item key={item} title={item}/>})}
        </List>
    );
}



export default ()=>{
    const preferences:Preferences=getPreferenceValues();
    return (<ListDatabase/>);
}


// ███████████████████████████████████████
// ███████████████████████████████████████
// ███████████████████████████████████████
// ███████████████████████████████████████
// ███████████████████████████████████████
// ███████████████████████████████████████

// // Runs async. code in a no-view command
// export default async function Command() {
//         await getDatabase("_asbfeo_d10_");
//         console.log("temp");
//         // openUrlInChrome("http://localhost:8888/phpMyAdmin5/");
//         await showHUD("Successful");
//     }
