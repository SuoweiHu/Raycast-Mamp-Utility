import { ActionPanel, Action, List, getPreferenceValues, Color, open, Toast, showToast, getDefaultApplication, Icon, getApplications, showHUD, useNavigation } from "@raycast/api";
import untildify from "untildify";
import { getFiles, open_Folder_InVSCode } from "./utils";
import { useState } from "react";

/**
* Renders a list item component for displaying file information and providing various actions for interacting with the file.
* Parameters:
* -  props: any - An object containing file information to be displayed.
* Returns:
* -  React component - A list item component displaying file details and actions like opening the file, navigating to folders, copying file path, revealing in Finder, and opening with other applications.
*/
function ListFile_Item(props: any) {
    const [_file_, set_file_] = useState(props.file);
    const { push, pop } = useNavigation();
    return (
        <List.Item
            key={_file_.path}
            title={_file_.file}
            icon={{ fileIcon: _file_.path }}
            quickLook={{ path: _file_.path, name: _file_.file }}
            accessories={[
                {tag: {color: Color.SecondaryText, value: _file_.lastModifiedAt},}
            ]}
            actions={
                <ActionPanel>
                    <ActionPanel.Section title="Open">
                        <Action.Push
                            title="Open File"
                            icon={Icon.ArrowDown}
                            target={<ListFiles _path_={_file_.path} />} />

                        <Action
                            title="Open in VS Code"
                            icon={Icon.CodeBlock}
                            shortcut={{modifiers:["cmd"], key: "enter"}}
                            onAction={()=>{open_Folder_InVSCode(_file_.path)}}
                        />
                    </ActionPanel.Section>
                    <ActionPanel.Section title="Navigation">
                        <Action
                            title="Open Current Folder"
                            icon={Icon.ArrowDown}
                            shortcut={{modifiers:["cmd"], key: "]"}}
                            onAction={()=>{push(<ListFiles _path_={_file_.path} />)}}
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
                            content={_file_.path}
                            shortcut={{modifiers:["cmd"], key:"c"}}
                        />
                        <Action.ShowInFinder
                            title="Reveal in Finder"
                            path={_file_.path}
                            shortcut={{modifiers:["cmd", "ctrl"], key: "r"}}
                        />
                        <Action.OpenWith
                            title="Open with ..."
                            path={_file_.path}
                            shortcut={{modifiers:["cmd","shift"], key:"enter"}}
                        />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

/**
*   Function to list files based on the provided path.
*   Parameters:
*   -  props: any - The properties object containing the path information.
*   Returns:
*   -  React component - A list of files rendered as a React component.
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
