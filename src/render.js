import task from './tasks.js';
import dataLoader from './data.js';
import {format,addDays,nextSunday,differenceInDays} from 'date-fns';
import addIcon from './icons/addtask.svg';
import editIcon from './icons/edit.svg';
import deleteIcon from './icons/delete.svg';
import closeIcon from './icons/close.svg';
import projectIcon from './icons/projects.svg';
import projectMenuIcon from './icons/projectMenu.svg';

const display = (() => {

    if(!localStorage.getItem("tasks")){
        dataLoader.populateTasks();
    }
    
    if(!localStorage.getItem("projects")){
        dataLoader.populateProjects();
    }
      
    const tasks = dataLoader.parseTasks();
    const projects = JSON.parse(localStorage.getItem("projects"));
      
    let count = parseInt(localStorage.getItem("count"));
    let projectCount = parseInt(localStorage.getItem("projectCount"));

    let parentDiv = document.querySelector("#content-body");
    let container;

    const projectContainer = document.querySelector("#projects>ul");

    let currentPage = 0;

    const createTaskForm = () => {
        const formContainer = document.createElement("div");
        formContainer.classList.add("taskform");

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
        titleInput.maxLength ="20";
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
        details.maxLength="100";
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
        for(let projectId of Object.keys(projects)){
            const projectOption = document.createElement("option");
            projectOption.innerText = projects[projectId];
            projectOption.value = projects[projectId];
            if(currentPage===4 && projects[projectId]===document.querySelector("#content-body>h2").innerText) projectOption.selected = true;
            projectList.appendChild(projectOption);   
        }
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
            dataLoader.saveCount(count);
            dataLoader.saveTasks(tasks);
            if(currentPage!==4 || (currentPage===4 && data.get('project')===document.querySelector("#content-body>h2").innerText)) addTask(newTask,count);
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

    const createEditTaskForm = (toEdit) => {
        const taskId = toEdit.split("-")[1];

        const formContainer = document.createElement("div");
        formContainer.classList.add("taskform");

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
        titleInput.maxLength ="20"
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
        details.maxLength = "100";
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
        for(let projectId of Object.keys(projects)){
            const projectOption = document.createElement("option");
            projectOption.innerText = projects[projectId];
            projectOption.value = projects[projectId];
            console.log(projects[projectId],tasks[taskId].project);
            if(projects[projectId] === tasks[taskId].project) projectOption.selected = true;
            projectList.appendChild(projectOption);
        }
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

            dataLoader.saveTasks(tasks);
            
            const card = document.querySelector(`#${toEdit}`);
            if(tasks[taskId].priority === "High"){
                card.style.borderLeft = "5px solid red";
            }
            else if(tasks[taskId].priority == "Medium"){
                card.style.borderLeft = "5px solid orange";
            }
            else{
                card.style.borderLeft = "5px solid green";
            }
            
            if(currentPage===0){
                document.querySelector(`#${toEdit}>.span-1>span`).innerText = tasks[taskId].title;
                document.querySelector(`#${toEdit}>.span-2>span`).innerText = tasks[taskId].dueDate;
            }
            else if(currentPage===1){
                if(tasks[taskId].dueDate === format(new Date(), 'dd/MM/yyyy')){
                    document.querySelector(`#${toEdit}>.span-1>span`).innerText = tasks[taskId].title;
                    document.querySelector(`#${toEdit}>.span-2>span`).innerText = tasks[taskId].dueDate;   
                }
                else{
                    document.querySelector(`#${toEdit}`).remove();
                }
            }
            else if(currentPage===2){
                const [d,m,y] = tasks[taskId].dueDate.split("/")
                const date = new Date(parseInt(y),parseInt(m)-1,parseInt(d));
                const delta = differenceInDays(nextSunday(new Date()),date);
                if(delta>=0 && delta<=7){
                    document.querySelector(`#${toEdit}>.span-1>span`).innerText = tasks[taskId].title;
                    document.querySelector(`#${toEdit}>.span-2>span`).innerText = tasks[taskId].dueDate;
                }
                else{
                    document.querySelector(`#${toEdit}`).remove();
                }
            }
            else if(currentPage===3){
                const [d,m,y] = tasks[taskId].dueDate.split("/")
                const date = new Date(parseInt(y),parseInt(m)-1,parseInt(d));
                const delta = differenceInDays(date,new Date());
                if(delta<0){
                    document.querySelector(`#${toEdit}>.span-1>span`).innerText = tasks[taskId].title;
                    document.querySelector(`#${toEdit}>.span-2>span`).innerText = tasks[taskId].dueDate;
                }
                else{
                    document.querySelector(`#${toEdit}`).remove();
                } 
            }
            else{
                const currentProject = document.querySelector("#content-body>h2").innerText;
                if(tasks[taskId].project===currentProject){
                    document.querySelector(`#${toEdit}>.span-1>span`).innerText = tasks[taskId].title;
                    document.querySelector(`#${toEdit}>.span-2>span`).innerText = tasks[taskId].dueDate;
                }
                else document.querySelector(`#${toEdit}`).remove();
            }

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

        details.addEventListener("click",(event) => {
            const detailsId = event.target.parentElement.parentElement.id.split("-")[1];
            const detailsContainer = document.createElement("div");
            detailsContainer.id = "view-details";
            detailsContainer.style.display = "flex";

            const div = document.createElement("div");
            div.id = "details-content"
            
            const div1 = document.createElement("div");
            const closeDetails = document.createElement("img");
            closeDetails.src = closeIcon;
            div1.appendChild(closeDetails);
            div.appendChild(div1);

            const detailsTitle = document.createElement("h1");
            detailsTitle.innerText = tasks[detailsId].title;
            div.appendChild(detailsTitle);
            
            const div2 = document.createElement("div");

            const detailsProjectHeading = document.createElement("p");
            detailsProjectHeading.innerText = "Project:";
            const detailsProject = document.createElement("p");
            detailsProject.innerText = tasks[detailsId].project;
            div2.appendChild(detailsProjectHeading);
            div2.appendChild(detailsProject);

            const detailsPriorityHeading = document.createElement("p");
            detailsPriorityHeading.innerText = "Priority:"
            const detailsPriority = document.createElement("p");
            detailsPriority.innerText = tasks[detailsId].priority;
            div2.appendChild(detailsPriorityHeading);
            div2.appendChild(detailsPriority);

            const detailsDueDateHeading = document.createElement("p");
            detailsDueDateHeading.innerText = "Due Date:"
            const detailsDueDate = document.createElement("p");
            detailsDueDate.innerText = tasks[detailsId].dueDate;
            div2.appendChild(detailsDueDateHeading);
            div2.appendChild(detailsDueDate);

            const detailsDescriptionHeading = document.createElement("p");
            detailsDescriptionHeading.innerText = "Details:"
            const detailsDescription = document.createElement("p");
            if(tasks[detailsId].details===""){
                detailsDescription.innerText = "N/A";
            }
            else{
                detailsDescription.innerText = tasks[detailsId].details;
            }
            div2.appendChild(detailsDescriptionHeading);
            div2.appendChild(detailsDescription);

            div.appendChild(div2);
            detailsContainer.appendChild(div);
            parentDiv.appendChild(detailsContainer);

            closeDetails.addEventListener("click", ()=>{
                detailsContainer.remove();
            })
        });
        
        editImg.addEventListener("click",(event) => {
            const toedit = event.target.parentElement.parentElement.id;
            parentDiv.appendChild(createEditTaskForm(toedit));
        });

        deleteImg.addEventListener("click",(event) => {
            const toDelete = event.target.parentElement.parentElement.id;
            document.querySelector(`#${toDelete}`).remove();
            delete tasks[toDelete.split("-")[1]];
            dataLoader.saveTasks(tasks);
        });

        span2.appendChild(details);
        span2.appendChild(dueDate);
        span2.appendChild(editImg);
        span2.appendChild(deleteImg);

        card.appendChild(span1);
        card.appendChild(span2);

        return{checkBox,card,title,dueDate};
    }

    const addTask = (task,taskId) => {
        const {checkBox,card,title,dueDate} = createTaskContainer();
        card.id = `task-${taskId}`;
        if(tasks[taskId].priority === "High"){
            card.style.borderLeft = "5px solid red";
        }
        else if(tasks[taskId].priority == "Medium"){
            card.style.borderLeft = "5px solid orange";
        }
        else{
            card.style.borderLeft = "5px solid green";
        }
        title.innerText = task.title;
        dueDate.innerText = task.dueDate;
        if(task.status === "Finished"){
            checkBox.checked = true;
            card.style.opacity = "0.5";
            title.style.textDecoration = "line-through";
        }
        checkBox.addEventListener("change", () => {
            if(checkBox.checked){
                tasks[taskId].status = "Finished";
                dataLoader.saveTasks(tasks);
                card.style.opacity = "0.5";
                title.style.textDecoration = "line-through";
            }
            else{
                tasks[taskId].status = "Not Finished";
                dataLoader.saveTasks(tasks);
                card.style.opacity = "1";
                title.style.textDecoration = "none";
            }
        });
        container.prepend(card);
    };

    const loadAll = () => {
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

        button.addEventListener("click", () => {
            parentDiv.appendChild(createTaskForm());
        });

        for(let taskId of Object.keys(tasks)){
            addTask(tasks[taskId],taskId);
        }

        currentPage = 0;
    };

    const loadToday = () => {
        container = document.createElement("div");
        container.setAttribute("class","tasks");

        const heading = document.createElement("h2");
        heading.append("Today");

        parentDiv.appendChild(heading);
        parentDiv.appendChild(container);

        const currentDate = format(new Date(), 'dd/MM/yyyy');

        for(let taskId of Object.keys(tasks)){
            if(tasks[taskId].dueDate === currentDate) addTask(tasks[taskId],taskId);
        }

        currentPage = 1;
    };

    const loadThisWeek = () => {
        container = document.createElement("div");
        container.setAttribute("class","tasks");

        const heading = document.createElement("h2");
        heading.append("This Week");

        parentDiv.appendChild(heading);
        parentDiv.appendChild(container);

        const weekend = nextSunday(new Date());

        for(let taskId of Object.keys(tasks)){
            const [d,m,y] = tasks[taskId].dueDate.split("/")
            const date = new Date(parseInt(y),parseInt(m)-1,parseInt(d));
            const delta = differenceInDays(weekend,date);
            if(delta>=0 && delta<=7) addTask(tasks[taskId],taskId);
        }

        currentPage = 2;
    };

    const loadPastDue = () => {
        container = document.createElement("div");
        container.setAttribute("class","tasks");

        const heading = document.createElement("h2");
        heading.append("Past Due");

        parentDiv.appendChild(heading);
        parentDiv.appendChild(container);

        for(let taskId of Object.keys(tasks)){
            const [d,m,y] = tasks[taskId].dueDate.split("/")
            const date = new Date(parseInt(y),parseInt(m)-1,parseInt(d));
            const delta = differenceInDays(date,new Date());
            if(delta<0) addTask(tasks[taskId],taskId);
        }

        currentPage = 3;
    };

    const loadProjectTasks = (name) => {
        currentPage = 4;

        container = document.createElement("div");
        container.setAttribute("class","tasks");

        const heading = document.createElement("h2");
        heading.append(name);

        const button = document.createElement("button");
        button.classList.add("addTask");
        const addImage = document.createElement("img");
        addImage.src = addIcon;

        button.appendChild(addImage);
        heading.appendChild(button);

        parentDiv.appendChild(heading);
        parentDiv.appendChild(container);

        button.addEventListener("click", () => {
            parentDiv.appendChild(createTaskForm());
        });

        for(let taskId of Object.keys(tasks)){
            if(tasks[taskId].project === name) addTask(tasks[taskId],taskId);
        }
    };

    const createProject = (name,newProjectId=-1) => {
        if(newProjectId===-1){
            projectCount++;
            projects[projectCount] = name;
            dataLoader.saveProjectCount(projectCount);
            dataLoader.saveProjects(projects);
        }

        const project = document.createElement("li");
        const span1 = document.createElement("span");
        const projectImg = document.createElement("img");
        projectImg.src = projectIcon;
        span1.appendChild(projectImg);
        const span2 = document.createElement("span");
        span2.innerText = name;
        span1.appendChild(span2);

        const dropdown = document.createElement("div");
        dropdown.classList.add("dropdown");
        if(newProjectId===-1) dropdown.id = `dropdown-${projectCount}`;
        else dropdown.id = `dropdown-${newProjectId}`
        const projectMenuImg = document.createElement("img");
        projectMenuImg.src = projectMenuIcon;
        if(newProjectId===-1) projectMenuImg.id = `project-${projectCount}`;
        else projectMenuImg.id = `project-${newProjectId}`;
        projectMenuImg.classList.add("dropdown-icon");
        dropdown.appendChild(projectMenuImg);

        project.appendChild(span1);
        project.appendChild(dropdown);

        span1.addEventListener("click", (event) => {
            parentDiv.innerHTML = "";
            loadProjectTasks(event.target.innerText);
        });

        projectMenuImg.addEventListener("click", (event) => {
            if(document.querySelector(".dropdown-content")) {
                if(event.target.id.split("-")[1] === document.querySelector(".dropdown-content").id.split("-")[2]){
                    document.querySelector(".dropdown-content").remove();
                    return;
                }
                else{
                    document.querySelector(".dropdown-content").remove();
                }
            }
            const projectId = event.target.id.split("-")[1];
            const dropdownDiv = document.createElement("div");
            dropdownDiv.classList.add("dropdown-content");
            dropdownDiv.id = `dropdown-content-${projectId}`;
            const ul = document.createElement("ul");
            const editOption = document.createElement("li");
            editOption.innerText = "Edit";
            const deleteOption = document.createElement("li");
            deleteOption.innerText = "Delete";
            ul.appendChild(editOption);
            ul.appendChild(deleteOption);
            dropdownDiv.appendChild(ul);
            dropdown.appendChild(dropdownDiv);

            editOption.addEventListener("click", () => {
                editProjectForm(projectId,span2);
            });

            deleteOption.addEventListener("click", () => {
                delete projects[projectId];
                dataLoader.saveProjects(projects);
                for(let taskId of Object.keys(tasks)){
                    if(tasks[taskId].project===span2.innerText) delete tasks[taskId];
                }
                dataLoader.saveTasks(tasks);
                parentDiv.innerHTML = "";
                loadAll();
                project.remove();
            });

            window.addEventListener('click', (event) => {
                if (!event.target.matches('.dropdown-icon')) {
                    if(document.querySelector(".dropdown-content")){
                        dropdownDiv.remove();
                    }
                }
            });
        });

        return project;
    };

    const editProjectForm = (toEditId,toEditHeading) => {
        const editProjectContainer = document.createElement("div");
        editProjectContainer.id = "editProject";

        const div = document.createElement("div");
        div.id = "editProject-content"
        
        const div1 = document.createElement("div");
        const closeProjects = document.createElement("img");
        closeProjects.src = closeIcon;
        div1.appendChild(closeProjects);
        div.appendChild(div1);

        const heading = document.createElement("h1");
        heading.innerText = "Edit Project";
        div.appendChild(heading);

        const div2 = document.createElement("div");

        const newProjectForm = document.createElement("form");
        newProjectForm.id = "editProject-form";
        const newProjectInput = document.createElement("input");
        newProjectInput.name = "project";
        newProjectInput.required = true;
        newProjectInput.maxLength ="10";
        newProjectInput.value = projects[toEditId];
        newProjectForm.appendChild(newProjectInput);
        div2.appendChild(newProjectForm);

        const div3 = document.createElement("div");
        const editProjectButton = document.createElement("button");
        editProjectButton.innerText = "Save";
        editProjectButton.setAttribute("form","editProject-form");
        const cancelProjectButton = document.createElement("button");
        cancelProjectButton.innerText = "Cancel";
        div3.appendChild(editProjectButton);
        div3.appendChild(cancelProjectButton);
        div2.appendChild(div3);
        div.appendChild(div2);

        editProjectContainer.appendChild(div);
        parentDiv.appendChild(editProjectContainer);

        closeProjects.addEventListener("click", () => {
            editProjectContainer.remove();
        });

        cancelProjectButton.addEventListener("click", () => {
            editProjectContainer.remove();
        });

        newProjectForm.addEventListener("submit",(event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            const newProjectName = data.get("project").slice(0,1).toUpperCase()+data.get('project').slice(1);
            for(let taskId of Object.keys(tasks)){
                if(tasks[taskId].project===projects[toEditId]) tasks[taskId].project = newProjectName;
            }
            dataLoader.saveTasks(tasks);
            projects[toEditId] = newProjectName;
            dataLoader.saveProjects(projects);
            toEditHeading.innerText = newProjectName;
            editProjectContainer.remove();
            parentDiv.innerHTML = "";
            loadProjectTasks(newProjectName);
        });
    };

    const addProjectForm = () => {
        const addProjectContainer = document.createElement("div");
        addProjectContainer.id = "add-project";

        const div = document.createElement("div");
        div.id = "addProject-content"
        
        const div1 = document.createElement("div");
        const closeProjects = document.createElement("img");
        closeProjects.src = closeIcon;
        div1.appendChild(closeProjects);
        div.appendChild(div1);

        const heading = document.createElement("h1");
        heading.innerText = "Create Project";
        div.appendChild(heading);

        const div2 = document.createElement("div");

        const newProjectForm = document.createElement("form");
        newProjectForm.id = "addProject-form";
        const newProjectInput = document.createElement("input");
        newProjectInput.placeholder = "Gym";
        newProjectInput.name = "project";
        newProjectInput.required = true;
        newProjectInput.maxLength ="10";
        newProjectForm.appendChild(newProjectInput);
        div2.appendChild(newProjectForm);

        const div3 = document.createElement("div");
        const addProjectButton = document.createElement("button");
        addProjectButton.innerText = "Add";
        addProjectButton.setAttribute("form","addProject-form");
        const cancelProjectButton = document.createElement("button");
        cancelProjectButton.innerText = "Cancel";
        div3.appendChild(addProjectButton);
        div3.appendChild(cancelProjectButton);
        div2.appendChild(div3);
        div.appendChild(div2);

        addProjectContainer.appendChild(div);
        parentDiv.appendChild(addProjectContainer);

        closeProjects.addEventListener("click", () => {
            addProjectContainer.remove();
        });

        cancelProjectButton.addEventListener("click", () => {
            addProjectContainer.remove();
        });

        newProjectForm.addEventListener("submit",(event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            const newProjectName = data.get("project").slice(0,1).toUpperCase()+data.get('project').slice(1);
            projectContainer.appendChild(createProject(newProjectName));
            addProjectContainer.remove();
            parentDiv.innerHTML = "";
            loadProjectTasks(newProjectName);
        });
    };

    const loadProjects = () => {
        const addProjectButton = document.querySelector("#projects>h2>img");
        addProjectButton.addEventListener("click", addProjectForm);
        for(let projectId of Object.keys(projects)){
            const project = createProject(projects[projectId],projectId);
            projectContainer.appendChild(project);
        }
    };

    return {loadAll,loadToday,loadThisWeek,loadPastDue,loadProjects};
})();

export default display;