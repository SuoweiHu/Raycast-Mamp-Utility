import { open_Url_InChrome } from "./utils"
import { List, getPreferenceValues, showHUD } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import mysql from "mysql";
import { useEffect, useState } from "react";


async function get_databases(update_DBs:Function):Promise<boolean>{
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
        let temp_dbs = []
        if (err==true) { return console.error('[MYSQL] error connecting: ' + err.stack);   }
        else{
            /* console.log(  '[MYSQL] result: ' + Object.keys(result)); */
            for (let i = 0; i < result.length; i++) {
                const _RoWDataPacket_ = result[i];
                const _Database_      = _RoWDataPacket_["Database"];
                temp_dbs.push(_Database_)
            }
        }
        update_DBs(temp_dbs);
    });
    connection.end();

    // Return the result
    return true;
}

export default function Command(){
    const [DBs, set_DBs] = useState<string[]>([]);
    useEffect(()=>{get_databases(set_DBs)}, [])
    console.log(DBs)
    return (
        <List isLoading={DBs.length==0}>
            {DBs?.map((item)=>{return <List.Item key={item} title={item}/>})}
        </List>
    );
}


