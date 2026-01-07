const taskInput = document.querySelector(".taskInput");
const taskDateInput = document.querySelector(".taskDateInput");
const taskTimeInput = document.querySelector(".taskTimeInput");
const addTaskBtn = document.querySelector(".addTaskBtn");
const taskList = document.querySelector("ul");
const themeBtn = document.querySelector(".themeBtn");
const enableNotificationsBtn = document.querySelector(".enableNotificationsBtn");

enableNotificationsBtn.addEventListener("click", () => {
    Notification.requestPermission().then((result) => {
        console.log("Notification permission status:", result);
        if (result === "granted") {
            console.log("Notifications have been enabled.");
            enableNotificationsBtn.textContent = "Notifications Enabled";
            enableNotificationsBtn.disabled = true;
        }
    });
});

themeBtn.addEventListener("click", () => {
    const dark = document.body.style.backgroundColor === "white";

    if (dark) {
        document.body.style.backgroundColor = "rgb(8, 25, 54)";
        document.body.style.color = "white";
        themeBtn.textContent = "Light";
        themeBtn.style.backgroundColor = "white";
        themeBtn.style.color = "black";
        taskInput.style.backgroundColor = "rgb(8, 25, 54)";
        taskInput.style.color = "white";
        taskDateInput.style.backgroundColor = "rgb(8, 25, 54)";
        taskDateInput.style.color = "white";
        taskTimeInput.style.backgroundColor = "rgb(8, 25, 54)";
        taskTimeInput.style.color = "white";
    } else {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";
        themeBtn.textContent = "Dark";
        themeBtn.style.backgroundColor = "rgb(8, 25, 54)";
        themeBtn.style.color = "white";
        taskInput.style.backgroundColor = "white";
        taskInput.style.color = "black";
        taskDateInput.style.backgroundColor = "white";
        taskDateInput.style.color = "black";
        taskTimeInput.style.backgroundColor = "white";
        taskTimeInput.style.color = "black";
    }
    document.querySelectorAll(".listItem span").forEach(span => {
        const parentCheckbox = span.closest(".mainTask").querySelector("input[type='checkbox']");
        if (span.style.color === "red") return;
        if (parentCheckbox.checked) {
            span.style.color = "gray";
        } else {
            span.style.color = dark ? "white" : "black";
        }
    });
});

taskTimeInput.value = "";

addTaskBtn.addEventListener("click", () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const taskText = taskInput.value.trim();

    const taskDate = taskDateInput.value;

    const taskTime = taskTimeInput.value;

    const settingsBtn = document.createElement("button");
    settingsBtn.className = "settingsBtn"
    settingsBtn.textContent = "⚙";
    const editTaskBtn = document.createElement("button");
    editTaskBtn.className = "editTaskBtn"
    editTaskBtn.textContent = "Edit";

    const subtaskBtn = document.createElement("button");
    subtaskBtn.className = "subtaskBtn"
    subtaskBtn.textContent = "Add Subtask";

    const urgencyLevel = document.createElement("select");
    urgencyLevel.className = "urgencyLevel"
    urgencyLevel.placeholder = "Set Urgency";
    const levels = ["None", "Low", "Medium", "High"];
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Urgency";
    placeholder.disabled = true;
    placeholder.selected = true;
    urgencyLevel.appendChild(placeholder);
    levels.forEach(level => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        urgencyLevel.appendChild(option);
    });

    const addNote = document.createElement("button");
    addNote.className = "addNoteBtn"
    addNote.textContent = "Add Note";

    const unprioritizeBtn = document.createElement("button");
    unprioritizeBtn.className = "unprioritizeBtn"
    unprioritizeBtn.textContent = "Unprioritize";
    unprioritizeBtn.style.display = "none";

    const prioritizeBtn = document.createElement("button");
    prioritizeBtn.className = "prioritizeBtn"
    prioritizeBtn.textContent = "Prioritize";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn"
    deleteBtn.textContent = "Delete";

    if (taskText !== "") {
        const listItem = document.createElement("div");
        listItem.className = "listItem"
        listItem.dataset.dateNotified = "false";
        listItem.dataset.timeNotified = "false";
        listItem.dataset.dueDate = taskDate;
        listItem.dataset.dueTime = taskTime;
        const mainTask = document.createElement("div");
        mainTask.className = "mainTask"
        const taskTextSpan = document.createElement("span");
        taskTextSpan.textContent = taskText + (taskDate ? " - Due " + taskDate : "") + (taskTime ? " at " + taskTime : "");
        const settings = document.createElement("div");
        settings.className = "settings"
        settings.style.display = "none";
        mainTask.prepend(checkbox);
        checkbox.addEventListener("change", () => {
            taskTextSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
            if (document.body.style.backgroundColor === "rgb(8, 25, 54)") {
                taskTextSpan.style.color = checkbox.checked ? "gray" : "white";
            } else {
                taskTextSpan.style.color = checkbox.checked ? "gray" : "black";
            }
        });
        mainTask.appendChild(taskTextSpan);
        mainTask.appendChild(settingsBtn);
        listItem.appendChild(mainTask);
        settingsBtn.addEventListener("click", () => {
            if (settings.style.display === "inline") {
                settings.style.display = "none";
            } else {
                settings.style.display = "inline";
            }
        });
        settings.appendChild(editTaskBtn);
        editTaskBtn.addEventListener("click", () => {
            const editTaskDiv = document.createElement("div");
            editTaskDiv.className = "editTaskDiv"
            const editTaskInput = document.createElement("input");
            editTaskInput.className = "editTaskInput"
            editTaskInput.type = "text";
            editTaskInput.value = taskTextSpan.dataset.taskText || taskText;
            editTaskInput.placeholder = "Edit your task";
            if (document.body.style.backgroundColor === "rgb(8, 25, 54)") {
                editTaskInput.style.backgroundColor = "rgb(8, 25, 54)";
                editTaskInput.style.color = "white";
            } else {
                editTaskInput.style.backgroundColor = "white";
                editTaskInput.style.color = "black";
            }   
            const saveEditBtn = document.createElement("button");
            saveEditBtn.textContent = "Save";
            saveEditBtn.className = "saveEditBtn"
            editTaskDiv.appendChild(editTaskInput);
            editTaskDiv.appendChild(saveEditBtn);
            saveEditBtn.addEventListener("click", () => {
                const newTaskText = editTaskInput.value.trim();
                if (newTaskText !== "") {
                    taskTextSpan.dataset.taskText = newTaskText;
                    taskTextSpan.textContent = newTaskText + " - Due " + taskDate;
                    settings.removeChild(editTaskDiv);
                }
            })
            settings.appendChild(editTaskDiv);
        });
        settings.appendChild(subtaskBtn);
        subtaskBtn.addEventListener("click", () => {
            const subtaskCreatorDiv = document.createElement("div");
            subtaskCreatorDiv.className = "subtaskCreatorDiv"
            const subtaskInput = document.createElement("input");
            subtaskInput.className = "subtaskInput"
            subtaskInput.type = "text";
            subtaskInput.placeholder = "Type in a new subtask";
            const subtaskDateInput = document.createElement("input");
            subtaskDateInput.className = "subtaskDateInput"
            subtaskDateInput.type = "date";
            const subtaskTimeInput = document.createElement("input");
            subtaskTimeInput.className = "subtaskTimeInput"
            subtaskTimeInput.type = "time";
            const saveSubtaskBtn = document.createElement("button");
            saveSubtaskBtn.textContent = "Save Subtask";
            saveSubtaskBtn.className = "saveSubtaskBtn"
            subtaskCreatorDiv.appendChild(subtaskInput);
            subtaskCreatorDiv.appendChild(subtaskDateInput);
            subtaskCreatorDiv.appendChild(subtaskTimeInput);
            subtaskCreatorDiv.appendChild(saveSubtaskBtn);
            saveSubtaskBtn.addEventListener("click", () => {
                
            })
            settings.appendChild(subtaskCreatorDiv);
        })
        settings.appendChild(urgencyLevel);
        urgencyLevel.addEventListener("change", () => {
            const currentTaskText = taskTextSpan.dataset.taskText || taskText;
            switch (urgencyLevel.value) {
                case "Low":
                    taskTextSpan.textContent = "! " + currentTaskText + " - Due " + taskDate;
                    break;
                case "Medium":
                    taskTextSpan.textContent = "!! " + currentTaskText + " - Due " + taskDate;
                    break;
                case "High":
                    taskTextSpan.textContent = "!!! " + currentTaskText + " - Due " + taskDate;
                    break;
                default:
                    taskTextSpan.textContent = currentTaskText + " - Due " + taskDate;
            }
        });
        settings.appendChild(addNote);
        addNote.addEventListener("click", () => {
            const noteCreatorDiv = document.createElement("div");
            noteCreatorDiv.className = "noteCreatorDiv"
            const noteCreator = document.createElement("input");
            noteCreator.className = "noteCreator"
            noteCreator.type = "text";
            noteCreator.placeholder = "Type your note here";
            if (document.body.style.backgroundColor === "rgb(8, 25, 54)") {
                noteCreator.style.backgroundColor = "rgb(8, 25, 54)";
                noteCreator.style.color = "white";
            } else {
                noteCreator.style.backgroundColor = "white";
                noteCreator.style.color = "black";
            }
            const saveNoteBtn = document.createElement("button");
            saveNoteBtn.textContent = "Save Note";
            saveNoteBtn.className = "saveNoteBtn"
            noteCreatorDiv.appendChild(noteCreator);
            noteCreatorDiv.appendChild(saveNoteBtn);
            settings.appendChild(noteCreatorDiv);
            saveNoteBtn.addEventListener("click", () => {
                const note = noteCreator.value.trim();
                if (note !== "") {
                    const noteDisplay = document.createElement("div");
                    noteDisplay.className = "noteDisplay"
                    noteDisplay.textContent = note;
                    const deleteNoteBtn = document.createElement("button");
                    deleteNoteBtn.textContent = "🗑️";
                    deleteNoteBtn.className = "deleteNoteBtn"
                    listItem.appendChild(noteDisplay);
                    noteDisplay.appendChild(deleteNoteBtn);
                    deleteNoteBtn.addEventListener("click", () => {
                        noteDisplay.remove();
                        deleteNoteBtn.remove();
                        settings.style.bottom = "5px";
                    })
                    settings.removeChild(noteCreatorDiv);
                    settings.style.bottom = "15px";
                }
            });
        });
        settings.appendChild(prioritizeBtn);
        prioritizeBtn.addEventListener("click", () => {
            taskTextSpan.style.color = "red";
            taskTextSpan.style.fontWeight = "bold";
            mainTask.prepend(checkbox);
            prioritizeBtn.style.display = "none";
            unprioritizeBtn.style.display = "inline";
        });
        settings.appendChild(unprioritizeBtn);
        unprioritizeBtn.addEventListener("click", () => {
            taskTextSpan.style.color = document.body.style.backgroundColor === "rgb(8, 25, 54)" ? "white" : "black";
            taskTextSpan.style.fontWeight = "normal";
            mainTask.prepend(checkbox);
            unprioritizeBtn.style.display = "none";
            prioritizeBtn.style.display = "inline";
        });
        settings.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", () => {
            taskList.removeChild(listItem);
        });
        listItem.appendChild(settings);
        taskList.appendChild(listItem);
        taskInput.value = "";
        taskDateInput.value = "";
    }
});

function checkTaskDue(listItem, taskText) {
    const checkbox = listItem.querySelector("input[type='checkbox']");
    if (Notification.permission !== "granted" || checkbox?.checked) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const dueDate = listItem.dataset.dueDate;
    const dueTime = listItem.dataset.dueTime;
    if (
        dueDate === today && 
        listItem.dataset.dateNotified !== "true"
    ) {
        new Notification("Task Due Today", {
            body : `Your task "${taskText}" is due today.`,
        });
        listItem.dataset.dateNotified = "true";
    }

    if (
        dueDate === today && dueTime &&
        listItem.dataset.timeNotified !== "true"
    ) {
    const [hour, minute] = dueTime.split(":").map(Number);

    const due = new Date(now);
    due.setHours(hour, minute, 0, 0);
        if (now >= due) {
            new Notification("Task Due Now", {
                body: `Your task "${taskText}" is due now.`,
            });
            listItem.dataset.timeNotified = "true";
        }
    }
}

setInterval(() => {
        document.querySelectorAll(".listItem").forEach(listItem => {
            const span = listItem.querySelector("span");
            const text = span.dataset.taskText || span.textContent;
            checkTaskDue(listItem, text);
        });
    }, 1000);