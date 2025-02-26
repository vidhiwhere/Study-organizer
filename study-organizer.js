     // Get necessary elements
     const inputBox = document.getElementById('inputBox');
     const addBtn = document.getElementById('addBtn');
     const todoList = document.getElementById('todoList');
     const notesList = document.getElementById('notes-list');
     
     let editTodo = null;
     
     // Section Navigation Logic
     document.getElementById('todo-section-btn').addEventListener('click', () => {
         document.getElementById('main-screen').classList.add('hidden');
         document.getElementById('todo-section').classList.remove('hidden');
         closePopup(); // Ensure popups are closed when switching
     });
     
     document.getElementById('notes-section-btn').addEventListener('click', () => {
         document.getElementById('main-screen').classList.add('hidden');
         document.getElementById('notes-section').classList.remove('hidden');
         closePopup(); // Ensure popups are closed when switching
     });
     
     /*************************************************************************
      * To-Do List Logic
      **************************************************************************/
     
     // Function to add todo
     const addTodo = () => {
         const inputText = inputBox.value.trim();
         if (inputText.length <= 0) {
             alert("You must write something in your to-do");
             return false;
         }
     
         if (addBtn.value === "Edit") {
             editLocalTodos(editTodo.target.previousElementSibling.innerHTML);
             editTodo.target.previousElementSibling.innerHTML = inputText;
             addBtn.value = "Add";
             inputBox.value = "";
         } else {
             const li = document.createElement("li");
             const p = document.createElement("p");
             p.innerHTML = inputText;
             li.appendChild(p);
     
             const editBtn = document.createElement("button");
             editBtn.innerText = "Edit";
             editBtn.classList.add("btn", "editBtn");
             li.appendChild(editBtn);
     
             const deleteBtn = document.createElement("button");
             deleteBtn.innerText = "Remove";
             deleteBtn.classList.add("btn", "deleteBtn");
             li.appendChild(deleteBtn);
     
             todoList.appendChild(li);
             inputBox.value = "";
     
             saveLocalTodos(inputText);
         }
     };
     
     // Function to update (Edit/Delete) todo
     const updateTodo = (e) => {
         if (e.target.innerHTML === "Remove") {
             todoList.removeChild(e.target.parentElement);
             deleteLocalTodos(e.target.parentElement);
         }
     
         if (e.target.innerHTML === "Edit") {
             inputBox.value = e.target.previousElementSibling.innerHTML;
             inputBox.focus();
             addBtn.value = "Edit";
             editTodo = e;
         }
     };
     
     // Function to save todos in localStorage
     const saveLocalTodos = (todo) => {
         let todos = JSON.parse(localStorage.getItem("todos")) || [];
         todos.push(todo);
         localStorage.setItem("todos", JSON.stringify(todos));
     };
     
     // Function to get todos from localStorage
     const getLocalTodos = () => {
         const todos = JSON.parse(localStorage.getItem("todos")) || [];
         todos.forEach(todo => {
             const li = document.createElement("li");
             const p = document.createElement("p");
             p.innerHTML = todo;
             li.appendChild(p);
     
             const editBtn = document.createElement("button");
             editBtn.innerText = "Edit";
             editBtn.classList.add("btn", "editBtn");
             li.appendChild(editBtn);
     
             const deleteBtn = document.createElement("button");
             deleteBtn.innerText = "Remove";
             deleteBtn.classList.add("btn", "deleteBtn");
             li.appendChild(deleteBtn);
     
             todoList.appendChild(li);
         });
     };
     
     // Function to delete todos from localStorage
     const deleteLocalTodos = (todo) => {
         const todos = JSON.parse(localStorage.getItem("todos")) || [];
         const todoText = todo.children[0].innerHTML;
         const updatedTodos = todos.filter(t => t !== todoText);
         localStorage.setItem("todos", JSON.stringify(updatedTodos));
     };
     
     // Function to edit todos in localStorage
     const editLocalTodos = (todo) => {
         const todos = JSON.parse(localStorage.getItem("todos")) || [];
         const todoIndex = todos.indexOf(todo);
         todos[todoIndex] = inputBox.value;
         localStorage.setItem("todos", JSON.stringify(todos));
     };
     
     // Initialize To-Do List
     addBtn.addEventListener('click', addTodo);
     todoList.addEventListener('click', updateTodo);
     // Make To-Do List Sortable
     const sortable = new Sortable(todoList, {
         animation: 150,
         onEnd: () => {
             const items = Array.from(todoList.children).map(li => li.textContent.trim());
             localStorage.setItem('todos', JSON.stringify(items));
         }
     });
     
     document.addEventListener('DOMContentLoaded', getLocalTodos);
     
     /*************************************************************************
      * Notes Logic
      **************************************************************************/
     
     // Function to open the popup for creating a new note
     function popup() {
         closePopup(); // Ensure only one popup is active
         const popupContainer = document.createElement("div");
         popupContainer.setAttribute("id", "popupContainer");
         popupContainer.innerHTML = `
             <div id="popupContent">
                 <h1>New Note</h1>
                 <textarea id="note-text" placeholder="Enter your note..."></textarea>
                 <div id="btn-container">
                     <button id="submitBtn" onclick="createNote()">Create Note</button>
                     <button id="closeBtn" onclick="closePopup()">Close</button>
                 </div>
             </div>
         `;
         document.body.appendChild(popupContainer);
     }
     
     // Function to close the popup
     function closePopup() {
         const popupContainer = document.getElementById("popupContainer");
         if (popupContainer) {
             popupContainer.remove();
         }
     }
     
     // Function to create a new note
     function createNote() {
         const noteText = document.getElementById('note-text').value.trim();
         if (noteText !== '') {
             const note = { id: Date.now(), text: noteText };
             const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
             existingNotes.push(note);
             localStorage.setItem('notes', JSON.stringify(existingNotes));
             closePopup();
             displayNotes();
         }
     }
     
     // Function to display all notes
     function displayNotes() {
         notesList.innerHTML = '';
         const notes = JSON.parse(localStorage.getItem('notes')) || [];
         notes.forEach(note => {
             const listItem = document.createElement('li');
             listItem.innerHTML = `
                 <span>${note.text}</span>
                 <div id="noteBtns-container">
                     <button id="editBtn" onclick="editNote(${note.id})"><i class="fa-solid fa-pen"></i></button>
                     <button id="deleteBtn" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
                 </div>
             `;
             notesList.appendChild(listItem);
         });
     }
     
     // Function to open the edit popup for a note
     function editNote(noteId) {
         closeEditPopup(); // Ensure only one popup is active
         const notes = JSON.parse(localStorage.getItem('notes')) || [];
         const noteToEdit = notes.find(note => note.id === noteId);
         const noteText = noteToEdit ? noteToEdit.text : '';
         const editingPopup = document.createElement("div");
         editingPopup.setAttribute("id", "editing-container");
         editingPopup.setAttribute("data-note-id", noteId);
         editingPopup.innerHTML = `
             <div id="popupContent">
                 <h1>Edit Note</h1>
                 <textarea id="note-text">${noteText}</textarea>
                 <div id="btn-container">
                     <button id="submitBtn" onclick="updateNote()">Done</button>
                     <button id="closeBtn" onclick="closeEditPopup()">Cancel</button>
                 </div>
             </div>
         `;
         document.body.appendChild(editingPopup);
     }
     
     // Function to close the edit popup
     function closeEditPopup() {
         const editingPopup = document.getElementById("editing-container");
         if (editingPopup) {
             editingPopup.remove();
         }
     }
     
     // Function to update a note
     function updateNote() {
         const noteText = document.getElementById('note-text').value.trim();
         const editingPopup = document.getElementById('editing-container');
         if (noteText !== '') {
             const noteId = Number(editingPopup.getAttribute('data-note-id'));
             const notes = JSON.parse(localStorage.getItem('notes')) || [];
             const updatedNotes = notes.map(note => (note.id === noteId ? { id: note.id, text: noteText } : note));
             localStorage.setItem('notes', JSON.stringify(updatedNotes));
             closeEditPopup();
             displayNotes();
         }
     }
     
     // Function to delete a note
     function deleteNote(noteId) {
         const notes = JSON.parse(localStorage.getItem('notes')) || [];
         const updatedNotes = notes.filter(note => note.id !== noteId);
         localStorage.setItem('notes', JSON.stringify(updatedNotes));
         displayNotes();
     }
     
     // Initialize Notes Display
     document.addEventListener('DOMContentLoaded', displayNotes);
     
     function goBackToMain() {
         document.getElementById('todo-section').classList.add('hidden');
         document.getElementById('notes-section').classList.add('hidden');
         document.getElementById('main-screen').classList.remove('hidden');
         closePopup(); // Ensure no popups remain open
     }