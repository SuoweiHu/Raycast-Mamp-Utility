import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { export_database, get_databases } from "./utils-db";
import { useEffect, useState } from "react";
import { exec } from "child_process";


function ListDB(props:{db:string}){
    const db=props.db;
    const {system_db} = require("./utils-db");

    return(<List.Item
        key={db}
        title={db}
        icon={system_db.includes(db)?Icon.MemoryChip:Icon.Person}
        accessories={[{tag:{
            value: system_db.includes(db)? "system"     : "user",
            color: system_db.includes(db)? Color.Purple : Color.Green,
        }}]}
        actions={
            <ActionPanel>
                <Action
                    title="Export Database"
                    onAction={()=>{
                        export_database(db);
                    }}
                />
                <Action.CopyToClipboard
                    title="Copy Database to Clipboard"
                    content={db}
                />
            </ActionPanel>
        }
    />);
}


export default function Command(){
    const [dbs, set_DBs] = useState<string[]>([]);
    const {sort_db} = require("./utils-db");
    useEffect(()=>{get_databases(set_DBs)}, []);
    return (
        <List isLoading={dbs.length==0}>
            {dbs.sort((a,b)=>{return sort_db(a,b)})
                ?.map((db)=>{return <ListDB key={db} db={db}></ListDB>})
            }
        </List>
    );
}

