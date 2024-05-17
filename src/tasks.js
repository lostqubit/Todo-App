const task = (title,priority,dueDate,status="Not Finished",project="My Project") => {
    let taskTitle = title;
    let taskPriority = priority;
    let taskDueDate = dueDate;
    let taskStatus = status;
    let taskProject = project;

    return{
        get title() {return taskTitle},
        set title(newTitle) {taskTitle = newTitle},
        get priority() {return taskPriority},
        set priority(newPriority) {taskPriority = newPriority},
        get dueDate() {return taskDueDate},
        set dueDate(newDueDate) {taskDueDate = newDueDate},
        get status() {return taskStatus},
        set status(newStatus) {taskStatus = newStatus},
        get project() {return taskProject},
        set project(newProject) {taskProject=newProject},
    }
};

export default task;