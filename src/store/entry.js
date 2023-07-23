import {defineStore} from "pinia";
import {ref} from "vue";

export const useEntriesStore = defineStore('entry',()=>{
    const totalEntry = ref([])
    const subtitles = ref([])
    const setSubtitles = (subs)=>{
        subtitles.value = subs
    }
    const setEntries = (entries)=>{
        totalEntry.value = entries
    }
    return {
        totalEntry,
        subtitles,
        setSubtitles,
        setEntries
    }
})