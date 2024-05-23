import { open_Url_InChrome } from "./utils"
import { List, getPreferenceValues, showHUD } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import mysql from "mysql";
import { useEffect, useState } from "react";


async function get_databases():Promise<string[]>{
    // Configure your MySQL connection settings
    let _rtn_databases_:string[] = []

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
                const _RoWDataPacket_ = result[i];
                const _Database_      = _RoWDataPacket_["Database"]
                _rtn_databases_.push(_Database_)
            }
        }
    });
    connection.end();

    // Return the result of an array of datbase names
    return _rtn_databases_;
}

export default function Command(){
    const [_listDatabases_, set_listDatabases_] = useState<string[]>([]);

    return (
        <List>
            {_listDatabases_?.map((item)=>{return <List.Item key={item} title={item}/>})}
        </List>
    );
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
