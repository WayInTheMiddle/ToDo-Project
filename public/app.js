// 

const priorities = {    // JavaScript Enumeration
   QUAD1: 'Urgent-Important',      //Do first - do it now
   QUAD2: 'Important-NUrgent',     //Decide - Schedule a time to do it
   QUAD3: 'Urgent-NImportant',     //Delegate - Who can do it for me?
   QUAD4: 'NUrgent-NImportant'     //Delete - Eliminate
};
const states = {
   INSERT: 'insert',
   UPDATE: 'update',
   DELETE: 'delete',
   EDIT: 'edit',
   NORMAL: 'normal'
};

// Self-Invoking Functions
var ToDoDataController = (function () {
   // console.log('DataModel has started ... ');
   ////////////  Function Constructor  //////////////////////////////////////////////////////
   var TodoTask = function (id, title, details, priority, fromDate, tillDate, status
   ) {
      this.id = id;
      this.title = title;
      this.details = details;
      this.priority = priority;
      this.fromDate = fromDate;
      this.tillDate = tillDate;
      this.status = status;
      this.states = states.NORMAL; // EDIT / DONE / CANCELLED /TEMPORARY <Internal Control states

   };

   var taskData = {
      allTasks: []
   };

   return {
      addToDo: function (title, details, priority, fromDate, tillDate, status) {
         var newTask, ID;
         // Preparing ID for a new ToDo instance
         if (taskData.allTasks.length > 0) {
            ID = taskData.allTasks[taskData.allTasks.length - 1].id + 1;
         } else {
            ID = 0;
         }

         // create new task and push it into the data structure
         newTask = new TodoTask(ID, title, details, priority, fromDate, tillDate, status);
         taskData.allTasks.push(newTask);
         return newTask;
      },
      editToDo: function (selector) {
         var selectedTask;
         taskData.allTasks.forEach(function (item, index) {
            if (item.id === parseInt(selector.split('-')[2])) {
               selectedTask = item;
            }
         });
         //         task = taskData.allTasks[parseInt(selector.split('-')[2])];  // in question when deleted task
         selectedTask.states = states.EDIT;
         return selectedTask;
      },

      alterToDo: function (newVal) {
         var alteredTask;
         taskData.allTasks.forEach(function (item) {
            if (item.states === states.EDIT) { // To get the item under editting
               item.states = states.NORMAL;        // clearing 'EDIT' states             
               item.title = newVal.title;
               item.details = newVal.details;
               item.priority = newVal.priority;
               item.fromDate = newVal.fromDate;
               item.tillDate = newVal.tillDate;
               item.status = newVal.status;
               alteredTask = item;
            }
         });
         return alteredTask;
      },
      getTaskData: function () {
         return taskData;
      },

      storeTaskData: function () {
         localStorage.setItem("taskSFSJSON", JSON.stringify(taskData));
      },

      deleteToDo: function (selector) {
         var ids, index;
         //////////////   Wrong way to delete item  /////////////////////////////////////        
         //         taskData.allTasks.forEach(function(todo) {
         //            
         //            if(todo.id === ID){
         //               console.log("match found ..." + ID);
         //               taskData.allTasks[ID];
         //            }
         //         });
         ids = taskData.allTasks.map(function (task) {
            return task.id;
         });

         index = ids.indexOf(parseInt(selector.split('-')[2]));
         if (index !== -1) {
            taskData.allTasks.splice(index, 1);
         }
      },

      retrieveTaskData: function () {
         var textTaskData;
         textTaskData = localStorage.getItem("taskSFSJSON");
         if (textTaskData !== null) {
            taskData = JSON.parse(textTaskData);
            return taskData;
         }
         return null;
      },

      testing: function () {
         console.log("Task Data ...." + taskData.allTasks[0].title);

      }

   }
})();

var UIController = (function () {

   // console.log('UIController has started ... ');

   var nodeListForEach = function (list, callback) {
      for (var i = 0; i < list.length; i++) {
         callback(list[i], i);
      }
   };

   var DOMstrings = {
      detailsContainer: '#details-container',
      addModal: '#add-modal',
      taskContainer: '#todo-container',
      taskAdd: '#add-task',
      addTodoBtn: '#add-todo',
      taskCancel: '#cancel-task',
      taskAlter: '#alter-task',
      _title: '#todo-title',
      _details: '#todo-details',
      _fromDate: '#from-date',
      _tillDate: '#till-date',
      _status: '#todo-status',
      saveBtn: '#save-todos',
      priorityQuad1: '#priority-quad1',
      priorityQuad2: '#priority-quad2',
      priorityQuad3: '#priority-quad3',
      priorityQuad4: '#priority-quad4',
      priorityHigh: '#priority-high',
      priorityMed: '#priority-medium',
      priorityLow: '#priority-low',
      inProgressTask: '#in-progress-task',
      doneTask: '#done-task'
   };

   var createTodoItem = function (task) {
      var todoHtml;
      //////////////////////////////////////   ES6  ////////////////////////////////////////////////////////////////////////////
      todoHtml =
         `<div id="item-todo-${task.id}" class="w3-container w3-margin w3-leftbar w3-rightbar w3-theme-d3">
         <div>

            <div class="task-title w3-large w3-margin-top">
               <p><b>${task.title}</b></p>
            </div>

            <div id = "todo-menu-${task.id}"class="todo-menu w3-border" style="display:block; margin: 10px;">

               <i id = "up-slide-${task.id}" class="w3-button fas fa-chevron-up"></i>
               <i id="edit-todo-${task.id}" class="w3-button far fa-edit"></i>
               <i id="delete-todo-${task.id}" class="w3-button fas fa-trash-alt"></i>
               <i id="close-todo-${task.id}" class="w3-button fa fa-close"></i>
            </div>

         </div>

         <div id="todo-content-${task.id}" style="display:block; margin-top: 50px;">
            <hr>
            <div class="w3-panel w3-card-2 w3-theme w3-light-gray">
               <pre>${task.details}</pre>
               <div class="w3-row-padding w3-card-2 w3-theme-l3 w3-margin w3-gray w3-small w3-border-top">
                  <div class="w3-third  w3-center">
                     <p><b>Due Date</b></p>
                     <p>${task.fromDate} ~ ${task.tillDate}</p>
                  </div>
                  <div class="w3-third w3-center">
                     <p><b>Priority</b></p>
                     <p>${task.priority}</p>
                  </div>
                  <div class="w3-third  w3-center">
                     <p><b>Status</b></p>
                     <p>${task.status}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>`;
      // console.log(todoHtml);
      if (task.status === 'In Progress') {
         // document.querySelector('#in-progress-task').append(todoHtml);
         document.querySelector(DOMstrings.inProgressTask).insertAdjacentHTML('beforeend', todoHtml)
      } else {
         // document.querySelector('#done-task').append(todoHtml);
         document.querySelector(DOMstrings.doneTask).insertAdjacentHTML('beforeend', todoHtml)
      }
      // document.querySelector(DOMstrings.inProgressTask).insertAdjacentHTML('beforeend', todoHtml)
   };

   var styleToDo = function (task) {
      var quad1, quad2, quad3, quad4;
      var elem, pos, res;

      elem = document.getElementById('item-todo-' + task.id).getAttribute('class');
      pos = elem.indexOf('w3-border-')

      if (pos == -1) {
         res = elem.concat(" ");
      } else {
         res = elem.slice(0, pos);
      }

      if (task.status === 'In Progress') {
         quad1 = 'w3-border-yellow w3-food-strawberry', quad2 = 'w3-border-purple w3-food-raspberry',
            quad3 = 'w3-border-orange w3-food-lemon', quad4 = 'w3-border-blue w3-food-blueberry';

         let priority = task.priority;     // JavaScript Enumeration

         switch (priority) {
            case priorities.QUAD1:
               res = res.concat(quad1);
               break;
            case priorities.QUAD2:
               res = res.concat(quad2);
               break;
            case priorities.QUAD3:
               res = res.concat(quad3);
               break;
            case priorities.QUAD4:
               res = res.concat(quad4);
               break;
         }
      } else if (task.status === 'Done') {
         res = res.concat('w3-light-gray w3-border-black');
      } else {
         res = res.concat('w3-light-gray w3-border-gray');
      }
      document.getElementById('item-todo-' + task.id).setAttribute("class", res);
   };

   return {
      addToDoUI: function (task) {
         createTodoItem(task);
         styleToDo(task);
      },
      editTodoUI: function (task) {
         var status, i;
         document.querySelector(DOMstrings._title).value = task.title;
         document.querySelector(DOMstrings._details).value = task.details;
         document.querySelector(DOMstrings._fromDate).value = task.fromDate;
         document.querySelector(DOMstrings._tillDate).value = task.tillDate;

         if (task.priority === 'Urgent-Important') {
            document.querySelector(DOMstrings.priorityQuad1).checked = true;
         } else if (task.priority === 'Important-NUrgent') {
            document.querySelector(DOMstrings.priorityQuad2).checked = true;
         } else if (task.priority === 'Urgent-NImportant') {
            document.querySelector(DOMstrings.priorityQuad3).checked = true;
         } else {
            document.querySelector(DOMstrings.priorityQuad4).checked = true;
         };

         // if(task.priority === 'High'){
         //    document.querySelector(DOMstrings.priorityHigh).checked = true;
         // } else if (task.priority === 'Medium'){
         //    document.querySelector(DOMstrings.priorityMed).checked = true;
         // } else {
         //    document.querySelector(DOMstrings.priorityLow).checked = true;
         // };

         status = document.querySelector(DOMstrings._status);
         for (i = 0; i < status.options.length; i++) {
            if (status[i].value === task.status) {
               status.option[i].selected = true;
            }
         };

         // document.querySelector(DOMstrings.taskAddBtn).style.display = 'none';
         document.querySelector('#alter-task').style.display = 'block';  // display Alter button
         document.querySelector('#add-modal').style.display = 'block';
         document.querySelector('#add-task').style.display = 'none';
      },

      alterTodoUI: function (task) {
         createTodoItem(task);
         styleToDo(task);
         // var elem, pTags, preTag;
         // elem = document.getElementById("item-todo-" + task.id);
         // pTags = elem.getElementsByTagName('p');

         // elem.getElementsByTagName('pre')[0].innerText = task.details;
         // pTags[0].firstChild.innerText = task.title;
         // pTags[2].innerText = `${task.fromDate} ~ ${task.tillDate}`;
         // pTags[4].innerText = task.priority;
         // pTags[6].innerText = task.status;



         // console.log('preTag ...' + preTag);
         // console.log('details ...' + task.details);
         // nodeListForEach(pTags, function(pItem, index) {

         //    switch(index){
         //       case 0:
         //          pItem.firstChild.innerText = task.title;
         //          break;
         //       // case 2:
         //       //    pItem.innerText = task.details;
         //       //    break;
         //       case 2:
         //          pItem.innerText = `${task.fromDate} ~ ${task.tillDate}`;
         //          break;
         //       case 4:
         //          pItem.innerText = task.priority;
         //          break;
         //       case 6:
         //          pItem.innerText = task.status;
         //          break;
         //    }
         // });
         // styleToDo(task);
      },

      deleteTodoUI: function (selector) {
         // document.getElementById(selector).style.display = 'none';
         var elem = document.getElementById(selector);
         elem.parentNode.removeChild(elem);
      },

      clearFields: function () {
         var fields, fieldsArr, e;
         fields = document.querySelectorAll(DOMstrings._title + ',' + DOMstrings._details +
            ',' + DOMstrings._fromDate + ',' + DOMstrings._tillDate + ',' + DOMstrings._status);

         fieldsArr = Array.prototype.slice.call(fields);
         fieldsArr.forEach(function (item, index, array) {
            item.value = "";
         });
         document.querySelector(DOMstrings.priorityQuad4).checked = true;
      },

      getInput: function () {
         return {
            title: document.querySelector(DOMstrings._title).value,
            details: document.querySelector(DOMstrings._details).value,
            priority: document.querySelector('input[name = priority]:checked').value,
            fromDate: document.querySelector(DOMstrings._fromDate).value,
            tillDate: document.querySelector(DOMstrings._tillDate).value,
            status: function () {
               var e = document.querySelector(DOMstrings._status);

               return e.options[e.selectedIndex].text;
            }()
         };
      },
      testingUI: function () {
         var list = document.getElementById("todo-menu-8");
         var nodes = list.childNodes;
         var i;
         for (i = 0; i < nodes.length; i++) {
            console.log(nodes[i]);
         }
      }
   }
})();

var controller = (function (dataController, uiController) {

   var handleEvents = function () {
      document.getElementById("add-button").onclick = function () {
         document.getElementById("add-modal").style.display = 'block';
         document.getElementById("add-task").style.display = 'block';
         document.getElementById("alter-task").style.display = 'none';
      };

      document.getElementById("save-button").onclick = saveTasks;

      document.getElementById("show-button").onclick = async function () {

         var taskData;
         // taskData = ToDoDataController.retrieveTaskData();
         taskData = await retrieveRecords();

         if (taskData !== null) {

            console.log('taskData.length...' + taskData.length);
            for (task of taskData) {
               UIController.addToDoUI(task);
            }
            // for(let i = 0; i < taskData.length; i++) {
            //    UIController.addToDoUI(taskData[i]);

            // }


         };
      }

      //////////////////// ToDo Modal Event Handler  ////////////////////////////////
      document.getElementById("add-task").onclick = addTask;
      document.getElementById("alter-task").onclick = alterTask;
      document.getElementById("cancel-task").onclick = function () {
         document.getElementById("add-modal").style.display = 'none';
      };

      document.querySelector("#in-progress-task").onclick = handleItemEvent;
      document.querySelector("#done-task").onclick = handleItemEvent;
   }

   var handleItemEvent = function (event) {
      var selectedItem = "item-todo-" + event.target.id.split('-')[2];
      var selectedContent = "todo-content-" + event.target.id.split('-')[2];
      console.log('event.target.id ...' + event.target.id);
      if (event.target.id.substr(0, 3) === 'clo') {
         document.getElementById(selectedItem).style.display = "none";
      } else if (event.target.id.substr(0, 3) === 'edi') {    // Edit todo
         editTask(selectedItem);
      } else if (event.target.id.substr(0, 3) === 'del') {
         deleteTask(selectedItem);
      } else if (event.target.id.substr(0, 3) === 'dow') {
         var menu = "todo-menu-" + event.target.id.split('-')[2];
         var upElem = `<i id = "up-slide-${event.target.id.split('-')[2]}" class="w3-button fas fa-chevron-up"></i>`;

         document.getElementById(selectedContent).style.display = 'block';
         document.getElementById(event.target.id).remove();
         document.getElementById(menu).insertAdjacentHTML('afterbegin', upElem);
      } else if (event.target.id.substr(0, 4) === 'up-s') {
         var menu = "todo-menu-" + event.target.id.split('-')[2];
         var downElem = `<i id = "down-slide-${event.target.id.split('-')[2]}" class="w3-button fas fa-chevron-down "></i>`;

         document.getElementById(selectedContent).style.display = 'none';
         document.getElementById(event.target.id).remove();
         document.getElementById(menu).insertAdjacentHTML('afterbegin', downElem);
      }
   };
   var editTask = function (selectorItem) {
      var task;
      task = ToDoDataController.editToDo(selectorItem);
      UIController.editTodoUI(task);
   };

   var deleteTask = function (item) {
      console.log(`Delete Event occurred ... ${item}`);
      ToDoDataController.deleteToDo(item);
      // removeRecord(item);
      UIController.deleteTodoUI(item);
   };

   var alterTask = function () {
      var alteredTask, input;
      input = UIController.getInput();
      alteredTask = ToDoDataController.alterToDo(input);
      // updateRecord(alteredTask);
      UIController.deleteTodoUI(`item-todo-${alteredTask.id}`);

      UIController.alterTodoUI(alteredTask);

      UIController.clearFields();
      document.querySelector('#add-modal').style.display = 'none';
      // document.getElementById('task-menu-' + alteredTask.id).style.display = 'none';
      // document.getElementById('todo-btn-' + alteredTask.id).style.display = 'block';
   };

   var addTask = function () {
      console.log("add clicked ...");
      var newTask, data;
      data = uiController.getInput();

      newTask = dataController.addToDo(data.title, data.details, data.priority, data.fromDate, data.tillDate, data.status);
      // dataController.testing();

      // addRecord(newTask);
      UIController.addToDoUI(newTask);
      // UIController.styleToDo(newTask);
      UIController.clearFields();
      document.getElementById("add-modal").style.display = 'none';

   };
   var saveTasks = function () {
      console.log("Save clicked ...");
      ToDoDataController.storeTaskData();
      saveRecords();
   };

   var initTaskData = function () {
      retrieveRecords();
      // var taskData;
      // // taskData = ToDoDataController.retrieveTaskData();
      // taskData = retrieveRecords();

      // if (taskData !== null) {
      //    // taskData.allTasks.forEach(function (task) {
      //    //    UIController.addToDoUI(task);
      //    //    // styleToDo(task);
      //    // });

      //    // for (task of taskData) {
      //    //    UIController.addToDoUI(task);
      //    // }

      //    debugger;
      //    for(let i = 0; i < taskData.length; i++) {
      //       console.log(taskData[i].parse.title);
      //    }
      // taskData.allTasks.filter(function (task) {
      //    console.log(task.fromDate);
      // });
      // }
   };

   // var addRecord = async function (item) {
   //    const data = {
   //       _id: item.id, title: item.title, details: item.details,
   //       priority: item.priority, fromDate: item.fromDate,
   //       tillDate: item.tillDate, status: item.status, states: states.INSERT
   //    };
   //    const options = {
   //       method: 'POST',
   //       headers: {
   //          'Content-Type': 'application/json'
   //       },
   //       body: JSON.stringify(data)
   //    };
   //    const response = await fetch('/todo', options);
   //    const todoJSON = await response.json();
   //    console.log(todoJSON);
   // };

   // var updateRecord = async function (item) {
   //    console.log('updateRecord ...');
   //    const data = {
   //       _id: item.id, title: item.title, details: item.details,
   //       priority: item.priority, fromDate: item.fromDate,
   //       tillDate: item.tillDate, status: item.status, states: states.UPDATE
   //    };
   //    const options = {
   //       method: 'POST',
   //       headers: {
   //          'Content-Type': 'application/json'
   //       },
   //       body: JSON.stringify(data)
   //    };
   //    const response = await fetch('/todo', options);
   //    const todoJSON = await response.json();
   //    console.log(todoJSON);
   // };
   // var removeRecord = async function(item) {
   //    debugger;
   //    const data = {
   //       _id: item.id, title: item.title, details: item.details,
   //       priority: item.priority, fromDate: item.fromDate,
   //       tillDate: item.tillDate, status: item.status, states: states.DELETE
   //    };
   //    const options = {
   //       method: 'POST',
   //       headers: {
   //          'Content-Type': 'application/json'
   //       },
   //       body: JSON.stringify(data)
   //    }
   //    const response = await fetch('/todo', options)
   // };

   var saveRecords = async function () {
      const taskData = ToDoDataController.getTaskData();
      const options = {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(taskData.allTasks)
      };
      const response = await fetch('/todo', options);
      const todoJSON = await response.json();
      console.log(todoJSON);
   };

   var retrieveRecords = async function () {
      console.log('retrieveRecords ...');
      const response = await fetch('/todo');
      const taskData = await response.json();
      ToDoDataController.getTaskData().allTasks = taskData;
      if (taskData !== null) {
         // taskData.forEach(function (task) {
         //    UIController.addToDoUI(task);

         // });

         for (task of taskData) {
            UIController.addToDoUI(task);
         }
      }
   }

      return {
         init: function () {
            console.log('Application - ToDo has started ... ');

            initTaskData();

            handleEvents();
         }
      };

   })(ToDoDataController, UIController);

   controller.init();