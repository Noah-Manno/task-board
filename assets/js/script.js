function readTasksFromStorage() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks) {
        tasks = []
    }
    return tasks;
}

function readNextIdFromStorage() {
    let nextId = JSON.parse(localStorage.getItem("nextId"));
    return nextId
}

// Todo: create a function to generate a unique task id 
function generateTaskId(nextId) {

    if (nextId === null || nextId === undefined) {
        //initialize nextId as 1
        nextId = 1;
    } else {
        //increment nextId by 1
        nextId++;
    }
    return nextId
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let todoCards = $('#todo-cards');
    let inProgressCards = $('#in-progress-cards');
    let doneCards = $('#done-cards');

    let formattedDueDate = dayjs(task.date).format('MMM DD, YYYY');

    let card = $('<div>').addClass('card bg-primary draggable');
    card.attr('data-id', task.id);


    let cardHeader = $('<div>').addClass('card-header').text(task.title);
    let cardBody = $('<div>').addClass('card-body');
    let cardTextOne = $('<p>').addClass('card-text').text(task.description);
    let cardTextTwo = $('<p>').addClass('card-text').text('Due Date: ' + formattedDueDate);
    let button = $('<a>').addClass('btn btn-primary btn-delete').text('Delete')
    button.on('click',function(){
        handleDeleteTask(task.id);
    });

    card.append(cardHeader);
    card.append(cardBody);
    cardBody.append(cardTextOne);
    cardBody.append(cardTextTwo);
    cardBody.append(button);
    if (task.status === "todo") {
        card.addClass
        todoCards.append(card);
    } if (task.status === "in-progress") {
        card.addClass('bg-warning')
        inProgressCards.append(card);
    } if (task.status === "done") {
        card.addClass('bg-light black-text')
        doneCards.append(card);
    }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
                return original.clone().css({
                    width: original.outerWidth(),
                });
        }
    });
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    let tasks = readTasksFromStorage();

    let todoCards = $('#todo-cards');
    let inProgressCards = $('#in-progress-cards');
    let doneCards = $('#done-cards');
    todoCards.empty();
    inProgressCards.empty();
    doneCards.empty();

    tasks.forEach(task => {
        createTaskCard(task);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const saveChanges = $('#save-changes')

saveChanges.on('click', function() {
    handleAddTask()
})

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    
    let taskTitle = $('#task-title');
    let taskTitleInput = taskTitle.val();

    let dueDate = $('#datepicker');
    let dueDateInput = dueDate.val();

    let description = $('#description');
    let descriptionInput = description.val();

    let nextId = readNextIdFromStorage();
    let taskId = generateTaskId(nextId);

    nextId = taskId;
    localStorage.setItem('nextId', nextId);
    console.log(taskId)

    let task = {
        id: taskId,
        title: taskTitleInput, 
        date: dueDateInput,
        description: descriptionInput,
        status: 'todo',
    };

    console.log(task);
    createTaskCard(task);

    let tasks = readTasksFromStorage();
    tasks.push(task)
    let taskList = JSON.stringify(tasks)
    localStorage.setItem('tasks', taskList)
    renderTaskList();

    //clear Inputs
    taskTitle.val('');
    dueDate.val('');
    description.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId){
    let tasks = readTasksFromStorage();

    tasks = tasks.filter(task => task.id !== taskId);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = parseInt(ui.draggable[0].dataset.id);
    const newStatus = event.target.id;
    let tasks = readTasksFromStorage();
    console.log(taskId);
    console.log(newStatus);

   for (let task of tasks) {
    if (task.id === taskId) {
        task.status = newStatus;
    }
   }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $(".status-lane").droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
})