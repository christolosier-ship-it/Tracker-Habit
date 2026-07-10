import { Habit,HabitLog,UserSettings } from '../types'; import {demoHabits,createDemoLogs,defaultSettings} from '../data/demoData';
export type AppData={habits:Habit[];logs:HabitLog[];settings:UserSettings}; const KEY='discipline-dashboard-v1';
export const demoData=():AppData=>({habits:demoHabits,logs:createDemoLogs(),settings:defaultSettings});
export function loadData():AppData{try{const raw=localStorage.getItem(KEY); if(!raw)return demoData(); const d=JSON.parse(raw); if(!d.habits||!d.logs||!d.settings)throw Error('Format invalide'); return d}catch{return demoData()}}
export function saveData(d:AppData){localStorage.setItem(KEY,JSON.stringify(d))} export function resetData(){localStorage.removeItem(KEY)} export function validateImport(x:any):x is AppData{return x&&Array.isArray(x.habits)&&Array.isArray(x.logs)&&x.settings}
