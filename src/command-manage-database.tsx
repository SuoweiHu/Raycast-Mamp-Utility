import { List } from "@raycast/api";
import { get_databases } from "./utils-db";
import { useEffect, useState } from "react";


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


