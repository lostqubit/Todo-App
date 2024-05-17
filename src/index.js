import './style.css';
import task from './tasks.js';
import display from './render.js';
import {format} from 'date-fns';

const tasks = [];

for(let i=0;i<20;i++){
    const task1 = task("Code Task creation logic","high",format(new Date(), 'dd/MM/yyyy'));
    display.addTask(task1);
    tasks.push(task1);
}
