import {useConfigStore} from "../store/index.js";
import {exists, createDir, readDir} from "@tauri-apps/api/fs";
import {documentDir, join} from "@tauri-apps/api/path";

export async function getDir() {
    const dir = await join(await documentDir(), "DictationAppData")
    return readDir(dir, {recursive: true})
}