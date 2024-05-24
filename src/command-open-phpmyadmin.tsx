import { showHUD } from "@raycast/api";
import { open_Url_InChrome } from "./utils-open";

export default async function Command() {
    open_Url_InChrome("http://localhost:8888/phpMyAdmin5/");
    await showHUD("Successful");
}
