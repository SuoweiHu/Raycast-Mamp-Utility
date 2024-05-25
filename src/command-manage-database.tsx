import { Action, ActionPanel, Color, Form, Icon, List, Toast, popToRoot, showHUD, showToast, useNavigation } from "@raycast/api";
import { create_database, export_database, get_databases } from "./utils-db";
import { useEffect, useState } from "react";
import { exec } from "child_process";
import { getCurrentFormattedTime } from "./utils-time";

/**
* This function renders a form component for creating a database. It takes in props as input, which can be of type any or null.
* Parameters:
* -  props: any|null - Props to be passed to the component.
* Returns:
* -  JSX Element: A form component with the following features:
*     - enableDrafts set to false.
*     - navigationTitle displaying "Create Database".
*     - isLoading set to true.
*     - actions containing a submit button with the title "Submit" that triggers the create_database function with the provided data.
*     - a text field for entering the database name with the following properties:
* */
function FormCreateDB(props:any|null){
    return(
        <Form
            enableDrafts={false}
            navigationTitle={"Create Database"}
            isLoading={true}
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Submit" onSubmit={(data)=>{create_database(data.db_name)}} />
                </ActionPanel>
            }
        >
            <Form.TextField
                id          ={"db_name"}
                autoFocus   ={true}
                title       ={"Database Name"}
                defaultValue={`_${getCurrentFormattedTime()}_`}
            />
        </Form>
    );
}

function ListDB(props:{db:string}){
    const db = props.db;
    const {system_db} = require("./utils-db");
    const {push} = useNavigation();


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
                <ActionPanel.Section title="Clipboard">
                    <Action.CopyToClipboard
                        title="Copy Drupal Database Configuration"
                        content={`$databases['default']['default'] = array (\n\t'driver' => 'mysql',\n\t'database' => '${db}',\n\t'username' => 'root',\n\t'password' => 'root',\n\t'prefix' => '',\n\t'host' => '127.0.0.1',\n\t'port' => '8889',\n\t'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',\n\t'unix_socket' => '/Applications/MAMP/tmp/mysql/mysql.sock',\n);\n$settings['trusted_host_patterns'] = array();`}
                        shortcut={{modifiers:["cmd"], key:"c"}}
                    />
                    <Action.CopyToClipboard
                        title="Copy Database Name"
                        content={db}
                        shortcut={{modifiers:["cmd", "ctrl"], key:"c"}}
                    />
                </ActionPanel.Section>
                <ActionPanel.Section title="Create/Delete">
                    <Action
                        title="Create Database"
                        icon={Icon.PlusCircle}
                        shortcut={{modifiers:["cmd"], key:"n"}}
                        onAction={()=>{push(<FormCreateDB></FormCreateDB>)}}
                    />
                    <Action
                        title="Delete Database"
                        icon={Icon.MinusCircle}
                        shortcut={{modifiers:["ctrl"], key:"x"}}
                        onAction={()=>{

                        }}
                    />
                </ActionPanel.Section>
                <ActionPanel.Section title="Export/Import">
                    <Action
                        title="Export Database"
                        icon={Icon.ArrowRightCircle}
                        onAction={()=>{
                            showToast({title:"Exporting...", style:Toast.Style.Animated})
                            export_database(db);
                        }}
                        shortcut={{modifiers:["cmd"], key:"s"}}
                    />
                    {/* <Action
                        title="Export Database (and Reveal in Finder)"
                        icon={Icon.ArrowRightCircle}
                        onAction={()=>{export_database(db, true);}}
                        shortcut={{modifiers:["cmd", "ctrl"], key:"s"}}
                    /> */}
                    <Action
                        title="Import Database"
                        icon={Icon.ArrowRightCircle}
                        onAction={()=>{}}
                        shortcut={{modifiers:["cmd"], key:"i"}}
                    />
                    {/* <Action
                        title="Import Database (and Reveal in phpMyAdmin)"
                        icon={Icon.ArrowRightCircle}
                        onAction={()=>{}}
                        shortcut={{modifiers:["cmd", "ctrl"], key:"i"}}
                    /> */}
                </ActionPanel.Section>
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

