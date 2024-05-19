import task from './tasks.js';
import {format} from 'date-fns';
import addIcon from './icons/addtask.svg';
import editIcon from './icons/edit.svg';
import deleteIcon from './icons/delete.svg';
import closeIcon from './icons/close.svg';

const taskPage = (() => {
    const tasks = {};
    let count = 0;

    for(let i=1;i<=100;i++){
        count++;
        tasks[count] = task(`Test-${i}`,"High",format(new Date(), 'dd/MM/yyyy'));;
    }

    let parentDiv = document.querySelector("#content-body");
    let container;
    let taskFormContainer;

    const createTaskForm = () => {
        const formContainer = document.createElement("div");
        formContainer.classList.add("taskform");
        formContainer.style.display = "none";

        const newTaskDiv = document.createElement("div");

        const heading = document.createElement("h2");
        const span = document.createElement("span");
        span.innerText = "Add New Task";
        const closeButton = document.createElement("img");
        closeButton.src = closeIcon;
        heading.append(span);
        heading.appendChild(closeButton);

        const form = document.createElement("form");
        form.id = "add-todo";
        
        const div1 = document.createElement("div");
        const titleLabel = document.createElement("label");
        titleLabel.innerText = "Title:"
        titleLabel.for = "title";
        const titleInput = document.createElement("input");
        titleInput.placeholder = "Pay Bills";
        titleInput.id = "title";
        titleInput.name = "title";
        titleInput.required = true;
        div1.appendChild(titleLabel);
        div1.appendChild(titleInput);
        form.appendChild(div1);
        
        const div2 = document.createElement("div");
        const detailsLabel = document.createElement("label");
        detailsLabel.innerText = "Details(Optional):";
        detailsLabel.for = "details";
        const details = document.createElement("textarea");
        details.placeholder = "e.g internet, phone, rent";
        details.id = "details";
        details.name = "details";
        details.rows = "10";
        details.cols = "50";
        div2.appendChild(detailsLabel);
        div2.appendChild(details);
        form.appendChild(div2);

        const div3 = document.createElement("div");
        const subdiv1 = document.createElement("div");
        const projectLabel = document.createElement("label");
        projectLabel.innerText = "Project:"
        projectLabel.for = "project";
        const projectList = document.createElement("select");
        projectList.id = "project";
        projectList.name = "project";
        const projectOption1 = document.createElement("option");
        projectOption1.innerText = "General";
        projectOption1.value = "General";
        projectList.appendChild(projectOption1);
        subdiv1.appendChild(projectLabel);
        subdiv1.appendChild(projectList);
        const subdiv2 = document.createElement("div");
        const dateLabel = document.createElement("label");
        dateLabel.innerText = "Due Date:";
        dateLabel.for = "date";
        const datePicker = document.createElement("input");
        datePicker.required = true;
        datePicker.type = "date";
        datePicker.id = "date";
        datePicker.name = "date";
        datePicker.valueAsDate = new Date();
        subdiv2.appendChild(dateLabel);
        subdiv2.appendChild(datePicker);
        div3.appendChild(subdiv1);
        div3.appendChild(subdiv2);
        form.appendChild(div3);

        const div4 = document.createElement("div");
        const priorityLabel = document.createElement("label");
        priorityLabel.innerText = "Priority:";
        priorityLabel.for = "priority";
        const priorityList = document.createElement("select");
        priorityList.id = "priority";
        priorityList.name = "priority";
        const priorityOption1 = document.createElement("option");
        priorityOption1.innerText = "High";
        priorityOption1.value = "High";
        const priorityOption2 = document.createElement("option");
        priorityOption2.innerText = "Medium";
        priorityOption2.value = "Medium";
        const priorityOption3 = document.createElement("option");
        priorityOption3.innerText = "Low";
        priorityOption3.value = "Low";
        priorityList.appendChild(priorityOption1);
        priorityList.appendChild(priorityOption2);
        priorityList.appendChild(priorityOption3);
        div4.appendChild(priorityLabel);
        div4.appendChild(priorityList);
        form.appendChild(div4);

        const div5 = document.createElement("div");
        const addButton = document.createElement("button");
        addButton.innerText = "Add Todo";
        addButton.setAttribute("form","add-todo");
        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        div5.appendChild(addButton);
        div5.appendChild(cancelButton);

        newTaskDiv.appendChild(heading);
        newTaskDiv.appendChild(form);
        newTaskDiv.appendChild(div5);
        formContainer.appendChild(newTaskDiv);

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            const newTask = task(data.get('title'),data.get('priority'),format(new Date(data.get("date")), 'dd/MM/yyyy'),data.get('project'),data.get('details'));
            count++;
            tasks[count] = newTask;
            addTask(newTask,count);
            formContainer.style.display = "none";
            form.reset();
            datePicker.valueAsDate = new Date();
        });

        closeButton.addEventListener("click",() => {
            formContainer.style.display = "none";
            datePicker.valueAsDate = new Date();
        });

        cancelButton.addEventListener("click", () => {
            form.reset();
            formContainer.style.display = "none";
            datePicker.valueAsDate = new Date();
        });

        return formContainer;
    };

    const createEditTaskForm = (toEdit) => {
        const taskId = toEdit.split("-")[1];

        const formContainer = document.createElement("div");
        formContainer.classList.add("taskform");
        formContainer.style.display = "flex";

        const newTaskDiv = document.createElement("div");

        const heading = document.createElement("h2");
        const span = document.createElement("span");
        span.innerText = "Edit Task";
        const closeButton = document.createElement("img");
        closeButton.src = closeIcon;
        heading.append(span);
        heading.appendChild(closeButton);

        const form = document.createElement("form");
        form.id = "edit-todo";
        
        const div1 = document.createElement("div");
        const titleLabel = document.createElement("label");
        titleLabel.innerText = "Title:"
        titleLabel.for = "edit-title";
        const titleInput = document.createElement("input");
        titleInput.id = "edit-title";
        titleInput.name = "title";
        titleInput.required = true;
        titleInput.value = tasks[taskId].title;
        div1.appendChild(titleLabel);
        div1.appendChild(titleInput);
        form.appendChild(div1);
        
        const div2 = document.createElement("div");
        const detailsLabel = document.createElement("label");
        detailsLabel.innerText = "Details(Optional):";
        detailsLabel.for = "edit-details";
        const details = document.createElement("textarea");
        details.id = "edit-details";
        details.name = "details";
        details.rows = "10";
        details.cols = "50";
        details.value = tasks[taskId].details;
        div2.appendChild(detailsLabel);
        div2.appendChild(details);
        form.appendChild(div2);

        const div3 = document.createElement("div");
        const subdiv1 = document.createElement("div");
        const projectLabel = document.createElement("label");
        projectLabel.innerText = "Project:"
        projectLabel.for = "edit-project";
        const projectList = document.createElement("select");
        projectList.id = "edit-project";
        projectList.name = "project";
        const projectOption1 = document.createElement("option");
        projectOption1.innerText = "General";
        projectOption1.value = "General";
        projectOption1.selected = true;
        projectList.appendChild(projectOption1);
        subdiv1.appendChild(projectLabel);
        subdiv1.appendChild(projectList);
        const subdiv2 = document.createElement("div");
        const dateLabel = document.createElement("label");
        dateLabel.innerText = "Due Date:";
        dateLabel.for = "edit-date";
        const datePicker = document.createElement("input");
        datePicker.required = true;
        datePicker.type = "date";
        datePicker.id = "edit-date";
        datePicker.name = "date";
        const [d,m,y] = tasks[taskId].dueDate.split('/');
        datePicker.value = `${y}-${m}-${d}`;
        subdiv2.appendChild(dateLabel);
        subdiv2.appendChild(datePicker);
        div3.appendChild(subdiv1);
        div3.appendChild(subdiv2);
        form.appendChild(div3);

        const div4 = document.createElement("div");
        const priorityLabel = document.createElement("label");
        priorityLabel.innerText = "Priority:";
        priorityLabel.for = "edit-priority";
        const priorityList = document.createElement("select");
        priorityList.id = "edit-priority";
        priorityList.name = "priority";
        const priorityOption1 = document.createElement("option");
        priorityOption1.innerText = "High";
        priorityOption1.value = "High";
        const priorityOption2 = document.createElement("option");
        priorityOption2.innerText = "Medium";
        priorityOption2.value = "Medium";
        const priorityOption3 = document.createElement("option");
        priorityOption3.innerText = "Low";
        priorityOption3.value = "Low";
        if(tasks[taskId].priority === "High") priorityOption1.selected = true;
        else if(tasks[taskId].priority === "Medium") priorityOption2.selected = true;
        else priorityOption3.selected = true;
        priorityList.appendChild(priorityOption1);
        priorityList.appendChild(priorityOption2);
        priorityList.appendChild(priorityOption3);
        div4.appendChild(priorityLabel);
        div4.appendChild(priorityList);
        form.appendChild(div4);

        const div5 = document.createElement("div");
        const addButton = document.createElement("button");
        addButton.innerText = "Save";
        addButton.setAttribute("form","edit-todo");
        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        div5.appendChild(addButton);
        div5.appendChild(cancelButton);

        newTaskDiv.appendChild(heading);
        newTaskDiv.appendChild(form);
        newTaskDiv.appendChild(div5);
        formContainer.appendChild(newTaskDiv);

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            tasks[taskId].title = data.get('title')
            tasks[taskId].priority = data.get('priority')
            tasks[taskId].dueDate = format(new Date(data.get("date")), 'dd/MM/yyyy')
            tasks[taskId].project = data.get('project');
            tasks[taskId].details = data.get('details');

            document.querySelector(`#${toEdit}>.span-1>span`).innerText = tasks[taskId].title;
            document.querySelector(`#${toEdit}>.span-2>span`).innerText = tasks[taskId].dueDate;

            formContainer.remove();
        });

        closeButton.addEventListener("click",() => {
            formContainer.remove();
        });

        cancelButton.addEventListener("click", () => {
            formContainer.remove();
        });

        return formContainer;
    };

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

        editImg.addEventListener("click",(event) => {
            const toedit = event.target.parentElement.parentElement.id;
            parentDiv.appendChild(createEditTaskForm(toedit));
        });

        deleteImg.addEventListener("click",(event) => {
            const toDelete = event.target.parentElement.parentElement.id;
            document.querySelector(`#${toDelete}`).remove();
            delete tasks[toDelete.split("-")[1]];
        });

        span2.appendChild(details);
        span2.appendChild(dueDate);
        span2.appendChild(editImg);
        span2.appendChild(deleteImg);

        card.appendChild(span1);
        card.appendChild(span2);

        return{card,title,dueDate};
    }

    const addTask = (task,taskId) => {
        const {card,title,dueDate} = createTaskContainer();
        card.id = `task-${taskId}`;
        title.innerText = task.title;
        dueDate.innerText = task.dueDate;
        container.prepend(card);
    };

    const load = () => {
        container = document.createElement("div");
        container.setAttribute("class","tasks");

        const heading = document.createElement("h2");
        heading.append("Tasks");

        const button = document.createElement("button");
        button.classList.add("addTask");
        const addImage = document.createElement("img");
        addImage.src = addIcon;

        button.appendChild(addImage);
        heading.appendChild(button);

        parentDiv.appendChild(heading);
        parentDiv.appendChild(container);

        taskFormContainer = createTaskForm();
        parentDiv.appendChild(taskFormContainer);

        button.addEventListener("click", () => {
            taskFormContainer.style.display = "flex";
        });

        for(let taskId of Object.keys(tasks)){
            addTask(tasks[taskId],taskId);
        }
    };

    return {load,addTask};
})();

export default taskPage;