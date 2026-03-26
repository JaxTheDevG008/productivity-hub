const askForNotifications = document.querySelector(".askForNotifications");
const enableNotificationsBtn = document.querySelector(
  ".enableNotificationsBtn",
);
const closeNotiPopup = document.querySelector(".closeNotiPopup");
const sidebar = document.querySelector(".sidebar");
const dashboardBtn = document.querySelector(".dashboardBtn");
const calendarBtn = document.querySelector(".calendarBtn");
const mainContent = document.querySelector(".mainContent");
const commandCenter = document.querySelector(".commandCenter");
const AIAssistantBtn = document.querySelector(".AIAssistantBtn");
const decrastinatorBtn = document.querySelector(".decrastinatorBtn");
const currentDate = document.querySelector(".currentDate");
const dynamicGreeting = document.querySelector(".greeting");
const miniAnalytics = document.querySelector(".miniAnalytics");
const workAreaSplit = document.querySelector(".workAreaSplit");
const toDoList = document.querySelector(".toDoList");
const listAndKanbanToggle = document.querySelector(".listAndKanbanToggle");
const addBtn = document.querySelector(".addBtn");
const taskCreationDiv = document.querySelector(".taskCreationDiv");
const actualTaskCreation = document.querySelector(".actualTaskCreation");
const taskInput = document.querySelector(".taskInput");
const taskAttrCreation = document.querySelector(".taskAttrCreation");
const taskPrioritySelector = document.querySelector(".taskPrioritySelector");
const noPriorityOption = document.querySelector(".noPriorityOption");
const lowPriorityOption = document.querySelector(".lowPriorityOption");
const mediumPriorityOption = document.querySelector(".mediumPriorityOption");
const highPriorityOption = document.querySelector(".highPriorityOption");
const taskDateInput = document.querySelector(".taskDateInput");
const taskTimeInput = document.querySelector(".taskTimeInput");
const taskStatusSelector = document.querySelector(".taskStatusSelector");
const toDoStatus = document.querySelector(".toDoStatus");
const inProgressStatus = document.querySelector(".inProgressStatus");
const blockedStatus = document.querySelector(".blockedStatus");
const doneStatus = document.querySelector(".doneStatus");
const addAndCancelButtons = document.querySelector(".addAndCancelButtons");
const cancelTaskCreationBtn = document.querySelector(".cancelTaskCreationBtn");
const addTaskBtn = document.querySelector(".addTaskBtn");
const taskList = document.querySelector("ul");
const noTasksYetAlert = document.querySelector(".noTasksYetAlert");
const dropZones = document.querySelector(".dropZones");
const toDoDropZone = document.querySelector(".toDoDropZone");
const inProgressDropZone = document.querySelector(".inProgressDropZone");
const allDoneDropZone = document.querySelector(".allDoneDropZone");
const focusTimer = document.querySelector(".focusTimer");
const taskSelectionDropdown = document.querySelector(".taskSelectionDropdown");
const currentFocusedTask = document.querySelector(".currentFocusedTask");
const timerMinutesDiv = document.querySelector(".timerMinutesDiv");
const timerProgressRing = document.querySelector(".timerProgressRing");
const timerMinutes = document.querySelector(".timerMinutes");
const timerButtons = document.querySelector(".timerButtons");
const lengthButtons = document.querySelectorAll(".timerLengthOptions button");
const startTimerBtn = document.querySelector(".startTimerBtn");
const pauseTimerBtn = document.querySelector(".pauseTimerBtn");
const restartTimerBtn = document.querySelector(".restartTimerBtn");
const themeBtn = document.querySelector(".themeBtn");
const notes = document.querySelector(".notes");
const calendarSection = document.querySelector(".calendar");

let decrastinatorIntervalId = null;
let decrastinatorIsRunning = false;

let allTaskNames = JSON.parse(localStorage.getItem("allTaskNames")) || [];

let calendar;

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  if (calendarEl) {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "",
        center: "prev,title,next",
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      },
    });
    calendar.render();
  } else {
    console.error("Calendar error");
  }
});

function responsiveWebsite() {
  if (window.innerWidth < 768) {
    console.log("Mobile");
  } else {
    console.log("Desktop");
  }
}

window.addEventListener("resize", responsiveWebsite);
responsiveWebsite();

window.addEventListener("load", () => {
  taskCreationDiv.style.display = "none";

  localStorage.getItem("taskSelectionOptions")
    ? (taskSelectionDropdown.innerHTML = localStorage.getItem(
        "taskSelectionOptions",
      ))
    : null;

  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    taskList.innerHTML = savedTasks;
    document.querySelectorAll(".listItem").forEach((listItem) => {
      const mainTask = listItem.querySelector(".mainTask");
      const taskOptionsBtn = mainTask.querySelector(".taskOptionsBtn");
      mainTask.addEventListener("mouseenter", () => {
        taskOptionsBtn.style.display = "inline";
      });
      mainTask.addEventListener("mouseleave", () => {
        taskOptionsBtn.style.display = "none";
      });
    });
    updateTasksDoneCount();
    noTasksYetAlert.style.display = "none";
  }

  const savedAskForNotiDisplay = localStorage.getItem("askForNotiDisplay");
  if (savedAskForNotiDisplay) {
    askForNotifications.style.display = "none";
    sidebar.style.marginTop = "0px";
    toDoList.style.marginTop = "0px";
  } else {
    askForNotifications.style.display = "inline";
    sidebar.style.marginTop = "44px";
    toDoList.style.marginTop = "44px";
  }
});

/* dashboardBtn.addEventListener("click", () => {
  document.body.classList.add("dashboardActive");
}) */

calendarBtn.addEventListener("click", () => {
  document.body.classList.toggle("calendarView");
});

const now = new Date();
const formattedCurrentDate = now.toLocaleDateString("en-US", {
  dateStyle: "full",
});

currentDate.textContent = formattedCurrentDate;

const currentHour = now.getHours();

if (currentHour < 12) {
  dynamicGreeting.textContent = "Good morning, Jaxon!";
} else if (currentHour >= 12 && currentHour <= 17) {
  dynamicGreeting.textContent = "Good afternoon, Jaxon!";
} else {
  dynamicGreeting.textContent = "Good evening, Jaxon!";
}

enableNotificationsBtn.addEventListener("click", () => {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      askForNotifications.style.display = "none";
      localStorage.setItem("askForNotiDisplay", "none");
    } else {
      askForNotifications.style.display = "inline";
      localStorage.setItem("askForNotiDisplay", "visible");
    }
  });
});

closeNotiPopup.addEventListener("click", () => {
  askForNotifications.style.display = "none";

  const notiReminderDiv = document.createElement("div");
  notiReminderDiv.className = "notiReminderDiv";

  notiReminderText = document.createElement("div");
  notiReminderText.className = "notiReminderText";
  notiReminderText.textContent =
    "You can always setup notifications in settings.";
  notiReminderDiv.appendChild(notiReminderText);

  notiReminderDiv.classList.add("show");
  document.body.appendChild(notiReminderDiv);
  setTimeout(() => {
    if (notiReminderDiv.parentNode) {
      notiReminderDiv.parentNode.removeChild(notiReminderDiv);
    }
  }, 4000);
});

themeBtn.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    themeBtn.innerHTML = `<img src="Images/Dark Mode Icon.png" alt="Dark Mode Icon" class="themeIcon">`;
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeBtn.innerHTML = `<img src="Images/Light Mode Icon.png" alt="Light Mode Icon" class="themeIcon">`;
  }
});

AIAssistantBtn.addEventListener("click", () => {
  const isAIView = document.documentElement.classList.toggle("AIView");

  if (isAIView) {
    const AIOverlay = document.createElement("div");
    AIOverlay.className = "AIOverlay";

    const AIDiv = document.createElement("div");
    AIDiv.className = "AIDiv";

    const AIName = document.createElement("div");
    AIName.className = "AIName";
    AIName.textContent = "AI Assistant";
    AIDiv.appendChild(AIName);

    const AIPrioritySuggestionBtn = document.createElement("button");
    AIPrioritySuggestionBtn.className = "AIPrioritySuggestionBtn";
    AIPrioritySuggestionBtn.textContent = "Start Analysis";

    const AIPrioritySuggestions = document.createElement("div");
    AIPrioritySuggestions.className = "AIPrioritySuggestions";

    AIPrioritySuggestionBtn.addEventListener("click", async () => {
      AIPrioritySuggestions.textContent = "Thinking...";

      const raw = await getSuggestedPriorities();
      if (raw.error) {
        AIPrioritySuggestions.textContent =
          "AI is busy right now. Try again in a moment.";
        return;
      }

      const result = JSON.parse(raw);

      AIPrioritySuggestions.innerHTML = "";
      result.priorities.forEach((item, index) => {
        const entry = document.createElement("div");
        entry.className = "AIResultEntry";
        entry.innerHTML = `<strong>${index + 1}. ${item.title}</strong><p>${item.reason}</p>`;
        AIPrioritySuggestions.appendChild(entry);
      });
    });

    AIDiv.append(AIPrioritySuggestionBtn, AIPrioritySuggestions);
    document.body.append(AIOverlay, AIDiv);
    document
      .querySelectorAll("body > :not(.AIDiv):not(.AIOverlay)")
      .forEach((el) => (el.inert = true));
  } else {
    document.querySelector(".AIOverlay")?.remove();
    document.querySelector(".AIDiv")?.remove();
    document.querySelectorAll("body >  *").forEach((el) => (el.inert = false));
  }
});

decrastinatorBtn.addEventListener("click", () => {
  const isDecrastinatorView =
    document.documentElement.classList.toggle("decrastinatorView");

  if (isDecrastinatorView) {
    const decrastinatorOverlay = document.createElement("div");
    decrastinatorOverlay.className = "decrastinatorOverlay";

    const decrastinatorDiv = document.createElement("div");
    decrastinatorDiv.className = "decrastinatorDiv";

    const decrastinatorName = document.createElement("div");
    decrastinatorName.className = "decrastinatorName";
    decrastinatorName.textContent = "Decrastinator";
    decrastinatorDiv.appendChild(decrastinatorName);

    const decrastinatorMinutesDiv = document.createElement("div");
    decrastinatorMinutesDiv.className = "decrastinatorMinutesDiv";

    let decrastinatorTotalTime = 3 * 60;
    let decrastinatorTotalSeconds = decrastinatorTotalTime;

    const decrastinatorInitMinutes = Math.floor(decrastinatorTotalSeconds / 60);
    const decrastinatorInitSeconds = decrastinatorTotalSeconds % 60;
    decrastinatorMinutesDiv.textContent = `${decrastinatorInitMinutes}:${decrastinatorInitSeconds.toString().padStart(2, "0")}`;

    const decrastinatorTaskSelector = document.createElement("select");
    decrastinatorTaskSelector.className = "decrastinatorTaskSelector";
    decrastinatorDiv.appendChild(decrastinatorTaskSelector);
    const decrastinatorTaskSelectorPlaceholder =
      document.createElement("option");
    decrastinatorTaskSelectorPlaceholder.className =
      "decrastinatorTaskSelectorPlaceholder";
    decrastinatorTaskSelectorPlaceholder.textContent = "Select a task";
    decrastinatorTaskSelectorPlaceholder.disabled = true;
    decrastinatorTaskSelectorPlaceholder.selected = true;

    allTaskNames.forEach((name) => {
      const decrastinationTaskOption = document.createElement("option");
      decrastinationTaskOption.value = name;
      decrastinationTaskOption.textContent = name;
      decrastinatorTaskSelector.appendChild(decrastinationTaskOption);
    });

    const startDecrastinatorBtn = document.createElement("div");
    startDecrastinatorBtn.className = "startDecrastinatorBtn";
    startDecrastinatorBtn.innerHTML = `<img src="Images/Start Timer Icon.png" class="startDecrastinatorIcon w-4">`;

    decrastinatorDiv.appendChild(startDecrastinatorBtn);
    startDecrastinatorBtn.addEventListener("click", () => {
      if (decrastinatorIsRunning) return;
      decrastinatorIsRunning = true;

      decrastinatorIntervalId = setInterval(() => {
        decrastinatorTotalSeconds--;

        const decrastinatorMinutes = Math.floor(decrastinatorTotalSeconds / 60);
        const decrastinatorSeconds = decrastinatorTotalSeconds % 60;
        decrastinatorMinutesDiv.textContent = `${decrastinatorMinutes}:${decrastinatorSeconds.toString().padStart(2, "0")}`;

        if (decrastinatorTotalSeconds <= 0) {
          clearInterval(decrastinatorIntervalId);
        }
      }, 1000);
    });

    decrastinatorDiv.appendChild(decrastinatorMinutesDiv);
    document.body.append(decrastinatorOverlay, decrastinatorDiv);
    document
      .querySelectorAll(
        "body > :not(.decrastinatorDiv):not(.decrastinatorOverlay)",
      )
      .forEach((el) => (el.inert = true));
  } else {
    document.querySelector(".decrastinatorOverlay")?.remove();
    document.querySelector(".decrastinatorDiv")?.remove();
    document.querySelectorAll("body >  *").forEach((el) => (el.inert = false));
    clearInterval(decrastinatorIntervalId);
  }
});

window.addEventListener("load", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    themeBtn.innerHTML = `<img src="Images/Light Mode Icon.png" alt="Light Mode Icon" class="themeIcon">`;
  } else {
    themeBtn.innerHTML = `<img src="Images/Dark Mode Icon.png" alt="Dark Mode Icon" class="themeIcon">`;
  }
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.removeAttribute("data-theme");
}

const isDark = document.documentElement.getAttribute("data-theme") === "dark";
if (isDark) {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.removeAttribute("data-theme");
}

noTasksYetAlert.style.display = "inline";

let isDraggable = false;

listAndKanbanToggle.addEventListener("click", () => {
  isDraggable = !isDraggable;

  const allTasks = document.querySelectorAll(".mainTask");
  allTasks.forEach((task) => {
    task.draggable = isDraggable;

    task.style.cursor = "grab";

    const checkbox = task.querySelector(".checkbox");

    if (checkbox && checkbox.checked) {
      allDoneDropZone.appendChild(task);
    } else {
      toDoDropZone.appendChild(task);
    }
  });

  taskList.classList.toggle("drag-mode", isDraggable);

  dropZones.style.display = isDraggable ? "flex" : "none";

  noTasksYetAlert.style.display = "none";
});

toDoList.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("mainTask")) {
    e.target.classList.add("dragging");
  }
});

toDoList.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("mainTask")) {
    e.target.classList.remove("dragging");
  }
});

[toDoDropZone, inProgressDropZone, allDoneDropZone].forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over-active");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over-active");
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over-active");

    const draggedTask = document.querySelector(".dragging");

    if (draggedTask) {
      zone.appendChild(draggedTask);
    }
  });
});

addBtn.addEventListener("click", () => {
  taskCreationDiv.style.display = "flex";
  noTasksYetAlert.style.display =
    taskList.innerHTML.trim() === "" ? "inline" : "none";
  toDoList.style.height = "495px";
  focusTimer.style.height = "496.5px";
});

cancelTaskCreationBtn.addEventListener("click", () => {
  taskCreationDiv.style.display = "none";
  noTasksYetAlert.style.display =
    taskList.innerHTML.trim() === "" ? "none" : "inline";
  toDoList.style.height = "328.5px";
  focusTimer.style.height = "330px";
});

addTaskBtn.addEventListener("click", () => {
  noTasksYetAlert.style.display = "none";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";

  const taskText = taskInput.value.trim();

  const taskPriority = taskPrioritySelector.value;

  const taskDate = taskDateInput.value;

  let formattedDate = "";

  if (taskDate) {
    const dateObject = new Date(taskDate + "T00:00:00");
    formattedDate = dateObject.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const taskTime = taskTimeInput.value;

  const taskStatus = taskStatusSelector.value;

  const taskOptionsBtnDiv = document.createElement("div");
  taskOptionsBtnDiv.className = "taskOptionsBtnDiv";

  const taskOptionsBtn = document.createElement("button");
  taskOptionsBtn.className = "taskOptionsBtn";
  taskOptionsBtn.innerHTML = `<img class="taskOptionsBtnIcon" src="Images/Task Options Icon.png" alt="Task Options Icon">`;
  taskOptionsBtn.style.display = "none";

  const taskOptions = document.createElement("div");
  taskOptions.className = "taskOptions";
  taskOptions.style.display = "none";

  const editOption = document.createElement("div");
  editOption.className = "taskOption";
  editOption.textContent = "Edit";

  const deleteOption = document.createElement("div");
  deleteOption.className = "taskOption";
  deleteOption.textContent = "Delete";
  deleteOption.style.color = "red";

  taskOptions.appendChild(editOption);
  taskOptions.appendChild(deleteOption);
  deleteOption.addEventListener("click", () => {
    listItem.removeChild(mainTask);
    taskList.removeChild(listItem);
    localStorage.setItem("tasks", taskList.innerHTML);
    calendar.getEventById(listItem.dataset.eventId)?.remove();
    updateTasksDoneCount();
    showNoTasksYet();
  });

  const taskPriorityValue = taskPrioritySelector.value;

  let eventColor = isDark ? "#06bdf9" : "#a9d6fb";

  if (taskPriorityValue === "Low") {
    eventColor = "#90ee90";
  } else if (taskPriorityValue === "Medium") {
    eventColor = "#ffcc00";
  } else if (taskPriorityValue === "High") {
    eventColor = "#ff6b6b";
  } else {
    eventColor = isDark ? "#06bdf9" : "#a9d6fb";
  }

  if (taskText !== "") {
    allTaskNames.push(taskText);
    localStorage.setItem("allTaskNames", JSON.stringify(allTaskNames));

    const listItem = document.createElement("li");
    listItem.className = "listItem";
    listItem.dataset.dateNotified = "false";
    listItem.dataset.timeNotified = "false";
    listItem.dataset.dueDate = taskDate;
    listItem.dataset.dueTime = taskTime;

    const mainTask = document.createElement("label");
    mainTask.className = "mainTask";
    mainTask.draggable = isDraggable;

    const taskContents = document.createElement("div");
    taskContents.className = "taskContents";

    const taskTextAndCheckbox = document.createElement("div");
    taskTextAndCheckbox.className = "taskTextAndCheckbox";

    const taskTextSpan = document.createElement("span");
    taskTextSpan.className = "taskTextSpan";
    taskTextSpan.textContent = taskText;
    taskTextSpan.dataset.taskText = taskText;

    const taskAttributes = document.createElement("div");
    taskAttributes.className = "taskAttributes";

    const taskPrioritySpan = document.createElement("span");
    taskPrioritySpan.className = "taskPrioritySpan";
    taskPrioritySpan.textContent = taskPriority;

    const taskDateAndTime = document.createElement("div");
    taskDateAndTime.className = "taskDateAndTime";

    const taskDateAndTimeSpan = document.createElement("span");
    taskDateAndTimeSpan.className = "taskDateAndTimeSpan";

    const taskDateImg = document.createElement("img");
    taskDateImg.className = "taskDateImg";
    taskDateImg.src = "Images/Date Icon.png";
    taskDateImg.alt = "Date Icon";

    taskDateAndTimeSpan.textContent =
      (formattedDate ? "Due " + formattedDate : "") +
      (taskTime ? " at " + taskTime : "");

    const taskStatusSpan = document.createElement("span");
    taskStatusSpan.className = "taskStatusSpan";
    taskStatusSpan.textContent = taskStatus;

    taskTextAndCheckbox.prepend(checkbox);
    checkbox.addEventListener("change", (e) => {
      updateTasksDoneCount();
      e.stopPropagation();
      if (document.documentElement.getAttribute("data-theme") === "dark") {
        taskTextSpan.style.color = checkbox.checked ? "gray" : "white";
      } else {
        taskTextSpan.style.color = checkbox.checked ? "gray" : "black";
      }
    });
    taskTextAndCheckbox.appendChild(taskTextSpan);
    taskContents.appendChild(taskTextAndCheckbox);
    taskAttributes.appendChild(taskPrioritySpan);
    taskDateAndTime.appendChild(taskDateImg);
    taskDateAndTime.appendChild(taskDateAndTimeSpan);
    if (taskDate || taskTime) {
    }
    taskAttributes.appendChild(taskStatusSpan);
    taskContents.appendChild(taskAttributes);
    mainTask.appendChild(taskContents);
    taskOptionsBtnDiv.appendChild(taskOptionsBtn);
    taskOptionsBtn.addEventListener("click", () => {
      taskOptions.style.display =
        taskOptions.style.display === "none" ? "block" : "none";
    });
    taskOptionsBtnDiv.appendChild(taskOptions);
    mainTask.appendChild(taskOptionsBtnDiv);
    listItem.appendChild(mainTask);
    if (taskDate) {
      const startDateTime = taskTime ? `${taskDate}T${taskTime}` : taskDate;
      const event = calendar.addEvent({
        title: taskText,
        start: startDateTime,
        allDay: !taskTime,
        backgroundColor: eventColor,
        extendedProps: {
          priority: taskPrioritySelector.value,
          status: taskStatusSelector.value,
        },
      });
      listItem.dataset.eventId = event.id;
    }
    mainTask.addEventListener("mouseenter", () => {
      taskOptionsBtn.style.display = "inline";
    });
    mainTask.addEventListener("mouseleave", () => {
      if (taskOptions.style.display === "none") {
        taskOptionsBtn.style.display = "none";
      }
    });
    mainTask.addEventListener("click", (e) => {
      updateTasksDoneCount();
      if (e.target === checkbox) return;

      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event("change"));
    });
    taskList.appendChild(listItem);
    localStorage.setItem("tasks", taskList.innerHTML);
    updateTasksDoneCount();
    const focusedTaskOption = document.createElement("option");
    focusedTaskOption.value = taskText;
    focusedTaskOption.textContent = taskText;
    taskSelectionDropdown.appendChild(focusedTaskOption);
    localStorage.setItem(
      "taskSelectionOptions",
      taskSelectionDropdown.innerHTML,
    );
    taskInput.value = "";
    taskDateInput.value = "";
    taskTimeInput.value = "";
    toDoList.style.height = "328.5px";
    focusTimer.style.height = "330px";
    taskCreationDiv.style.display = "none";
  } else {
  }
});

/* taskList.innerHTML = "";
localStorage.setItem("tasks", "");
noTasksYetAlert.style.display = "inline";
updateTasksDoneCount(); */

function showNoTasksYet() {
  if (taskList.innerHTML.trim() === "") {
    noTasksYetAlert.style.display = "inline";
  } else {
    noTasksYetAlert.style.display = "none";
  }
}

function updateTasksDoneCount() {
  const totalTasks = taskList.querySelectorAll(".checkbox").length;
  const doneTasks = taskList.querySelectorAll(".checkbox:checked").length;
  const tasksLeft = totalTasks - doneTasks;

  const doneDisplay = document.querySelector(".numberOfTasksDone");
  if (doneDisplay) {
    doneDisplay.textContent = doneTasks;
  }

  const tasksLeftDisplay = document.querySelector(".numberOfTasksLeft");
  if (tasksLeftDisplay) {
    tasksLeftDisplay.textContent = tasksLeft;
  }

  const totalTasksDisplay = document.querySelector(".numberOfTasksTotal");
  if (totalTasksDisplay) {
    totalTasksDisplay.textContent = `of ${totalTasks} total`;
  }
}

function updateFocusSessionsCount() {
  const focusSessionsDisplay = document.querySelector(".numberOfSessionsDone");
  const focusSessions = parseInt(localStorage.getItem("focusSessions") || "0");
  focusSessionsDisplay.textContent = focusSessions;
}

function checkTaskDue(listItem, taskText) {
  const checkbox = listItem.querySelector("input[type='checkbox']");
  if (Notification.permission !== "granted" || checkbox?.checked) return;

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const dueDate = listItem.dataset.dueDate;
  const dueTime = listItem.dataset.dueTime;
  if (dueDate === today && listItem.dataset.dateNotified !== "true") {
    new Notification("Task Due Today", {
      body: `Your task "${taskText}" is due today.`,
    });
    listItem.dataset.dateNotified = "true";
  }

  if (
    dueDate === today &&
    dueTime &&
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
  document.querySelectorAll(".listItem").forEach((listItem) => {
    const span = listItem.querySelector("span");
    const text = span.dataset.taskText || span.textContent;
    checkTaskDue(listItem, text);
  });
}, 60000);

const circumference = 283;
let totalTime = 25 * 60;
let totalSeconds = totalTime;
let intervalId = null;
let isRunning = false;

pauseTimerBtn.style.display = "none";

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerMinutes.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function updateRing(timeLeft) {
  const fraction = timeLeft / totalTime;
  const offset = circumference - fraction * circumference;
  timerProgressRing.style.strokeDashoffset = offset;
}

lengthButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const minutes = parseInt(button.textContent);
    totalTime = minutes * 60;
    restartTimer();
  });
});

function startTimer() {
  if (isRunning) return;
  const focusedTaskCheckbox = document.createElement("input");
  focusedTaskCheckbox.type = "checkbox";
  focusedTaskCheckbox.className = "focusedTaskCheckbox";
  focusedTaskCheckbox.dataset.order = "1";

  const selectedFocusedTask =
    taskSelectionDropdown.options[taskSelectionDropdown.selectedIndex].text;
  currentFocusedTask.textContent = "Focusing on: " + selectedFocusedTask;
  currentFocusedTask.style.display = "inline";
  currentFocusedTask.dataset.order = "2";

  const currentFocusedTaskDiv = document.querySelector(
    ".currentFocusedTaskDiv",
  );
  currentFocusedTaskDiv.style.gap = "5px";
  currentFocusedTaskDiv.style.display = "flex";
  taskSelectionDropdown.style.display = "none";

  timerButtons.style.marginTop = "15px";

  isRunning = true;
  startTimerBtn.style.display = "none";
  pauseTimerBtn.style.display = "inline";
  currentFocusedTask.appendChild(focusedTaskCheckbox);

  intervalId = setInterval(() => {
    totalSeconds--;
    updateTimerDisplay();
    updateRing(totalSeconds);

    if (totalSeconds <= 0) {
      clearInterval(intervalId);
      isRunning = false;
      if (Notification.permission === "granted") {
        new Notification("Focus timer finished! Take a break.");
      }
      updateFocusSessionsCount();
      restartTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(intervalId);
  isRunning = false;
  startTimerBtn.style.display = "inline";
  pauseTimerBtn.style.display = "none";
}

function restartTimer() {
  clearInterval(intervalId);
  isRunning = false;
  totalSeconds = totalTime;
  updateTimerDisplay();
  updateRing(totalTime);
  startTimerBtn.style.display = "inline";
  pauseTimerBtn.style.display = "none";
  currentFocusedTask.style.display = "none";
  taskSelectionDropdown.style.display = "inline";
  timerButtons.style.marginTop = "0px";
}

startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
restartTimerBtn.addEventListener("click", restartTimer);

updateTimerDisplay();

function getTasksAsData() {
  const items = document.querySelectorAll(".listItem");
  return Array.from(items).map((item) => ({
    title:
      item.querySelector("span")?.dataset.taskText ||
      item.querySelector("span")?.textContent,
    dueDate: item.dataset.dueDate || null,
    dueTime: item.dataset.dueTime || null,
    priority: item.dataset.priority || null,
    status: item.dataset.status || null,
    done: item.querySelector(".checkbox")?.checked || false,
  }));
}

async function getSuggestedPriorities() {
  const tasks = getTasksAsData();

  const res = await fetch("http://localhost:5000/api/ai/priorities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks }),
  });

  const data = await res.json();
  return data;
}
