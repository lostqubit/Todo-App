import './style.css';
import display from './render.js';

display.loadProjects();
display.loadAll();

const container = document.querySelector("#content-body")

const allTasks = document.querySelector("#home>ul>li:first-child");
const today = document.querySelector("#home>ul>li:nth-child(2)");
const thisWeek = document.querySelector("#home>ul>li:nth-child(3)");
const due = document.querySelector("#home>ul>li:last-child");

allTasks.addEventListener("click", () => {
    container.innerHTML = "";
    display.loadAll();
});

today.addEventListener("click", () => {
    container.innerHTML = "";
    display.loadToday();
});

thisWeek.addEventListener("click", () => {
    container.innerHTML = "";
    display.loadThisWeek();
})

due.addEventListener("click", () => {
    container.innerHTML = "";
    display.loadPastDue();
});

