import {defineStore} from "pinia";
import {ref} from "vue";
import { darkTheme} from "naive-ui";

export const useConfigStore = defineStore('config',()=>{
    const userName = ref("Munira")
    const appDir = ref("")
    const currentTheme = ref(null)
    const isDark = ref(false)
    const setUserName= (name)=>{
        userName.value = name
    }
    const changeTheme = ()=>{
        console.log(isDark.value)
        if (isDark.value){
            currentTheme.value = null
            isDark.value = false
        } else {
            currentTheme.value = darkTheme
            isDark.value = true
        }
    }
    return {
        appDir,
        userName,
        setUserName,
        currentTheme,
        changeTheme,
        isDark
    }
})