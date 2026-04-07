const overlay = document.querySelector(".overlay");
const askForNotifications = document.querySelector(".askForNotifications");
const enableNotificationsBtn = document.querySelector(".enableNotificationsBtn");
const closeNotiPopup = document.querySelector(".closeNotiPopup");
const sidebar = document.querySelector(".sidebar");
const hamburgerBtn = document.querySelector(".hamburgerBtn");
const closeSidebarBtn = document.querySelector(".closeSidebarBtn");
const searchDiv = document.querySelector(".searchDiv");
const searchBar = document.querySelector(".searchBar");
const searchResultsMenu = document.querySelector(".searchResultsMenu");
const dashboardBtn = document.querySelector(".dashboardBtn");
const calendarBtn = document.querySelector(".calendarBtn");
const mainContent = document.querySelector(".mainContent");
const commandCenter = document.querySelector(".commandCenter");
const aiAssistantBtn = document.querySelector(".aiAssistantBtn");
const decrastinatorBtn = document.querySelector(".decrastinatorBtn");
const currentDate = document.querySelector(".currentDate");
const dynamicGreeting = document.querySelector(".greeting");
const miniAnalytics = document.querySelector(".miniAnalytics");
const workAreaSplit = document.querySelector(".workAreaSplit");
const section1 = document.querySelector(".section1");
const section2 = document.querySelector(".section2");
const toDoList = document.querySelector(".toDoList");
const toDoListHeader = document.querySelector(".toDoListHeader");
const listAndKanbanToggle = document.querySelector(".listAndKanbanToggle");
const addBtn = document.querySelector(".addBtn");
const taskCreationDiv = document.querySelector(".taskCreationDiv");
const actualTaskCreation = document.querySelector(".actualTaskCreation");
const taskInput = document.querySelector(".taskInput");
const taskAttrCreation = document.querySelector(".taskAttrCreation");
const taskPrioritySelector = document.querySelector(".taskPrioritySelector");
const taskDateInput = document.querySelector(".taskDateInput");
const taskTimeInput = document.querySelector(".taskTimeInput");
const taskStatusSelector = document.querySelector(".taskStatusSelector");
const addAndCancelButtons = document.querySelector(".addAndCancelButtons");
const cancelTaskCreationBtn = document.querySelector(".cancelTaskCreationBtn");
const addTaskBtn = document.querySelector(".addTaskBtn");
const taskList = document.querySelector(".taskList");
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
const addBtn2 = document.querySelector(".addBtn2");
const notesList = document.querySelector(".notesList");
const notesHeader = document.querySelector(".notesHeader");
const noNotesYetAlert = document.querySelector(".noNotesYetAlert");
const noteCreationDiv = document.querySelector(".noteCreationDiv");
const noteInput = document.querySelector(".noteInput");
const noteColorOptions = document.querySelectorAll(".noteColorOptions button");
const cancelNoteCreationBtn = document.querySelector(".cancelNoteCreationBtn");
const addNoteBtn = document.querySelector(".addNoteBtn");
const activityList = document.querySelector(".activityList");
const calendarSection = document.querySelector(".calendar");

function safeParse(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.warn(`${key} corrupted, resetting...`);
    localStorage.removeItem(key);
    return [];
  }
}

let tasks = safeParse("tasks");
let allNotes = safeParse("notes");
let decrastinatorIntervalId = null;
let decrastinatorIsRunning = false;
let isDraggable = false;
let editingNoteColor = null;
let activityLog = getActivityLog();
let calendar;
let editingTaskId = null;
let isEditing = false;

function showOverlay() {
  overlay.style.display = "block";initwhiteboard
  overlay.onclick = null;
} 

function hideOverlay() {
  overlay.style.display = "none";
  overlay.onclick = null;
}

function createTaskElement(task) {
  noTasksYetAlert.style.display = "none";

  const taskId = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.checked = task.completed;

  const taskText = task.title;


  let taskPriority = task.priority;
  if (taskPriority === "None") {
    taskPriority = "";
  }

  const taskDate = task.dueDate;

  let formattedDate = "";

  if (taskDate) {
    const dateObject = new Date(taskDate + "T00:00:00");
    formattedDate = dateObject.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const taskTime = task.dueTime;

  const taskStatus = task.status;

  const taskOptionsBtnDiv = document.createElement("div");
  taskOptionsBtnDiv.className = "taskOptionsBtnDiv";

  const taskOptionsBtn = document.createElement("button");
  taskOptionsBtn.className = "taskOptionsBtn";
  taskOptionsBtn.innerHTML = `<img class="taskOptionsBtnIcon" src="Images/Task-Options-Icon.png" alt="Task Options Icon">`;

  const taskOptions = document.createElement("div");
  taskOptions.className = "taskOptions";

  const editOption = document.createElement("div");
  editOption.className = "taskOption";
  editOption.textContent = "Edit";

  const deleteOption = document.createElement("div");
  deleteOption.className = "taskOption";
  deleteOption.textContent = "Delete";
  deleteOption.style.color = "red";

  taskOptions.append(editOption, deleteOption);

  const listTask = document.createElement("li");
  listTask.className = "listTask";
  if (task.completed) {
    listTask.classList.add("completed");
  }
  listTask.dataset.dateNotified = "false";
  listTask.dataset.timeNotified = "false";
  listTask.dataset.priority = taskPriority;
  listTask.dataset.dueDate = taskDate;
  listTask.dataset.dueTime = taskTime;
  listTask.dataset.status = normalizeTaskStatus(task.status);
  listTask.id = taskId;

  const mainTask = document.createElement("label");
  mainTask.className = "mainTask";
  mainTask.draggable = isDraggable;
  mainTask.dataset.id = taskId;
  mainTask.addEventListener("mouseenter", () => {
    const taskOptionsBtn = mainTask.querySelector(".taskOptionsBtn");
    if (!taskOptionsBtn) return;

    taskOptionsBtn.classList.add("show");
  });

  mainTask.addEventListener("mouseleave", () => {
    const taskOptionsBtn = mainTask.querySelector(".taskOptionsBtn");
    if (!taskOptionsBtn) return;

    taskOptionsBtn.classList.remove("show");
  });

  mainTask.addEventListener("dragstart", (e) => {
    currentDraggedTask = mainTask;
    mainTask.classList.add("dragging");

    e.dataTransfer.setData("text/plain", listTask.id);
  })
  mainTask.addEventListener("dragend", () => {
    currentDraggedTask = null;
    mainTask.classList.remove("dragging");
  })

  const taskContents = document.createElement("div");
  taskContents.className = "taskContents";

  const taskTextAndCheckbox = document.createElement("div");
  taskTextAndCheckbox.className = "taskTextAndCheckbox";

  const taskTextSpan = document.createElement("span");
  taskTextSpan.className = "taskTextSpan";
  taskTextSpan.textContent = taskText;
  taskTextSpan.dataset.taskText = taskText;
  taskTextSpan.dataset.originalTaskText = taskTextSpan.textContent;

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
  taskDateImg.src = "Images/Date-Icon.png";
  taskDateImg.alt = "Date Icon";

  taskDateAndTimeSpan.textContent =
    (formattedDate ? "Due " + formattedDate : "") +
    (taskTime ? " at " + taskTime : "");

  const taskStatusSpan = document.createElement("span");
  taskStatusSpan.className = "taskStatusSpan";
  taskStatusSpan.textContent = taskStatus;

  taskTextAndCheckbox.prepend(checkbox);
  checkbox.addEventListener("change", () => {
    const t = tasks.find(t => String(t.id) === String(taskId));
    if (!t) return;

    t.completed = checkbox.checked;

    listTask.classList.toggle("completed", t.completed);

    saveTasks();
    addActivity(`Completed task: ${task.title}`, "task");
    updateTasksDoneCount();
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

  taskOptionsBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const rect = taskOptionsBtn.getBoundingClientRect();
    const taskOptions = document.querySelector(".taskOptions");

    taskOptions.style.position = "fixed";
    taskOptions.style.top = `${rect.bottom}px`;
    taskOptions.style.left = `${rect.left}px`;

    taskOptions.classList.toggle("show");
  });

  document.body.appendChild(taskOptions);

  taskOptions.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  mainTask.appendChild(taskOptionsBtnDiv);
  listTask.appendChild(mainTask);

  taskList.appendChild(listTask);

  updateTasksDoneCount();

  editOption.addEventListener("click", () => {
    editingTaskId = taskId;
    isEditing = true;

    taskInput.blur();

    taskInput.value = "";
    taskPrioritySelector.value = "None";
    taskDateInput.value = "";
    taskTimeInput.value = "";
    taskStatusSelector.value = "To Do";

    const task = tasks.find(t => String(t.id) === String(editingTaskId));

    taskOptions.classList.remove("show");

    document.body.appendChild(taskCreationDiv);

    taskCreationDiv.style.display = "flex";
    taskCreationDiv.style.position = "fixed";
    taskCreationDiv.style.zIndex = "9999";
    taskCreationDiv.style.top = "50%";
    taskCreationDiv.style.left = "50%";
    taskCreationDiv.style.transform = "translate(-50%, -50%)";
    
    addTaskBtn.textContent = "Save Task";
    addTaskBtn.style.padding = "0px 8px";

    showOverlay();

    if (task) {
      taskInput.value = task.title;
      taskPrioritySelector.value = task.priority || "None";
      taskDateInput.value = task.dueDate || "";
      taskTimeInput.value = task.dueTime || "";
      taskStatusSelector.value = task.status || "To Do";
    }

    cancelTaskCreationBtn.addEventListener("click", () => {
      taskCreationDiv.style.display = "none";
      taskCreationDiv.style.position = "relative";
      taskCreationDiv.style.top = "0px";
      taskCreationDiv.style.left = "0px";
      taskCreationDiv.style.transform = "none";
      taskCreationDiv.style.order = "0";
      taskCreationDiv.style.zIndex = "0";

      hideOverlay();
      toDoList.insertBefore(taskCreationDiv, toDoListHeader.nextSibling);

      taskInput.value = "";
      taskPrioritySelector.value = "None";
      taskDateInput.value = "";
      taskTimeInput.value = "";
      taskStatusSelector.value = "To Do";

      console.log("Value AFTER:", taskInput.value);
    });
  });

  deleteOption.addEventListener("click", () => {
    const taskIndex = tasks.findIndex(t => String(t.id) === String(taskId));
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      refreshTaskDropdown();
    }
    saveTasks();

    updateTasksDoneCount();
    showNoTasksYet();
    refreshTaskDropdown();
    addActivity(`Deleted task: ${task.title}`, "delete");
    listTask.remove();
    taskOptions.classList.remove("show");
  });
}

function getEventColor(priority, isDark) {
  if (priority === "Low") return "#90ee90";
  if (priority === "Medium") return "#ffcc00";
  if (priority === "High") return "#ff6b6b";
  if (!priority || priority === "None") {
    return isDark ? "#06bdf9" : "#a9d6fb";
  }
  return isDark ? "#06bdf9" : "#a9d6fb";
}

function addTaskToCalendar(task) {
  if (!task.dueDate || !calendar) return;

  const hasTime = !!task.dueTime;

  const startDate = hasTime
    ? `${task.dueDate}T${task.dueTime}:00`
    : task.dueDate;

  calendar.addEvent({
    title: task.title,
    start: startDate,
    allDay: !hasTime,
    backgroundColor: getEventColor(task.priority, isDark()),
    extendedProps: {
      priority: task.priority,
      status: task.status,
    },
  });
}

function createNoteElement(note) {
  noNotesYetAlert.style.display = "none";

  const listNote = document.createElement("li");
  listNote.className = "listNote";
  listNote.id = `note-${note.id}`;

  const mainNote = document.createElement("div");
  mainNote.className = "mainNote";
  if (note.color) {
    mainNote.style.backgroundColor = note.color;
  }
  const mainNoteText = document.createElement("span");
  mainNoteText.className = "mainNoteText";
  mainNoteText.textContent = note.text;
  mainNoteText.dataset.originalNoteText = note.text;
  mainNote.appendChild(mainNoteText);

  const noteOptionsDiv = document.createElement("div");
  noteOptionsDiv.className = "noteOptionsDiv";
  mainNote.appendChild(noteOptionsDiv);
  listNote.appendChild(mainNote);
  notesList.appendChild(listNote);

  const editNoteBtn = document.createElement("button");
  editNoteBtn.className = "editNoteBtn";
  editNoteBtn.style.display = "none";
  editNoteBtn.innerHTML = `<img src="Images/Edit-Icon.png" class="editIcon" alt="Edit Icon">`;
  editNoteBtn.style.backgroundColor = "transparent";
  const deleteNoteBtn = document.createElement("button");
  deleteNoteBtn.className = "deleteNoteBtn";
  deleteNoteBtn.style.display = "none";
  deleteNoteBtn.innerHTML = `<img src="Images/Delete-Icon.png" class="deleteIcon" alt="Delete Icon">`;
  deleteNoteBtn.style.backgroundColor = "transparent";

  noteOptionsDiv.append(editNoteBtn, deleteNoteBtn);
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const task = {
    id: crypto.randomUUID(),
    title: taskText,
    priority: taskPrioritySelector.value,
    dueDate: taskDateInput.value || null,
    dueTime: taskTimeInput.value || null,
    status: taskStatusSelector.value,
    completed: false,
  };

  tasks.push(task);
  saveTasks();

  createTaskElement(task);
  addTaskToCalendar(task);
  refreshTaskDropdown();
  updateTasksDoneCount();
  addActivity(`Added task: ${taskText}`, "task");

  toDoList.style.height = "328.5px";
  focusTimer.style.height = "330px";
  taskCreationDiv.style.display = "none";
  taskInput.value = "";
  taskPrioritySelector.value = "None";
  taskDateInput.value = "";
  taskTimeInput.value = "";
  taskStatusSelector.value = "To Do";
}

function addNote() {
  const note = {
    id: crypto.randomUUID(),
    text: noteInput.value.trim(),
    color: selectedNoteColor || null,
  };
  if (!note.text) return;

  allNotes.push(note);
  saveNotes();
  renderNotes();
  addActivity("Added a note", "note");

  noteCreationDiv.style.display = "none";
  noteInput.value = "";
  noteInput.style.backgroundColor = "";
  selectedNoteColor = null;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(allNotes));
}

let selectedIndex = -1

function updateHighlightedResult(searchResults) {
  searchResults.forEach((item, index) => {
    if (index === selectedIndex) {
      item.style.backgroundColor = isDark() ? "#17171c" : "#f8f8f8";
    } else {
      item.style.backgroundColor = "";
    }
  });

  if (searchResults[selectedIndex]) {
    searchResults[selectedIndex].scrollIntoView({ block: "nearest" });
  }
}

function handleSearchKeys(e) {
  const searchResults = document.querySelectorAll(".searchResult");

  if (searchResults.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex = (selectedIndex + 1) % searchResults.length;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex = (selectedIndex - 1 + searchResults.length) % searchResults.length;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    if (selectedIndex >= 0) {
      searchResults[selectedIndex].click();
    }
    searchBar.blur();
    searchBar.value = "";
    searchResultsMenu.classList.remove("show");
    return;
  }

  if (e.key === "Escape") {
    searchResultsMenu.classList.remove("show");
    return;
  }

  updateHighlightedResult(searchResults);
}

function normalizeStr(str) {
  return str.toLowerCase().trim();
}

function isWordStart(text, index) {
  return index === 0 || text[index - 1] === " ";
}

function fuzzyScore(query, text) {
  const searchQuery = normalizeStr(query);
  const searchText = normalizeStr(text);

  let score = 0;
  let queryIndex = 0;
  let lastMatchIndex = -1;
  let gapPenalty = 0;

  for (let i = 0; i < searchText.length; i++) {
    if (searchText[i] === searchQuery[queryIndex]) {
      score += 2;

      if (lastMatchIndex !== -1) {
        gapPenalty += (i - lastMatchIndex) - 1;
      }

      lastMatchIndex = i;

      if (isWordStart(searchText, i)) score += 5;

      if (i > 0 && searchText[i - 1] === searchQuery[queryIndex - 1]) score += 3;

      queryIndex++;

      if (queryIndex === searchQuery.length) break;
    }
  }

  return queryIndex === searchQuery.length ? Math.max(score - gapPenalty, 1) : 0;
}

function highlightMatch(text, query) {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  let result = "";
  let queryIndex = 0;

  for (let i = 0; i < text.length; i++) {
    if (queryIndex < normalizedQuery.length && normalizedText[i] === normalizedQuery[queryIndex]) {
      result += `<mark class="matchHighlight">${text[i]}</mark>`;
      queryIndex++;
    } else {
      result += text[i];
    }
  }

  return result;
}

function searchBarMagic() {
  selectedIndex = -1

  const searchQuery = normalizeStr(searchBar.value);
  
  searchResultsMenu.innerHTML = "";

  if (!searchQuery) {
    searchResultsMenu.style.display = "none";
    return;
  }

  let searchResults = [];

  document.querySelectorAll(".listTask").forEach(task => {
    const taskTextSpanEl = task.querySelector(".taskTextSpan")
    if (!taskTextSpanEl) return;
    const taskText = taskTextSpanEl.dataset.originalTaskText;
    if (!taskText) return;

    let score = 0;

    if (taskText.toLowerCase().includes(searchQuery)) {
      score = 1000;
    } else {
      score = fuzzyScore(searchQuery, taskText);
    }

    if (score > 0) {
      searchResults.push({ type: "task", text: taskText, element: task, score });
    }
  });

  document.querySelectorAll(".listNote").forEach(note => {
    const noteText = note.querySelector(".mainNoteText").dataset.originalNoteText;
    if (!noteText) return;

    let score = 0;

    if (noteText.toLowerCase().includes(searchQuery)) {
      score = 1000;
    } else {
      score = fuzzyScore(searchQuery, noteText);
    }

    if (score > 0) {
      searchResults.push({ type: "note", text: noteText, element: note, score });
    }
  });

  if (searchResults.length === 0) {
    searchResultsMenu.style.display = "none";
    return;
  }

  searchResults.sort((a, b) => b.score - a.score);
  selectedIndex = Math.min(selectedIndex, searchResults.length - 1);
  if (selectedIndex < 0) selectedIndex = 0;

  searchResultsMenu.style.display = "block";

  searchResults.slice(0, 6).forEach(result => {
    const searchResult = document.createElement("li");
    searchResult.className = "searchResult";

    const searchResultIcon = document.createElement("img");
    searchResultIcon.className = `searchResultIcon searchResultIcon--${result.type}`;

    if (result.type === "task") {
      searchResultIcon.src = "Images/Checkmark.png";
      searchResultIcon.alt = "Task Icon";
    } else if (result.type === "note") {
      searchResultIcon.src = "Images/Note-Icon.png";
      searchResultIcon.alt = "Note Icon";
    } else {
      searchResultIcon.src = "";
      searchResultIcon.alt = "";
    }

    const searchResultText = document.createElement("span");
    searchResultText.className = "searchResultText";
    searchResultText.innerHTML = highlightMatch(result.text, searchQuery);

    searchResult.appendChild(searchResultIcon);
    searchResult.appendChild(searchResultText);

    searchResult.addEventListener("click", () => {
      result.element.scrollIntoView({ behavior: "smooth", block: "center" });
      searchResultsMenu.style.display = "none";
    });

    searchResultsMenu.appendChild(searchResult);
  });
  const renderedResults = searchResultsMenu.querySelectorAll(".searchResult");
  updateHighlightedResult(renderedResults); 

  console.log("Search results:", searchResults);

  searchResultsMenu.classList.add("show");
}

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault();
    searchBar.focus();
  }
})

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    searchDiv.classList.add("scrolled");
  } else {
    searchDiv.classList.remove("scrolled");
  }
});

document.addEventListener("click", (e) => {
  document.querySelectorAll(".taskOptions").forEach((menu) => {
    menu.classList.remove("show");
  });

  if (!searchDiv.contains(e.target)) {
    searchResultsMenu.classList.remove("show");
  }
});

searchBar.addEventListener("keydown", handleSearchKeys);

function debounce(func, delay) {
  let timeout;
  
  return function(...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  }
}

searchBar.addEventListener("input", debounce(searchBarMagic, 150));

searchBar.addEventListener("focus", () => {
  selectedIndex = -1;
});

function isDark() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function responsiveWebsite() {
  if (window.innerWidth < 768) {
    console.log("Mobile");
    hamburgerBtn.style.display = "flex";
    sidebar.style.display = "none";
    section1.style.flexDirection = "column";
    section2.style.flexDirection = "column";
    mainContent.style.alignItems = "center";
    mainContent.style.marginLeft = "0px";
  } else {
    console.log("Desktop");
    hamburgerBtn.style.display = "none";
    sidebar.style.display = "flex";
    section1.style.flexDirection = "row";
    section2.style.flexDirection = "row";
    mainContent.style.alignItems = "flex-start";
    mainContent.style.marginLeft = "300px";
  }
}

hamburgerBtn.addEventListener("click", () => {
  const isSidebar = document.documentElement.classList.toggle("isSidebar");

  if (isSidebar) {
    hamburgerBtn.style.display = "none";
    sidebar.style.display = "flex";
    closeSidebarBtn.style.display = "flex";
    showOverlay();

    document
      .querySelectorAll("body > :not(.sidebar):not(.overlay)")
      .forEach((el) => (el.inert = true));

    overlay.addEventListener("click", () => {
      hamburgerBtn.click();
    });
  } else {
    hamburgerBtn.style.display = "flex";
    sidebar.style.display = "none";
    closeSidebarBtn.style.display = "none";
    hideOverlay();
    document
      .querySelectorAll("body > :not(.sidebar):not(.overlay)")
      .forEach((el) => (el.inert = false));
  }
});

closeSidebarBtn.addEventListener("click", () => {
  hamburgerBtn.click();
});

window.addEventListener("resize", responsiveWebsite);
responsiveWebsite();

document.addEventListener("DOMContentLoaded", () => {
  taskCreationDiv.style.display = "none";

  searchBar.value = "";

  closeSidebarBtn.style.display = "none";

  taskPrioritySelector.value = "None";
  taskDateInput.value = "";
  taskTimeInput.value = "";
  taskStatusSelector.value = "To Do";

  refreshTaskDropdown();

  noteInput.value = "";

  const savedNotes = safeParse("notes");
  savedNotes.forEach(note => {
    createNoteElement(note);
  });

  const savedAskForNotiDisplay = localStorage.getItem("askForNotiDisplay");
  if (savedAskForNotiDisplay) {
    document.body.removeChild(askForNotifications);
    sidebar.style.marginTop = "0px";
    toDoList.style.marginTop = "0px";
  } else {
    document.body.appendChild(askForNotifications);
    sidebar.style.marginTop = "0px";
    toDoList.style.marginTop = "0px";
  }

  loadActivities();

  var calendarEl = document.getElementById("calendar");
  if (calendarEl) {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "",
        center: "prev,title,next",
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      },
      dateClick: function (info) {
        taskCreationDiv.style.display = "flex";
        taskCreationDiv.style.position = "fixed";
        taskCreationDiv.style.zIndex = "9999";
        taskCreationDiv.style.top = "50%";
        taskCreationDiv.style.left = "50%";
        taskCreationDiv.style.transform = "translate(-50%, -50%)";

        showOverlay();

        taskDateInput.value = info.dateStr;

        document.body.appendChild(taskCreationDiv);

        document.querySelector(".cancelTaskCreationBtn").addEventListener("click", () => {
          taskCreationDiv.style.display = "none";
          taskCreationDiv.style.position = "relative";
          taskCreationDiv.style.zIndex = "0";
          taskCreationDiv.style.top = "0px";
          taskCreationDiv.style.left = "0px";
          taskCreationDiv.style.transform = "none";

          hideOverlay();

          taskInput.value = "";
          taskDateInput.value = "";

          toDoList.insertBefore(taskCreationDiv, toDoListHeader.nextSibling);
        });

        document.querySelector(".addTaskBtn").addEventListener("click", () => {
          addTask();

          taskCreationDiv.style.display = "none";
          taskCreationDiv.style.position = "relative";
          taskCreationDiv.style.top = "0px";
          taskCreationDiv.style.left = "0px";
          taskCreationDiv.style.transform = "none";
          taskCreationDiv.style.order = "0";

          addTaskBtn.textContent = "Add Task";
          addTaskBtn.style.padding = "0px 10px";

          hideOverlay();

          taskInput.value = "";
          taskDateInput.value = "";

          toDoList.insertBefore(taskCreationDiv, toDoListHeader.nextSibling);
        });
      },
    });
    calendar.render();
  } else {
    console.error("Calendar error");
  }

  tasks.forEach(task => {
    createTaskElement(task);
  });
  renderCalendarEvents();
});

function renderCalendarEvents() {
  if (!calendar) return;

  calendar.getEvents().forEach(event => event.remove());

  tasks.forEach(task => {
    addTaskToCalendar(task);
  });
}

function saveEditedTask() {
  const task = tasks.find(t => String(t.id) === String(editingTaskId));
  if (!task) return;
  
  task.title = taskInput.value.trim();
  task.priority = taskPrioritySelector.value;
  task.dueDate = taskDateInput.value || null;
  task.dueTime = taskTimeInput.value || null;
  task.status = taskStatusSelector.value;

  saveTasks();
  taskList.innerHTML = "";
  tasks.forEach(createTaskElement);
  editingTaskId = null;
  isEditing = false;
  taskCreationDiv.style.display = "none";
  hideOverlay();
}

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
  document.body.removeChild(askForNotifications);
  localStorage.setItem("askForNotiDisplay", "none");

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
    themeBtn.innerHTML = `<img src="Images/Dark-Mode-Icon.png" alt="Dark Mode Icon" class="themeIcon">`;
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeBtn.innerHTML = `<img src="Images/Light-Mode-Icon.png" alt="Light Mode Icon" class="themeIcon">`;
  }
});

aiAssistantBtn.addEventListener("click", () => {
  const isaiView = document.documentElement.classList.toggle("aiView");

  if (isaiView) {
    const aiDiv = document.createElement("div");
    aiDiv.className = "aiDiv";

    const aiName = document.createElement("div");
    aiName.className = "aiName";
    aiName.textContent = "ai Assistant";
    aiDiv.appendChild(aiName);

    const aiPrioritySuggestionBtn = document.createElement("button");
    aiPrioritySuggestionBtn.className = "aiPrioritySuggestionBtn";
    aiPrioritySuggestionBtn.textContent = "Start Analysis";

    const aiPrioritySuggestions = document.createElement("div");
    aiPrioritySuggestions.className = "aiPrioritySuggestions";

    aiPrioritySuggestionBtn.addEventListener("click", async () => {
      aiPrioritySuggestions.textContent = "Thinking...";

      const raw = await getSuggestedPriorities();
      if (raw.error) {
        aiPrioritySuggestions.textContent =
          "ai is busy right now. Try again in a moment.";
        return;
      }

      const result = JSON.parse(raw);

      aiPrioritySuggestions.innerHTML = "";
      result.priorities.forEach((item, index) => {
        const entry = document.createElement("div");
        entry.className = "aiResultEntry";
        entry.innerHTML = `<strong>${index + 1}. ${item.title}</strong><p>${item.reason}</p>`;
        aiPrioritySuggestions.appendChild(entry);
      });
    });

    aiDiv.append(aiPrioritySuggestionBtn, aiPrioritySuggestions);
    document.body.appendChild(aiDiv);
    showOverlay();
    document
      .querySelectorAll("body > :not(.aiDiv):not(.overlay)")
      .forEach((el) => (el.inert = true));
  } else {
    hideOverlay();
    document.querySelector(".aiDiv")?.remove();
    document.querySelectorAll("body >  *").forEach((el) => (el.inert = false));
  }
});

decrastinatorBtn.addEventListener("click", () => {
  const isDecrastinatorView =
    document.documentElement.classList.toggle("decrastinatorView");

  if (isDecrastinatorView) {
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
    decrastinatorTaskSelector.innerHTML = "";

    const decrastinatorTaskSelectorPlaceholder =
      document.createElement("option");
    decrastinatorTaskSelectorPlaceholder.className =
      "decrastinatorTaskSelectorPlaceholder";
    decrastinatorTaskSelectorPlaceholder.textContent = "Select a task";
    decrastinatorTaskSelectorPlaceholder.disabled = true;
    decrastinatorTaskSelectorPlaceholder.selected = true;

    decrastinatorTaskSelector.appendChild(decrastinatorTaskSelectorPlaceholder);

    tasks.forEach((task) => {
      if (!task.completed) {
        const decrastinationTaskOption = document.createElement("option");
        decrastinationTaskOption.value = task.id;
        decrastinationTaskOption.textContent = task.title;
        decrastinatorTaskSelector.appendChild(decrastinationTaskOption);
      }
    });

    const startDecrastinatorBtn = document.createElement("div");
    startDecrastinatorBtn.className = "startDecrastinatorBtn";
    startDecrastinatorBtn.innerHTML = `<img src="Images/Start-Timer-Icon.png" class="startDecrastinatorIcon w-4">`;

    decrastinatorDiv.appendChild(startDecrastinatorBtn);
    startDecrastinatorBtn.addEventListener("click", () => {
      if (decrastinatorIsRunning) return;
      decrastinatorIsRunning = true;

      const selectedTaskId = decrastinatorTaskSelector.value;

      if (!selectedTaskId) return;

      const task = tasks.find(t => String(t.id) === String(selectedTaskId));
      if (!task) return;

      if (task) {
        currentFocusedTask.textContent = task.title;
      }

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
    document.body.appendChild(decrastinatorDiv);
    showOverlay();
    document
      .querySelectorAll("body > :not(.decrastinatorDiv):not(.overlay)")
      .forEach((el) => (el.inert = true));
  } else {
    hideOverlay();
    document.querySelector(".decrastinatorDiv")?.remove();
    document.querySelectorAll("body >  *").forEach((el) => (el.inert = false));
    clearInterval(decrastinatorIntervalId);
  }
});

window.addEventListener("load", () => {
  if (isDark()) {
    themeBtn.innerHTML = `<img src="Images/Light-Mode-Icon.png" alt="Light Mode Icon" class="themeIcon">`;
  } else {
    themeBtn.innerHTML = `<img src="Images/Dark-Mode-Icon.png" alt="Dark Mode Icon" class="themeIcon">`;
  }
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.removeAttribute("data-theme");
}

noTasksYetAlert.style.display = "inline";
noNotesYetAlert.style.display = "inline";

function normalizeTaskStatus(status) {
  if (!status) return "to-do";
  const normalized = status.toLowerCase().replace(/\s/g, "-");

  if (normalized === "todo") return "to-do";
  if (normalized === "in-progress") return "in-progress";
  if (normalized === "done") return "done";

  return normalized;
}

listAndKanbanToggle.addEventListener("click", () => {
  isDraggable = !isDraggable;

  const allTasks = document.querySelectorAll(".mainTask");
  allTasks.forEach((task) => {
    task.draggable = isDraggable;

    task.style.cursor = isDraggable ? "grab" : "default";

    if (task.dataset.status === "done") {
      allDoneDropZone.appendChild(task);
    } else if (task.dataset.status === "in-progress") {
      inProgressDropZone.appendChild(task);
    } else {
      toDoDropZone.appendChild(task);
    }
  });

  taskList.classList.toggle("drag-mode", isDraggable);
  document.body.classList.toggle("isKanbanView");

  dropZones.style.display = isDraggable ? "flex" : "none";

  noTasksYetAlert.style.display = "none";
});

let currentDraggedTask = null;

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

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const draggedTask = document.querySelector(`[data-id="${taskId}"]`);
    if (!draggedTask) return;

    const task = tasks.find(t => String(t.id) === String(taskId));
    if (!task) return;

    const newStatus = normalizeTaskStatus(zone.dataset.status);
    task.status = newStatus;

    draggedTask.dataset.status = zone.dataset.status;
    draggedTask.classList.toggle("completed", newStatus === "done");
    zone.appendChild(draggedTask);

    saveTasks();
  });
});

addBtn.addEventListener("click", () => {
  taskCreationDiv.style.display = "flex";
  taskInput.value = "";
  taskPrioritySelector.value = "None";
  taskDateInput.value = "";
  taskTimeInput.value = "";
  taskStatusSelector.value = "To Do";
  toDoList.style.height = "495px";
  focusTimer.style.height = "496.5px";
});

cancelTaskCreationBtn.addEventListener("click", () => {
  taskCreationDiv.style.display = "none";
  toDoList.style.height = "328.5px";
  focusTimer.style.height = "330px";
});

addTaskBtn.addEventListener("click", () => {
  if (editingTaskId) {
    saveEditedTask();
  } else {
    addTask();
  }
  showNoTasksYet();
});

function showNoTasksYet() {
  if (taskList.children.length === 0) {
    noTasksYetAlert.style.display = "inline";
  } else {
    noTasksYetAlert.style.display = "none";
  }
}

function showNoNotesYet() {
  if (notesList.children.length === 0) {
    noNotesYetAlert.style.display = "inline";
  } else {
    noNotesYetAlert.style.display = "none";
  }
}

function updateTasksDoneCount() {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.completed).length;
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

function checkTaskDue(listTask, taskText, task) {
  const checkbox = listTask.querySelector("input[type='checkbox']");
  if (Notification.permission !== "granted" || task.completed) return;

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const dueDate = listTask.dataset.dueDate;
  const dueTime = listTask.dataset.dueTime;
  if (dueDate === today && listTask.dataset.dateNotified !== "true") {
    new Notification("Task Due Today", {
      body: `Your task "${taskText}" is due today.`,
    });
    listTask.dataset.dateNotified = "true";
  }

  if (
    dueDate === today &&
    dueTime &&
    listTask.dataset.timeNotified !== "true"
  ) {
    const [hour, minute] = dueTime.split(":").map(Number);

    const due = new Date(now);
    due.setHours(hour, minute, 0, 0);
    if (now >= due) {
      new Notification("Task Due Now", {
        body: `Your task "${taskText}" is due now.`,
      });
      listTask.dataset.timeNotified = "true";
    }
  }
}

function loadActivities() {
  activityList.innerHTML = "";

  if (activityLog.length === 0) {
    activityList.innerHTML = "<li class='activityItem'>No activities yet</li>";
    return;
  }

  activityLog.forEach(renderActivity);
}

function getActivityLog() {
  return safeParse("activityLog");
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

function getActivityIcon(type) {
  const activityIcons = {
    task: "Images/Checkmark.png",
    note: "Images/Note-Icon.png",
    focus: "Images/Clock.png",
    delete: "Images/Delete-Icon.png",
  };
  const normalizedActivityType = type?.toLowerCase().trim();
  return activityIcons[normalizedActivityType] || "";
}

function renderActivity(activity) {
  const activityItem = document.createElement("li");
  activityItem.className = `activityItem activityItem--${activity.type}`;

  const activityIcon = document.createElement("img");
  activityIcon.className = `activityIcon activityIcon--${activity.type}`;
  activityIcon.src = getActivityIcon(activity.type);
  activityIcon.alt = activity.type;
  activityIcon.onerror = () => {
    activityIcon.style.display = "none";
  }

  const activityMainContent = document.createElement("div");
  activityMainContent.className = "activityMainContent";

  const activityMessage = document.createElement("div");
  activityMessage.className = "activityMessage";
  activityMessage.textContent = activity.message;

  const activityTime = document.createElement("div");
  activityTime.className = "activityTime";
  activityTime.textContent = getTimeAgo(activity.timestamp);

  activityItem.appendChild(activityIcon);
  activityMainContent.appendChild(activityMessage)
  activityMainContent.appendChild(activityTime);
  activityItem.appendChild(activityMainContent);
  activityList.appendChild(activityItem);
}

function addActivity(message, type = "info") {
  if (!message) return;

  const activity = {
    id: crypto.randomUUID(),
    message,
    type,
    timestamp: Date.now(),
  };

  if (activityLog.length > 50) {
    activityLog.pop();
  }

  activityLog.unshift(activity);
  localStorage.setItem("activityLog", JSON.stringify(activityLog));
  loadActivities();
}

function refreshTaskDropdown() {
  taskSelectionDropdown.innerHTML = "";

  tasks.forEach(task => {
    if (!task.completed) {
      const option = document.createElement("option");
      option.value = task.id;
      option.textContent = task.title;
      taskSelectionDropdown.appendChild(option);
    }
  })
}

function renderNotes() {
  if (!notesList) return;
  notesList.innerHTML = "";
  allNotes.forEach(createNoteElement);
}

setInterval(() => {
  tasks.forEach(task => {
    const listTask = document.getElementById(task.id);
    if (!listTask) return;

    const taskText = task.title;
    checkTaskDue(listTask, taskText, task);
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

  if (!taskSelectionDropdown.value) return;
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
  addActivity(`Started focus session: ${selectedFocusedTask}`, "focus");
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

addBtn2.addEventListener("click", () => {
  noteCreationDiv.style.display = "flex";
});

let selectedNoteColor = null;

noteColorOptions.forEach((button) => {
  button.addEventListener("click", () => {
    selectedNoteColor = button.dataset.color;
    noteInput.style.backgroundColor = selectedNoteColor;
  });
});

cancelNoteCreationBtn.addEventListener("click", () => {
  noteCreationDiv.style.display = "none";
  noteInput.style.backgroundColor = "";
  selectedNoteColor = null;
});

addNoteBtn.addEventListener("click", () => {
  addNote();
  showNoNotesYet();
});

notesList.addEventListener("mouseover", (e) => {
  const closestMainNote = e.target.closest(".mainNote");
  if (!closestMainNote) return;

  const editNoteBtn = closestMainNote.querySelector(".editNoteBtn");
  const deleteNoteBtn = closestMainNote.querySelector(".deleteNoteBtn");
  if (editNoteBtn) editNoteBtn.style.display = "flex";
  if (deleteNoteBtn) deleteNoteBtn.style.display = "flex";

  closestMainNote.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
});

notesList.addEventListener("mouseout", (e) => {
  const closestMainNote = e.target.closest(".mainNote");
  if (!closestMainNote) return;
  const editNoteBtn = closestMainNote.querySelector(".editNoteBtn");
  const deleteNoteBtn = closestMainNote.querySelector(".deleteNoteBtn");
  if (editNoteBtn) editNoteBtn.style.display = "none";
  if (deleteNoteBtn) deleteNoteBtn.style.display = "none";
  closestMainNote.style.boxShadow = "none";
});

notesList.addEventListener("click", (e) => {
  const closestMainNote = e.target.closest(".mainNote");
  if (!closestMainNote) return;

  if (e.target.closest(".editNoteBtn")) {
    showOverlay();

    const isEditingNote = document.documentElement.classList.toggle("editingNote");

    if (isEditingNote) {
      const noteId = closestMainNote.closest(".listNote").id.replace("note-", "");
      const note = allNotes.find(n => n.id === noteId);
      if (!note) return;

      editingNoteColor = note.color || null;

      const noteEditDiv = document.createElement("div");
      noteEditDiv.className = "noteEditDiv";

      const noteEditInput = document.createElement("textarea");
      noteEditInput.className = "noteEditInput";
      noteEditInput.value = closestMainNote.querySelector(".mainNoteText").textContent;
      noteEditInput.placeholder = "Edit your note...";
      noteEditInput.style.backgroundColor = note.color || "";

      const editNoteColorOptions = document.querySelector(".noteColorOptions").cloneNode(true);

      editNoteColorOptions.style.flexDirection = "column";
      editNoteColorOptions.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          editingNoteColor = button.dataset.color;
          noteEditInput.style.backgroundColor = editingNoteColor;
        });
      })

      const editNoteOptions = document.createElement("div");
      editNoteOptions.className = "editNoteOptions";

      const cancelNoteEditBtn = document.createElement("button");
      cancelNoteEditBtn.className = "cancelNoteEditBtn";
      cancelNoteEditBtn.textContent = "Cancel";

      const saveNoteBtn = document.createElement("button");
      saveNoteBtn.className = "saveNoteBtn";
      saveNoteBtn.textContent = "Save";

      noteEditDiv.appendChild(noteEditInput);
      noteEditDiv.appendChild(editNoteColorOptions);
      editNoteOptions.appendChild(cancelNoteEditBtn);
      cancelNoteEditBtn.addEventListener("click", () => {
        document.documentElement.classList.remove("editingNote");
        noteEditDiv.remove();
        editingNoteColor = null;
        hideOverlay();
      });
      editNoteOptions.appendChild(saveNoteBtn);
      saveNoteBtn.addEventListener("click", () => {
        const newNoteText = noteEditInput.value.trim();
        if (!newNoteText) return;

        note.text = newNoteText;
        note.color = editingNoteColor ?? note.color;

        editingNoteColor = null;

        saveNotes();
        renderNotes();
        document.documentElement.classList.remove("editingNote");
        noteEditDiv.remove();
        hideOverlay();
      })
      noteEditDiv.appendChild(editNoteOptions);
      document.body.appendChild(noteEditDiv);
    }
  }

  if (e.target.closest(".deleteNoteBtn")) {
    const listNote = e.target.closest(".listNote");
    if (!listNote) return;
    const noteId = listNote.id.replace("note-", "");

    const noteIndex = allNotes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
      allNotes.splice(noteIndex, 1);
      saveNotes();
      renderNotes();
      showNoNotesYet();
      addActivity("Deleted a note", "delete");
    }
  }
});

function getTasksAsData() {
  const items = tasks;
  return items.map((task) => ({
    title: task.title,
    dueDate: task.dueDate || null,
    dueTime: task.dueTime || null,
    priority: task.priority || null,
    status: task.status || null,
    done: task.completed || false,
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
