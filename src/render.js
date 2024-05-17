import editIcon from './icons/edit.svg';
import deleteIcon from './icons/delete.svg';

const display = (() => {
    let parentDiv = document.querySelector("#content-body");
    let container = document.querySelector("#content-body>div");

    const createTaskContainer = () => {
        const card = document.createElement("div");
        card.classList.add("task-card");

        const span1 = document.createElement("span");
        span1.classList.add("span-1");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        const title = document.createElement("span");

        span1.appendChild(checkBox);
        span1.appendChild(title);

        const span2 = document.createElement("span");
        span2.classList.add("span-2")

        const details = document.createElement("button")
        details.innerText = "DETAILS";
        const dueDate = document.createElement("span");
        const editImg = document.createElement("img");
        editImg.src = editIcon;
        const deleteImg = document.createElement("img");
        deleteImg.src = deleteIcon;

        span2.appendChild(details);
        span2.appendChild(dueDate);
        span2.appendChild(editImg);
        span2.appendChild(deleteImg);

        card.appendChild(span1);
        card.appendChild(span2);

        return{card,title,dueDate};
    }

    const addTask = (task) => {
        const {card,title,dueDate} = createTaskContainer();
        title.innerText = task.title;
        dueDate.innerText = task.dueDate;
        container.appendChild(card);
    };

    return {addTask};
})();

export default display;