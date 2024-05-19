const task = (title,priority,dueDate,project="General",details="",status="Not Finished") => {
    let taskTitle = title;
    let taskPriority = priority;
    let taskDueDate = dueDate;
    let taskStatus = status;
    let taskProject = project;
    let taskDetails = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius debitis, ab blanditiis vero reprehenderit enim. Saepe blanditiis, ratione minima aliquid iste ea. Accusantium, illo! Debitis cum quam numquam quas suscipit!";

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
        get details() {return taskDetails},
        set details(newDetail) {taskDetails = newDetail}, 
    }
};

export default task;