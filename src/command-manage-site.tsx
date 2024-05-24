import untildify from "untildify";
import { ActionPanel, Action, List, getPreferenceValues, Color, Icon, useNavigation } from "@raycast/api";
import { open_Folder_InVSCode } from "./utils-open";
import { getFiles } from "./utils";
import { useState } from "react";


/**
* Function to render an action panel for a file item, providing various actions like opening the file, navigating within folders, and performing other file-related tasks.
* Parameters:
* -  props: Object containing information about the file item, including its path.
* Returns:
* -  React component representing an ActionPanel with sections for different actions like opening the file, navigating, copying path, revealing in Finder, and opening with other applications.
*/
function ListFile_Item_Action(props:any){
    const { push, pop } = useNavigation();
    return(
        <ActionPanel>
            <ActionPanel.Section title="Open">
                <Action.Push
                    title="Open File"
                    icon={Icon.ArrowDown}
                    target={<ListFiles _path_={props.file.path} />} />

                <Action
                    title="Open in VS Code"
                    icon={Icon.CodeBlock}
                    shortcut={{modifiers:["cmd"], key: "enter"}}
                    onAction={()=>{open_Folder_InVSCode(props.file.path)}}
                />
            </ActionPanel.Section>
            <ActionPanel.Section title="Navigation">
                <Action
                    title="Open Current Folder"
                    icon={Icon.ArrowDown}
                    shortcut={{modifiers:["cmd"], key: "]"}}
                    onAction={()=>{push(<ListFiles _path_={props.file.path} />)}}
                />
                <Action
                    title="Exit to Last Folder"
                    icon={Icon.ArrowUp}
                    shortcut={{modifiers:["cmd"], key:"["}}
                    onAction={pop}
                />
            </ActionPanel.Section>
            <ActionPanel.Section title="Other Action">
                <Action.CopyToClipboard
                    title="Copy Path"
                    content={props.file.path}
                    shortcut={{modifiers:["cmd"], key:"c"}}
                />
                <Action.ShowInFinder
                    title="Reveal in Finder"
                    path={props.file.path}
                    shortcut={{modifiers:["cmd", "ctrl"], key: "r"}}
                />
                <Action.OpenWith
                    title="Open with ..."
                    path={props.file.path}
                    shortcut={{modifiers:["cmd","shift"], key:"enter"}}
                />
            </ActionPanel.Section>
        </ActionPanel>
    );
}

/**
* Renders a list item component for displaying file information and providing various actions for interacting with the file.
* Parameters:
* -  props: any - An object containing file information to be displayed.
* Returns:
* -  React component - A list item component displaying file details and actions like opening the file, navigating to folders, copying file path, revealing in Finder, and opening with other applications.
*/
function ListFile_Item(props: any) {
    return (
        <List.Item
            key         ={props.file.path}
            title       ={props.file.file}
            icon        ={{fileIcon: props.file.path }}
            quickLook   ={{path: props.file.path, name: props.file.file }}
            accessories ={[{tag: {color: Color.SecondaryText, value: props.file.lastModifiedAt},}]}
            actions     ={<ListFile_Item_Action file={props.file}></ListFile_Item_Action>}
        />
    );
}

/**
* Function to list files based on the provided path.
* Parameters:
* -  props: any - The properties object containing the path information.
* Returns:
* -  React component - A list of files rendered as a React component.
*/
function ListFiles(props: any) {
	const [_listFiles_, set_listFiles_] = useState(getFiles(untildify(props._path_)));
	return (
		<List>
			{_listFiles_.length === 0 && ( <List.EmptyView title="No file found" description="" />       )}
			{_listFiles_.map((file) => (    <ListFile_Item file={file} key={file.path} />               ))}
		</List>
	);
}


/**
 * This function exports a default component that retrieves preference values using the getPreferenceValues function and renders a ListFiles component with the specified path based on the siteFolder preference.
 * Returns:
 * - A ListFiles component with the path specified by the siteFolder preference.
 */
export default () => {
	const preferences: Preferences = getPreferenceValues();
	return <ListFiles _path_={preferences.siteFolder} />;
}
