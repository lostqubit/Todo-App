import './style.css';
import taskPage from './render.js';

taskPage.loadAll();

let currentSection = 0;
let currentTab = 0;

const container = document.querySelector("#content-body")

const allTasks = document.querySelector("#home>ul>li:first-child");
const today = document.querySelector("#home>ul>li:nth-child(2)");
const thisWeek = document.querySelector("#home>ul>li:nth-child(3)");
const due = document.querySelector("#home>ul>li:last-child");

allTasks.addEventListener("click", () => {
    if(!(currentSection===0 && currentTab===0)){
        container.innerHTML = "";
        taskPage.loadAll();
        currentSection = 0;
        currentTab = 0;
    }
});

today.addEventListener("click", () => {
    if(!(currentSection===0 && currentTab===1)){
        container.innerHTML = "";
        taskPage.loadToday();
        currentSection = 0;
        currentTab = 1;
    }
});

thisWeek.addEventListener("click", () => {
    if(!(currentSection===0 && currentTab===2)){
        container.innerHTML = "";
        taskPage.loadThisWeek();
        currentSection = 0;
        currentTab = 2;
    }
})

due.addEventListener("click", () => {
    if(!(currentSection===0 && currentTab===3)){
        container.innerHTML = "";
        taskPage.loadPastDue();
        currentSection = 0;
        currentTab = 3;
    }
});

