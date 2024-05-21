import task from'./tasks.js';
import {format, addDays} from 'date-fns';

const dataLoader = (() => {

    const populateTasks = () => {
        const dummyData = [
            { title: "Buy groceries", priority: "High", category: "General", details: "Milk, Eggs, Bread, and Butter", status: "Not Finished" },
            { title: "Finish project report", priority: "Medium", category: "Work", details: "Complete the final draft of the project report", status: "Not Finished" },
            { title: "Book dentist appointment", priority: "Low", category: "General", details: "Call the clinic and book an appointment", status: "Not Finished" },
            { title: "Prepare for presentation", priority: "High", category: "Work", details: "Prepare slides and practice speech", status: "Not Finished" },
            { title: "Attend yoga class", priority: "Medium", category: "General", details: "Join the 6 PM session at the community center", status: "Finished" },
            { title: "Pay utility bills", priority: "High", category: "General", details: "Pay electricity and water bills online", status: "Not Finished" },
            { title: "Read a book", priority: "Low", category: "General", details: "Finish reading 'The Alchemist'", status: "Finished" },
            { title: "Plan weekend trip", priority: "Medium", category: "General", details: "Choose a destination and book accommodation", status: "Not Finished" },
            { title: "Clean the house", priority: "Low", category: "General", details: "Vacuum, dust, and mop all rooms", status: "Not Finished" },
            { title: "Schedule team meeting", priority: "High", category: "Work", details: "Set up a meeting with the project team to discuss progress", status: "Finished" },
            { title: "Grocery shopping", priority: "High", category: "General", details: "Buy vegetables and fruits", status: "Finished" },
            { title: "Submit tax documents", priority: "Medium", category: "Work", details: "Prepare and submit tax returns", status: "Not Finished" },
            { title: "Renew car insurance", priority: "High", category: "General", details: "Renew policy before expiry", status: "Not Finished" },
            { title: "Write blog post", priority: "Medium", category: "Work", details: "Draft and publish a new blog post", status: "Not Finished" },
            { title: "Water the plants", priority: "Low", category: "General", details: "Water all indoor and outdoor plants", status: "Finished" },
            { title: "Laundry", priority: "Medium", category: "General", details: "Wash and fold clothes", status: "Not Finished" },
            { title: "Call mom", priority: "High", category: "General", details: "Catch up with mom over the phone", status: "Finished" },
            { title: "Fix the leaky faucet", priority: "Low", category: "General", details: "Replace washers in the kitchen sink", status: "Not Finished" },
            { title: "Walk the dog", priority: "High", category: "General", details: "Take the dog for a 30-minute walk", status: "Finished" },
            { title: "Check emails", priority: "Medium", category: "Work", details: "Respond to important emails", status: "Not Finished" },
            { title: "Prepare dinner", priority: "High", category: "General", details: "Cook a healthy meal for the family", status: "Not Finished" },
            { title: "Work on side project", priority: "Medium", category: "Work", details: "Develop features for the side project", status: "Not Finished" },
            { title: "Buy a birthday gift", priority: "High", category: "General", details: "Purchase a gift for a friend's birthday", status: "Not Finished" },
            { title: "Clean the garage", priority: "Low", category: "General", details: "Organize and clean the garage", status: "Not Finished" },
            { title: "Practice guitar", priority: "Medium", category: "General", details: "Practice guitar for 30 minutes", status: "Finished" },
            { title: "Meditate", priority: "High", category: "General", details: "Spend 15 minutes meditating", status: "Not Finished" },
            { title: "Review finances", priority: "Low", category: "General", details: "Check and update the budget", status: "Finished" },
            { title: "Exercise", priority: "High", category: "General", details: "Go for a 30-minute run", status: "Finished" },
            { title: "Plan family picnic", priority: "Medium", category: "General", details: "Organize a picnic at the local park", status: "Not Finished" },
            { title: "Attend workshop", priority: "High", category: "Work", details: "Participate in the skill development workshop", status: "Not Finished" },
            { title: "Fix the car", priority: "Low", category: "General", details: "Change oil and check tire pressure", status: "Not Finished" },
            { title: "Write thank you notes", priority: "Medium", category: "General", details: "Send thank you notes to friends", status: "Finished" },
            { title: "Attend doctor's appointment", priority: "High", category: "General", details: "Annual physical check-up", status: "Not Finished" },
            { title: "Organize files", priority: "Low", category: "Work", details: "Sort and file important documents", status: "Finished" },
            { title: "Cook a new recipe", priority: "Medium", category: "General", details: "Try making a new dish", status: "Not Finished" },
            { title: "Plan project timeline", priority: "High", category: "Work", details: "Create a timeline for the new project", status: "Not Finished" },
            { title: "Watch a movie", priority: "Low", category: "General", details: "Watch a new release movie", status: "Finished" },
            { title: "Volunteer at shelter", priority: "High", category: "General", details: "Help out at the local animal shelter", status: "Not Finished" },
            { title: "Plan vacation", priority: "Medium", category: "General", details: "Plan the details of the summer vacation", status: "Not Finished" },
            { title: "Renew gym membership", priority: "High", category: "General", details: "Renew membership for the next month", status: "Not Finished" },
            { title: "Write progress report", priority: "Medium", category: "Work", details: "Prepare the monthly progress report", status: "Finished" },
            { title: "Clean the fridge", priority: "Low", category: "General", details: "Clean and organize the refrigerator", status: "Not Finished" },
            { title: "Study for exams", priority: "High", category: "Study", details: "Review notes and practice problems", status: "Finished" },
            { title: "Complete assignment", priority: "Medium", category: "Study", details: "Finish and submit the assignment before the deadline", status: "Not Finished" },
            { title: "Attend study group", priority: "Low", category: "Study", details: "Participate in the study group meeting", status: "Finished" },
            { title: "Organize study materials", priority: "Medium", category: "Study", details: "Sort and file study notes and materials", status: "Not Finished" },
            { title: "Read research papers", priority: "High", category: "Study", details: "Read and summarize recent research papers", status: "Not Finished" },
            { title: "Prepare for quiz", priority: "Medium", category: "Study", details: "Study for the upcoming quiz", status: "Finished" },
            { title: "Watch online lecture", priority: "Low", category: "Study", details: "Watch and take notes from the online lecture", status: "Not Finished" }
        ];

        const tasks = {};
        let count = 0;

        for(let data of dummyData){
            count++;
            let offset;
            if(count<=3) offset = -1-Math.floor(Math.random()*7);
            else if(count<=8) offset = 0; 
            else offset = Math.floor(Math.random()*20);
            tasks[count] = [data.title,data.priority,format(addDays(new Date(),offset), "dd/MM/yyyy"),data.category,data.details,data.status];
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("count", count);
    };

    const populateProjects = () => {
        const dummyProjects = ["General","Work","Study"];

        const projects = {};
        let projectCount = 0;

        for(let project of dummyProjects){
            projectCount++;
            projects[projectCount] = project;
        }

        localStorage.setItem("projects", JSON.stringify(projects));
        localStorage.setItem("projectCount", projectCount);
    };

    const parseTasks = () => {
        const rawData = JSON.parse(localStorage.getItem("tasks"));
        const parsedData = {};

        for(let dataId of Object.keys(rawData)){
            parsedData[dataId] = task(rawData[dataId][0],rawData[dataId][1],rawData[dataId][2],rawData[dataId][3],rawData[dataId][4],rawData[dataId][5]);
        }

        return parsedData;
    };

    const saveTasks = (tasks) => {
        const savedTasks = {};

        for(let taskId of Object.keys(tasks)){
            const taskData = tasks[taskId];
            savedTasks[taskId] = [taskData.title,taskData.priority,taskData.dueDate,taskData.project,taskData.details,taskData.status];
        }

        localStorage.setItem("tasks",JSON.stringify(savedTasks));
    };

    const saveProjects = (projects) => {
        localStorage.setItem("projects",JSON.stringify(projects));
    };

    const saveCount = (count) => {
        localStorage.setItem("count",count);
    };

    const saveProjectCount = (projectCount) => {
        localStorage.setItem("projectCount",projectCount);
    };

    return {populateTasks, parseTasks, populateProjects, saveTasks, saveProjects, saveCount, saveProjectCount};
})();

export default dataLoader;