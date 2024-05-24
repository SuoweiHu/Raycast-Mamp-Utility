import mysql from "mysql";

export async function get_databases(update_DBs:Function):Promise<boolean>{
    try{
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
            if (err==true) {
                return console.error('[MYSQL] error connecting: ' + err.stack);
            }
        });
        connection.query("SHOW DATABASES;",(err:any, result) => {
            let temp_dbs = []
            if (err==true) {
                return console.error('[MYSQL] error connecting: ' + err.stack);
            }
            else{
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
    } catch (error){
        console.error("[ERROR] get_database: ", error);
        return false;
    }
}