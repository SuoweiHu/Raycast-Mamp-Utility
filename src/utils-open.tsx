import { Toast, open, showHUD, showToast } from "@raycast/api";
import { exec } from "child_process";

export async function open_Url_InChrome(_url_:string, _app_:string="com.google.Chrome"){
    await open(_url_, _app_);
}

export async function open_Folder_InVSCode(_path_:any){
    try{
        await exec(`code --new-window "${_path_}"`);
        await showHUD("Successfully opened site in VS Code");
    } catch {
        await showHUD("Failure: Please install CLI-Plugin for VS Code");
    }
}