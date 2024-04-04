// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let tasks = []

// Todo: create a function to generate a unique task id 
function generateTaskId() {

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
    let formattedDueDate = dayjs(task.dueDate).format('MMM DD, YYYY');

    let card = $('<div>').addClass('card bg-primary draggable');
    let cardHeader = $('<div>').addClass('card-header').text(task.title);
    let cardBody = $('<div>').addClass('card-body');
    let cardTextOne = $('<p>').addClass('card-text').text(task.description);
    let cardTextTwo = $('<p>').addClass('card-text').text('Due Date: ' + formattedDueDate);
    let button = $('<a>').addClass('btn btn-primary').text('Delete')

    card.append(cardHeader);
    card.append(cardBody);
    cardBody.append(cardTextOne);
    cardBody.append(cardTextTwo);
    cardBody.append(button);
    todoCards.append(card);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    taskList.forEach(task => {
        createTaskCard(task);
    });

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
    })

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

    let taskId = generateTaskId();

    let task = {
        id: taskId,
        title: taskTitleInput, 
        date: dueDateInput,
        description: descriptionInput,
    };

    console.log(task);
    createTaskCard(task);

    tasks.push(task)
    let taskList = JSON.stringify(tasks)
    localStorage.setItem('tasks', taskList)

    //clear Inputs
    taskTitle.val('');
    dueDate.val('');
    description.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

});

//ADD