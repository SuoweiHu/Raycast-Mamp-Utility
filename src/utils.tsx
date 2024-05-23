import { readdirSync, statSync } from "fs";
import { join } from "path";
import { Toast, open, showHUD, showToast } from "@raycast/api";
import untildify from "untildify";
import { exec } from "child_process";

export function getFiles(_path_: string) {
	const files = readdirSync(untildify(_path_));
	return files
		.filter((file) => !file.startsWith("."))
		.map((file) => {
			const path = join(_path_, file);
			const lastModifiedAt = statSync(path).mtime;
			return { file, path, lastModifiedAt };
		})
		.sort(
			(a, b) => b.lastModifiedAt.getTime() - a.lastModifiedAt.getTime()
		);
}

export async function open_Url_InChrome(_url_:string, _app_:string="com.google.Chrome"){
    await open(_url_, _app_);
}

export async function open_Folder_InVSCode(_path_:any){
    try{
        await exec(`code --new-window ${_path_}`);
        await showHUD("Successfully opened site in VS Code");
    } catch {
        await showHUD("Failure: Please install CLI-Plugin for VS Code");
    }
}