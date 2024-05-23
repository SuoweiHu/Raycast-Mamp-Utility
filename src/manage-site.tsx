import { ActionPanel, Action, List, getPreferenceValues, Color, open, Toast, showToast, getDefaultApplication, Icon, getApplications, showHUD, useNavigation } from "@raycast/api";
import untildify from "untildify";
import { getFiles, open_Folder_InVSCode } from "./utils";
import { useState } from "react";

function ListFiles(props: any) {
	const [listFiles, set_listFiles] = useState(
		getFiles(untildify(props._path_))
	);
	function ListFile_Item(props: any) {
		const _file_ = props.file;
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
	return (
		<List>
			{listFiles.length === 0 && (
				<List.EmptyView title="No file found" description="" />
			)}
			{listFiles.map((file) => (
				<ListFile_Item file={file} key={file.path} />
			))}
		</List>
	);
}

export default () => {
	const preferences: Preferences = getPreferenceValues();
	return <ListFiles _path_={preferences.siteFolder} />;
}
