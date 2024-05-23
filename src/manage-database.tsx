import { open_Url_InChrome } from "./utils"
import { showHUD } from "@raycast/api";
import mysql from "mysql";



// async function getDatabase(
//     _db_name_: string,
//     _host_   : string = "localhost",
//     _user_   : string = "root",
//     _pass_   : string = "root",
// ) {
//     // Configure your MySQL connection settings
//     const connection = mysql.createConnection({
//         host: 'localhost',
//         user: 'yourUsername',
//         password: 'yourPassword',
//         database: 'yourDatabaseName'
//     });

//     connection.connect((err:any) => {
//         if (err==true) { return console.error('error connecting: ' + err.stack); }
//         console.log('connected as id ' + connection.threadId);
//     });


// }

// // Runs async. code in a no-view command
// export default async function Command() {
//         await getDatabase("_asbfeo_d10_");
//         console.log("temp");
//         // openUrlInChrome("http://localhost:8888/phpMyAdmin5/");
//         await showHUD("Successful");
//     }
