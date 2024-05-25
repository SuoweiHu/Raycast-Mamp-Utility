import { open, showHUD } from "@raycast/api";
import { exec } from "child_process";
import { wait } from "./utils-time";
import { open_Url_InChrome } from "./utils-open";
import { get_pref_apachePort } from "./utils-preference";

export const system_db = ["performance_schema","information_schema","mydb","mysql","sys"];


export function sort_db(db_a:string, db_b:string):number{
    // First check if db_a/db_b is system db
    if(system_db.includes(db_a)){ return +1; }

    // Then compare the name
    if(db_a < db_b){              return -1;
    } else if(db_a > db_b){       return +1;
    } else {                      return  0; }
}


export async function get_databases(set_dbList:Function):Promise<boolean>{
    const mysql=require("mysql");
    try{
        // Configure your MySQL connection settings
        const connection = mysql.createConnection({
            port       : 8889,
            host       : "localhost",
            user       : "root",
            password   : "root",
            socketPath : "/Applications/MAMP/tmp/mysql/mysql.sock",
            // database   : "_asbfeo_d10_"
        });

        // Establish connection and retrive the databases
        connection.connect((err:any) => {
            if (err==true) {return console.error('[MYSQL] error connecting: ' + err.stack);}
        });

        connection.query("SHOW DATABASES;",(err:any, result: string | any[]) => {
            if (err==true) {return console.error('[MYSQL] error connecting: ' + err.stack);}
            let temp_dbs = []
            for (let i = 0; i < result.length; i++) {
                const _RoWDataPacket_ = result[i];
                const _Database_      = _RoWDataPacket_["Database"];
                temp_dbs.push(_Database_)
            }
            set_dbList(temp_dbs);
            connection.end();
        });

        return true;
    } catch (error:any){
        console.error("[ERROR] get_database: ", error.message);
        return false;
    }
}


export async function export_database(db:string, openAfter:boolean=false){
    if(system_db.includes(db)){
        await showHUD("⚠️ Failure exporting system database: " + db);
    }
    try {
        const {getCurrentFormattedTime} = require("./utils-time");
        const export_folder = "~/Downloads";
        const export_file   = getCurrentFormattedTime() + "-[" + db + '].sql';
        const export_path   = export_folder + '/' + export_file;
        const export_cmd    = `/Applications/MAMP/Library/bin/mysqldump -u root -proot ${db} > ${export_path}`;
        exec(export_cmd, (err, stdout, stderr)=>{
            if(err){showHUD("Failure exporting database: " + err);}
            if(openAfter){open(export_folder);}
            showHUD("Successfully exported datbase: " + db);
        });
    } catch (error:any) {
        await showHUD("⚠️ Failure exporting database: " + error);
    }
}


export async function create_database(db:string, openAfter:boolean=false){
    if(system_db.includes(db)){
        await showHUD("⚠️ Failure creating system database: " + db);
    }
    try {
        const cmd = `/Applications/MAMP/Library/bin/mysql -u root -proot -e "CREATE DATABASE ${db}"`;
        exec(cmd, (err, stdout, stderr)=>{
            if(err){showHUD("Failure create database: " + err);}
            if(openAfter){open_Url_InChrome("http://localhost:"+get_pref_apachePort()+"/phpMyAdmin5/");}
            showHUD("Successfully created datbase: " + db);
        });
    } catch (error:any) {
        await showHUD("⚠️ Failure create database: " + error);
    }
}

