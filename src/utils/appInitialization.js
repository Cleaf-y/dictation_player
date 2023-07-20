import {documentDir, join} from "@tauri-apps/api/path";
import {useConfigStore} from "../store/index.js";
import {exists, createDir} from "@tauri-apps/api/fs";


export async function appInitialization() {
    const configStore = useConfigStore()
    configStore.appDir = await join(await documentDir(), "DictationAppData")

    const res = await exists(configStore.appDir)
    if(!res){
        console.log("Creating app directory")
        const res = createDir(configStore.appDir)
        if(res){
            console.log("App directory created successfully")
        } else {
            console.log("Failed to create app directory")
        }
    } else {
        console.log("App directory already exists")
    }
}

