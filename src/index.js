import './style.css';
import task from './tasks.js';
import taskPage from './render.js';
import {format} from 'date-fns';

const tasks = [];

taskPage.load();

for(let i=0;i<5;i++){
    const task1 = task("Code Task creation logic","high",format(new Date(), 'dd/MM/yyyy'));
    taskPage.addTask(task1);
    tasks.push(task1);
}
